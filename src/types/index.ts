export interface TranscriptionResponse {
    text: string;
}
  
export interface ErrorResponse {
    error: string;
    code?: string;
}
  
export interface SuccessResponse {
    transcription: string;
    duration?: number;
} 