import { Send, Copy, Trash2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

const Editor = ({ editedText, setEditedText, clearText }) => {
    const insertText = async () => {
        if (!editedText.trim()) {
            toast('Nothing to insert');
            return;
        }

        try {
            await invoke('type_text', { text: editedText + ' ' });
            toast.success('✅ Text inserted');
        } catch {
            toast.error('Failed to insert text');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(editedText);
        toast.success('Copied to clipboard');
    };

    if (!editedText) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border">
            <div className="flex justify-between mb-3">
                <h2 className="text-xl font-semibold text-white">Transcribed Text</h2>

                <div className="flex gap-2">
                    <button onClick={copyToClipboard} className="text-white">
                        <Copy />
                    </button>
                    <button onClick={clearText} className="text-white">
                        <Trash2 />
                    </button>
                </div>
            </div>

            <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full h-48 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white"
            />

            <div className="mt-6 flex justify-end">
                <button
                    onClick={insertText}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                    <Send className="w-5 h-5" />
                    Insert into Active App
                </button>
            </div>
        </div>
    );
};

export default Editor;
