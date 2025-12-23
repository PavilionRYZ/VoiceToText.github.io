import { useState, useEffect } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { toast } from "sonner";

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [editedText, setEditedText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [deepgramConnection, setDeepgramConnection] = useState(null);

  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

  useEffect(() => {
    if (transcription) {
      setEditedText((prev) => prev + " " + transcription);
      setTranscription("");
    }
  }, [transcription]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaRecorder(recorder);

      const deepgram = createClient(DEEPGRAM_API_KEY);
      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
        interim_results: true,
      });
      setDeepgramConnection(connection);

      connection.on(LiveTranscriptionEvents.Open, () => {
        toast.success("🎙️ Recording started");

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };

        recorder.start(250);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel?.alternatives[0]?.transcript || "";
        if (transcript && data.is_final) {
          setTranscription(transcript);
        }
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        toast.error("Deepgram error: " + err.message);
      });

      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied or unavailable");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    mediaRecorder?.stream.getTracks().forEach((t) => t.stop());
    deepgramConnection?.finish();
    setIsRecording(false);
  };

  const clearText = () => {
    setEditedText("");
    setTranscription("");
    toast("Cleared");
  };

  return {
    isRecording,
    editedText,
    setEditedText,
    startRecording,
    stopRecording,
    clearText,
  };
};
