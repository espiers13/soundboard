import { useState, useRef } from "react";
import SoundBoardButton from "../components/SoundBoardButton";

function Home2() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState(null);
  const [sounds, setSounds] = useState(Array(20).fill(null));
  const [labels, setLabels] = useState(Array(20).fill(""));
  const [isClearing, setIsClearing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecordingMode = () => {
    setIsRecording(true);
    alert("Click a sound button to record into it!");
  };

  const clearButton = () => {
    setIsClearing(true);
    alert("Click a sound button to clear it!");
  };

  const clearSound = (index) => {
    setSounds((prev) => {
      const newSounds = [...prev];
      newSounds[index] = null;
      return newSounds;
    });
    setLabels((prev) => {
      const newLabels = [...prev];
      newLabels[index] = null;
      return newLabels;
    });
  };

  const recordForButton = (index) => {
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
          const url = URL.createObjectURL(audioBlob);

          setSounds((prev) => {
            const newSounds = [...prev];
            newSounds[index] = url;
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
          }

          setRecordingTarget(null);
          setIsRecording(false);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => console.error("Microphone access denied", err));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {isRecording ? (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => {
            if (recordingTarget !== null) {
              stopRecording();
            } else {
              setIsRecording(false);
            }
          }}
        >
          {recordingTarget !== null ? "Stop Recording" : "Cancel"}
        </button>
      ) : (
        <button
          onClick={startRecordingMode}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          Start Recording Mode
        </button>
      )}

      <div className="grid grid-cols-5 gap-4 mt-6 mx-3">
        {sounds.map((audioURL, index) => (
          <SoundBoardButton
            key={index}
            audioURL={audioURL}
            label={labels[index]}
            isRecordingTarget={recordingTarget === index}
            onClick={() => {
              if (isRecording) {
                recordForButton(index);
              }
              if (isClearing) {
                clearSound(index);
              } else if (audioURL) {
                const audio = new Audio(audioURL);
                audio.play();
              }
            }}
          />
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={clearButton}
      >
        Clear Button
      </button>
    </div>
  );
}
export default Home2;
