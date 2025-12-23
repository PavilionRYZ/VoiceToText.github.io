const Header = () => {
    return (
        <div className="text-center mb-8">
            <h1
                className="text-4xl font-bold text-gray-800 dark:text-white mb-2
        [text-shadow:0_4px_12px_rgba(0,0,0,0.25)]"
            >
                Voice to Text Dictation
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
                Hold the microphone to speak • Release to stop
            </p>
        </div>
    );
};

export default Header;
