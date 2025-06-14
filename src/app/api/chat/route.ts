import { openai } from "@ai-sdk/openai";
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
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
      system:
        "You are a smart ticket assistant. You are given a rough paragraph of text which has a lot of issues. Your task is to create a structured list of issues with title and description.",
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
