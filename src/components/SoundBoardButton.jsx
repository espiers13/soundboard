function SoundBoardButton({
  audioURL,
  isRecordingTarget,
  onClick,
  label,
  isClearing,
  recordingMode,
}) {
  return (
    <button
      className={`
        h-20 w-20
        rounded-lg
        relative
        overflow-hidden
        transition-all duration-150
        ${
          audioURL
            ? "bg-emerald-300 hover:shadow-green-500"
            : "bg-indigo-300 hover:shadow-indigo-500"
        }
        ${
          isClearing &&
          audioURL &&
          "absolute inset-0 ring-4 ring-red-400 rounded-lg hover:shadow-sm"
        }
        ${
          !audioURL &&
          recordingMode &&
          "absolute inset-0 ring-2 ring-green-400 rounded-lg hover:shadow-sm"
        }
        shadow-md
        hover:shadow-lg
       
        active:shadow-none    
        active:translate-y-1   
        ${
          isRecordingTarget &&
          "absolute inset-0 ring-4 ring-yellow-400 rounded-lg pointer-events-none"
        }
      `}
      onClick={onClick}
    >
      <p className="text-xs">{label}</p>
    </button>
  );
}

export default SoundBoardButton;
