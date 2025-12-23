import { Mic, MicOff } from 'lucide-react';

const MicButton = ({ isRecording, startRecording, stopRecording }) => {
    return (
        <div className="flex justify-center mb-10">
            <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`p-10 rounded-full shadow-2xl transition-all duration-300
          ${isRecording
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    } text-white`}
            >
                {isRecording ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
            </button>
        </div>
    );
};

export default MicButton;
