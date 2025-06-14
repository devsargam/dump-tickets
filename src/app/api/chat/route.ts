import { google } from "@ai-sdk/google";
import { z } from "zod";
import { generateObject, streamText } from "ai";
import { NextResponse } from "next/server";
import { issuesSchema } from "@/utils/zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const result = await generateObject({
      model: google("gemini-2.0-flash-001"),
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
      system: `You are a senior product manager acting as an AI ticket assistant for Linear.

INSTRUCTIONS
1. The user will paste a raw paragraph (bulleted list, meeting notes, or free-form text).
2. Identify each distinct task, bug, enhancement, or feature request.
3. For every task generate an object with:
   • title ‑ A concise, action-oriented summary (max 10 words, capitalise first word).
   • description ‑ One to two sentences that give context, expected behaviour, and definition of done.  Include acceptance criteria if relevant.
4. Skip any sentences that are not actionable.
5. Do NOT invent tasks that are not in the text.
6. Output MUST match the JSON schema exactly: { issues: [ { title, description } ] }.

Focus on clarity so engineers can pick up the ticket without extra questions.`,
      schema: issuesSchema,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
