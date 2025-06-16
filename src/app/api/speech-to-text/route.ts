import { NextRequest, NextResponse } from "next/server";
import { logApiRequest } from "@/utils/logging-utils";
import { SPEECH_TO_TEXT_CONFIG } from "@/lib/constants";
import { 
  TranscriptionResponse, 
  ErrorResponse, 
  SuccessResponse 
} from "@/types";
import {
  validateAudioFile,
  estimateAudioDuration,
  createResponse,
  handleOpenAIError
} from "@/utils/speech-to-text-utils";

/**
 * Speech-to-text API endpoint
 * Transcribes audio files
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (error) {
      return createResponse<ErrorResponse>(
        { error: "Invalid form data" }, 
        400
      );
    }

    const audioFile = formData.get("audio");
    if (!audioFile || !(audioFile instanceof File)) {
      return createResponse<ErrorResponse>(
        { error: "Audio file is required" }, 
        400
      );
    }

    const validation = validateAudioFile(audioFile);
    if (!validation.isValid) {
      return createResponse<ErrorResponse>(
        { error: validation.error! }, 
        400
      );
    }

    const estimatedDuration = estimateAudioDuration(audioFile);
    if (estimatedDuration > SPEECH_TO_TEXT_CONFIG.MAX_AUDIO_LENGTH_MS) {
      return createResponse<ErrorResponse>(
        { 
          error: `Audio file too long. Maximum duration: ${SPEECH_TO_TEXT_CONFIG.MAX_AUDIO_LENGTH_MS / 1000}s` 
        }, 
        400
      );
    }

    const openAIFormData = new FormData();
    openAIFormData.append("file", audioFile);
    openAIFormData.append("model", SPEECH_TO_TEXT_CONFIG.SPEECH_TO_TEXT_MODEL);
    openAIFormData.append(
      "prompt",
      "Transcribe the audio accurately. If the audio is unclear or too short to determine content, leave the response blank."
    );

    const response = await fetch(SPEECH_TO_TEXT_CONFIG.OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return handleOpenAIError(error, response.status);
    }

    const result: TranscriptionResponse = await response.json();
    
    if (!result.text && result.text !== "") {
      throw new Error("Invalid response from transcription service");
    }

    try {
      await logApiRequest("/api/speech-to-text", {
        audioFileSize: audioFile.size,
        audioFileName: audioFile.name,
        audioFileType: audioFile.type,
        estimatedDuration: estimatedDuration,
        transcriptionLength: result.text.length,
        timestamp: new Date().toISOString(),
      });
    } catch (logError) {
      console.warn("Failed to log API request:", logError);
    }

    return createResponse<SuccessResponse>({
      transcription: result.text,
      duration: estimatedDuration,
    });

  } catch (error) {
    console.error("Unexpected error in speech-to-text API:", error);
    
    return createResponse<ErrorResponse>(
      { 
        error: "An unexpected error occurred. Please try again." 
      }, 
      500
    );
  }
}
