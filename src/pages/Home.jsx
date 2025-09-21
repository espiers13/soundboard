import { useState, useRef } from "react";
import SoundBoardButton from "../components/SoundBoardButton";

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
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
          setAudioURL(url);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch((err) => {
        console.error("Microphone access denied:", err);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log(audioURL);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <p>Hello</p>
      <button
        className={`px-4 py-2 rounded ${
          isRecording ? "bg-red-500" : "bg-green-500"
        } text-white`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && <audio controls src={audioURL} className="mt-4" />}
      <SoundBoardButton audioURL={audioURL} />
    </div>
  );
}
export default Home;

<button
  className={`px-4 py-2 rounded ${
    isRecording ? "bg-red-500" : "bg-green-500"
  } text-white`}
  onClick={startRecordingMode}
  disabled={isRecording}
>
  {isRecording ? "Recording..." : "Start Recording Mode"}
</button>;
