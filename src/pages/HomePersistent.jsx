import { useState, useRef, useEffect } from "react";
import SoundBoardButton from "../components/SoundBoardButton";

function HomePersistent() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState(null);
  const [sounds, setSounds] = useState(Array(20).fill(null));
  const [labels, setLabels] = useState(Array(20).fill(""));
  const [isClearing, setIsClearing] = useState(false);
  const [recordingMode, setRecordingMode] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const savedSounds = Array(20).fill(null);
    const savedLabels = Array(20).fill("");

    for (let i = 0; i < 20; i++) {
      const audioData = localStorage.getItem(`sound-${i}`);
      if (audioData) savedSounds[i] = audioData;

      const lbl = localStorage.getItem(`label-${i}`);
      if (lbl) savedLabels[i] = lbl;
    }

    setSounds(savedSounds);
    setLabels(savedLabels);
  }, []);

  const startRecordingMode = () => {
    setIsRecording(true);
    setRecordingMode(true);
    alert("Click a sound button to record into it!");
  };

  const recordForButton = (index) => {
    setRecordingMode(false);
    setRecordingTarget(index);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result;

            setSounds((prev) => {
              const newSounds = [...prev];
              newSounds[index] = base64Audio;
              return newSounds;
            });

            const label = prompt(
              "Enter a label for this button:",
              labels[index] || ""
            );
            if (label !== null) {
              setLabels((prev) => {
                const newLabels = [...prev];
                newLabels[index] = label;
                return newLabels;
              });
              localStorage.setItem(`label-${index}`, label);
            }

            localStorage.setItem(`sound-${index}`, base64Audio);
          };

          setRecordingTarget(null);
          setIsRecording(false);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => console.error("Microphone access denied", err));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  const clearSound = (index) => {
    setIsClearing(true);
    setSounds((prev) => {
      const newSounds = [...prev];
      newSounds[index] = null;
      return newSounds;
    });
    setLabels((prev) => {
      const newLabels = [...prev];
      newLabels[index] = "";
      return newLabels;
    });
    localStorage.removeItem(`sound-${index}`);
    localStorage.removeItem(`label-${index}`);
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {isRecording ? (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => {
            if (recordingTarget !== null) stopRecording();
            else setIsRecording(false);
          }}
        >
          {recordingTarget !== null ? "Stop Recording" : "Cancel"}
        </button>
      ) : (
        <button
          onClick={startRecordingMode}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 hover:shadow-md  transition-colors duration-300"
        >
          Start Recording Mode
        </button>
      )}

      <div className="grid grid-cols-5 gap-4 mt-6 mx-3">
        {sounds.map((audioURL, index) => (
          <SoundBoardButton
            isClearing={isClearing}
            recordingMode={recordingMode}
            key={index}
            audioURL={audioURL}
            label={labels[index]}
            isRecordingTarget={recordingTarget === index}
            onClick={() => {
              if (isRecording) recordForButton(index);
              else if (isClearing) clearSound(index);
              else if (audioURL) new Audio(audioURL).play();
            }}
          />
        ))}
      </div>

      <button
        className={`mt-4 px-4 py-2 rounded ${
          isClearing ? "bg-gray-500" : "bg-red-500"
        } text-white`}
        onClick={() => {
          if (isClearing) {
            setIsClearing(false);
          } else {
            setIsClearing(true);
          }
        }}
      >
        {isClearing ? "Cancel" : "Clear Button"}
      </button>
    </div>
  );
}

export default HomePersistent;
