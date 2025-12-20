# Voice to Text Dictation App
A modern, cross-platform **push-to-talk voice dictation desktop app** built with **Tauri v2**, **React 19**, **Tailwind CSS**, and **Deepgram Nova-2** real-time transcription.

Speak → Transcribe in real-time → Edit → Insert text directly into any active application (like Notion, Word, Slack, etc.) using simulated keyboard input.

Perfect for fast hands-free writing, note-taking, or accessibility.

## ✨ Features

- **Push-to-Talk**: Hold the large microphone button to start recording (mouse or touch)
- **Real-time Transcription**: Powered by Deepgram Nova-2 with low latency and punctuation
- **Editable Text**: Full textarea to review and edit transcription before inserting
- **Insert Anywhere**: Types text into the currently focused window (cross-app)
- **Beautiful Modern UI**: Tailwind CSS with dark mode, gradients, animations, and pulsing feedback
- **Toast Notifications**: Clear success/error feedback using **Sonner**
- **Copy to Clipboard**: Quick copy button
- **Error Handling**: Graceful handling of microphone permission, network, and API errors
- **Cross-Platform**: Windows, macOS, Linux (via Tauri)

## 🎥 Demo

*(Add a GIF or video here later — record the app in action!)*

Example: Hold mic → say "Hello world this is a test" → release → edit → click "Insert" → text appears in your editor.

## 🚀 Quick Start

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js ≥18](https://nodejs.org)
- A **Deepgram API Key** (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/voice-to-text-app.git
cd voice-to-text-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your Deepgram API Key

Create a `.env` file in the root:

```env
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

> Get your free key at: https://console.deepgram.com/signup

### 4. Run in Development

```bash
npx tauri dev
```

The app will open in a native desktop window. Hold the microphone button to test!

### 5. Build for Production

```bash
npx tauri build
```

Creates installers in `src-tauri/target/release/bundle/`.

## 🛠️ Tech Stack

| Layer              | Technology                                      |
|--------------------|-------------------------------------------------|
| Frontend           | React 19 + Vite + JavaScript                    |
| Styling            | Tailwind CSS v4 + Lucide Icons                  |
| Desktop Framework  | Tauri v2 (Rust backend)                         |
| Transcription      | Deepgram Nova-2 (real-time streaming)           |
| Notifications      | Sonner                                          |
| Keyboard Simulation| Enigo (Rust crate)                              |

## 📂 Project Structure

```
voice-to-text-app/
├── src/                      # React frontend
│   ├── App.js                # Main UI + logic
│   ├── main.js               # Entry + Toaster
│   └── index.css             # Tailwind base
├── src-tauri/
│   ├── capabilities/         # Tauri v2 security
│   │   └── main.json
│   ├── src/main.rs           # Rust: type_text command
│   ├── tauri.conf.json       # Tauri v2 config
│   └── Cargo.toml
├── public/
├── .env                      # Your Deepgram key (gitignored)
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔒 Permissions & Security (Tauri v2)

- `capabilities/main.json` enables `core:default` → allows custom `type_text` command
- No external plugins beyond core
- CSP disabled for simplicity (safe in desktop context)

> On macOS: First use of keyboard simulation may prompt Accessibility permission — grant it to your app.

## 🎨 UI Highlights

- Large animated microphone button with pulse when recording
- Gradient background with dark mode support
- Card-based transcription area
- Real-time status indicator
- Smooth hover/transition effects

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

Ideas:
- Add keyboard shortcut (Spacebar = push-to-talk)
- Always-on-top window toggle
- Language selection
- Whisper local fallback (offline mode)
- Auto-punctuation improvements

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app) - Amazing Rust-powered desktop framework
- [Deepgram](https://deepgram.com) - Industry-leading speech-to-text
- [Sonner](https://sonner.emilkowal.ski) - Beautiful toast component
- [Lucide](https://lucide.dev) - Icon set

---

Built with ❤️ for faster, hands-free writing.

**Start dictating today — just hold the mic!** 🎤