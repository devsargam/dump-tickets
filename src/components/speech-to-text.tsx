"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

type RecordingState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "processing";

interface SpeechToTextProps {
  onTranscription?: (text: string) => void;
  className?: string;
}

export function SpeechToText({
  onTranscription,
  className = "",
}: SpeechToTextProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [transcription, setTranscription] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { user, isLoaded } = useUser();

  // Start recording timer
  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop recording timer
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRecordingTime(0);
  }, []);

  // Format recording time for display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Request microphone permission and start recording
  const startRecording = useCallback(async () => {
    if (!isLoaded || !user) {
      toast.error("Please sign in to use speech-to-text");
      return;
    }

    try {
      setRecordingState("requesting-permission");

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        setRecordingState("processing");
        stopTimer();

        try {
          // Create audio blob
          const audioBlob = new Blob(chunksRef.current, {
            type: "audio/webm;codecs=opus",
          });

          // Check file size (approximate duration check)
          const maxSize = 10 * 1024 * 1024; // 10MB max
          if (audioBlob.size > maxSize) {
            toast.error(
              "Recording is too long. Please keep it under 65 seconds."
            );
            setRecordingState("idle");
            return;
          }

          // Send to API
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to transcribe audio");
          }

          const transcribedText = data.transcription || "";
          setTranscription(transcribedText);

          if (onTranscription) {
            onTranscription(transcribedText);
          }

          if (transcribedText.trim()) {
            toast.success("Audio transcribed successfully!");
          } else {
            toast.warning("No speech detected in the recording.");
          }
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to transcribe audio"
          );
        } finally {
          setRecordingState("idle");
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setRecordingState("recording");
      startTimer();
      toast.success("Recording started...");
    } catch (error) {
      console.error("Recording error:", error);
      setRecordingState("idle");

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          toast.error(
            "Microphone access denied. Please allow microphone access and try again."
          );
        } else if (error.name === "NotFoundError") {
          toast.error(
            "No microphone found. Please connect a microphone and try again."
          );
        } else {
          toast.error("Failed to start recording: " + error.message);
        }
      } else {
        toast.error("Failed to start recording");
      }
    }
  }, [isLoaded, user, onTranscription, startTimer, stopTimer]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();

      // Stop all tracks to release microphone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [recordingState]);

  // Clear transcription
  const clearTranscription = useCallback(() => {
    setTranscription("");
  }, []);

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";
  const isRequestingPermission = recordingState === "requesting-permission";

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Recording Button */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isRequestingPermission || !isLoaded}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="flex items-center space-x-2 cursor-pointer"
          >
            {isRequestingPermission && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRecording && !isProcessing && <Square className="h-4 w-4" />}
            {!isRecording && !isProcessing && !isRequestingPermission && (
              <Mic className="h-4 w-4" />
            )}

            <span>
              {isRequestingPermission && "Requesting Permission..."}
              {isProcessing && "Processing..."}
              {isRecording && "Stop Recording"}
              {recordingState === "idle" && "Start Recording"}
            </span>
          </Button>

          {/* Recording Time Display */}
          {isRecording && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
