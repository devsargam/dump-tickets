import { NextResponse } from "next/server";
import { ErrorResponse } from "@/types";
import { SPEECH_TO_TEXT_CONFIG } from "@/lib/constants";

/**
 * Validates the uploaded audio file
 */ 
export function validateAudioFile(audioFile: File): { isValid: boolean; error?: string } {
  if (audioFile.size > SPEECH_TO_TEXT_CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size too large. Maximum allowed: ${SPEECH_TO_TEXT_CONFIG.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`
    };
  }

  return { isValid: true };
}

/**
 * Estimates audio duration from file size (rough approximation)
 * Note: This is not accurate for all formats, but provides a basic check
 */
export function estimateAudioDuration(file: File): number {
  const averageBitrateKbps = 128; // Assume 128kbps average
  const durationSeconds = (file.size * 8) / (averageBitrateKbps * 1000);
  return durationSeconds * 1000; // Convert to milliseconds
}

/**
 * Creates a standardized JSON response
 */
export function createResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Handles OpenAI API errors and maps them to user-friendly messages
 */
export function handleOpenAIError(error: any, status: number): NextResponse {
  console.error('OpenAI API error:', error);
  
  const errorMessage = error.error?.message || 'Failed to transcribe audio';
  let userFriendlyMessage = errorMessage;

  if (errorMessage.includes('rate limit')) {
    userFriendlyMessage = 'Rate limit exceeded. Please try again later.';
  } else if (errorMessage.includes('quota')) {
    userFriendlyMessage = 'Service quota exceeded. Please contact support.';
  } else if (errorMessage.includes('invalid')) {
    userFriendlyMessage = 'Invalid audio file format or content.';
  }

  return createResponse<ErrorResponse>(
    { 
      error: userFriendlyMessage,
      code: error.error?.code 
    }, 
    status
  );
} 