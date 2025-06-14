import { NextRequest } from "next/server";
import { logApiRequest } from "@/lib/utils/logging-utils";
import { currentUser } from "@clerk/nextjs/server";
import {
  getRateLimitHeaders,
  isRateLimited,
} from "@/lib/utils/rate-limit";

const SPEECH_TO_TEXT_MODEL = "gpt-4o-transcribe";
const MAX_AUDIO_LENGTH_IN_MS = 65 * 1000; // 65 seconds

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the FormData from the request
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return new Response(JSON.stringify({ error: "No audio file provided" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const endpoint = "/api/speech-to-text";
    const isRateLimitExceeded = isRateLimited(user.id, endpoint);

    if (isRateLimitExceeded) {
      await logApiRequest(endpoint, {
        isRateLimited: isRateLimitExceeded,
      });
      return new Response(
        JSON.stringify({
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...getRateLimitHeaders(user.id, endpoint),
          },
        },
      );
    }

    const audioFileLengthInBytes = audioFile.size;
    const audioFileDurationInMs = (audioFileLengthInBytes / (16000 * 2)) * 1000; // Convert seconds to ms (16000 Hz * 2 bytes (16-bit PCM))

    if (audioFileDurationInMs > MAX_AUDIO_LENGTH_IN_MS) {
      return new Response(JSON.stringify({ error: "Audio file is too long" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Create a new FormData instance for the OpenAI API
    const openAIFormData = new FormData();
    openAIFormData.append("file", audioFile);
    openAIFormData.append("model", SPEECH_TO_TEXT_MODEL);
    openAIFormData.append(
      "prompt",
      "If the audio is short, do not add any Chinese characters, or arabic characters, just leave it blank",
    );

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: openAIFormData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({
          error: error.error?.message || "Failed to transcribe audio",
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const result = await response.json();

    await logApiRequest(
      endpoint,
      { audioFileDurationInMs, transcription: result.text },
      {
        isRateLimited: isRateLimitExceeded,
      },
    );

    return new Response(JSON.stringify({ transcription: result.text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...getRateLimitHeaders(user.id, endpoint),
      },
    });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}