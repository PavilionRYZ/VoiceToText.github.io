import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { toast } from 'sonner';
import { Mic, MicOff, Send, Copy } from 'lucide-react';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [editedText, setEditedText] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [deepgramConnection, setDeepgramConnection] = useState(null);

  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

  useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      setMediaRecorder(recorder);

      const deepgram = createClient(DEEPGRAM_API_KEY);
      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        interim_results: true,
      });
      setDeepgramConnection(connection);

      connection.on(LiveTranscriptionEvents.Open, () => {
        toast.success('Microphone connected • Streaming to Deepgram');
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };
        recorder.start(250);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const words = data.channel?.alternatives[0]?.words || [];
        const transcript = data.channel?.alternatives[0]?.transcript || '';
        if (transcript && data.is_final) {
          setTranscription((prev) => prev + ' ' + transcript);
        }
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed');
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        toast.error('Deepgram error: ' + err.message);
      });

      setIsRecording(true);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone permission.');
      } else {
        toast.error('Failed to access microphone: ' + err.message);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    if (deepgramConnection) {
      deepgramConnection.finish();
    }
    setIsRecording(false);
    if (transcription.trim()) {
      toast.info('Recording stopped • Text ready to edit & insert');
    }
  };

  const insertText = async () => {
    const textToInsert = editedText.trim();
    if (!textToInsert) {
      toast('Nothing to insert');
      return;
    }

    try {
      await invoke('type_text', { text: textToInsert + ' ' }); // Add space for natural typing
      toast.success('Text inserted successfully!');
      setTranscription('');
      setEditedText('');
    } catch (err) {
      toast.error('Failed to insert text: ' + err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedText);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Voice to Text Dictation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hold the microphone to speak • Release to stop
          </p>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center mb-10">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording} // Safety: stop if mouse leaves
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`
              relative group p-10 rounded-full shadow-2xl transition-all duration-300
              ${isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-8 ring-red-300 ring-opacity-50'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }
              text-white focus:outline-none focus:ring-4 focus:ring-opacity-50
            `}
          >
            <div className="relative z-10">
              {isRecording ? (
                <MicOff className="w-16 h-16" />
              ) : (
                <Mic className="w-16 h-16" />
              )}
            </div>
            {isRecording && (
              <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></div>
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="text-center mb-6">
          <p className={`text-lg font-medium ${isRecording ? 'text-red-600' : 'text-gray-500'}`}>
            {isRecording ? '🔴 Recording... Speak now' : 'Ready to record'}
          </p>
        </div>

        {/* Transcription Card */}
        {transcription && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Transcribed Text
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-48 px-4 py-3 text-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your transcribed text will appear here... You can edit it!"
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={insertText}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
                Insert into Active App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;