import Header from './components/Header';
import MicButton from './components/MicButton';
import Editor from './components/Editor';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';

const App = () => {
  const {
    isRecording,
    editedText,
    setEditedText,
    startRecording,
    stopRecording,
    clearText,
  } = useVoiceRecorder();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50
      dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl">
        <Header />

        <MicButton
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />

        <Editor
          editedText={editedText}
          setEditedText={setEditedText}
          clearText={clearText}
        />
      </div>
    </div>
  );
};

export default App;
