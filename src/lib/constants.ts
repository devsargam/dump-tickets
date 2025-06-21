export const SPEECH_TO_TEXT_CONFIG = {
    SPEECH_TO_TEXT_MODEL: "gpt-4o-transcribe",
    MAX_AUDIO_LENGTH_MS: 65 * 1000, // 65 seconds
    MAX_FILE_SIZE_BYTES: 25 * 1024 * 1024, // 25MB (OpenAI limit)
    OPENAI_API_URL: "https://api.openai.com/v1/audio/transcriptions"
} as const;
  