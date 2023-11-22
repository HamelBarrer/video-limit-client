import { useEffect, useRef, useState } from 'react';
import { LIMIT_TIME } from '../../constants/app';
import { createRecord } from '../../services/record.service';
import { Record } from '../../types/record.type';
import CameraCancelIcon from '../icons/CameraCancelIcon';
import CameraIcon from '../icons/CameraIcon';
import CloseIcon from '../icons/CloseIcon';
import PlayIcon from '../icons/PlayIcon';
import PlayButton from '../ui/buttons/PlayButton';

interface VideoRecordProps {
  setInitRecord: React.Dispatch<React.SetStateAction<boolean>>;
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
}

const VideoRecord = ({ setInitRecord, setRecords }: VideoRecordProps) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const recordedVideoElement = useRef<HTMLVideoElement>(null);

  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const validationTime = (time: number, compare = 0) => {
    const date = new Date(time - compare);
    return Number(date.getUTCSeconds().toString().padStart(2, '0'));
  };

  const startVideo = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);

      videoElement.current!.srcObject = stream;
      videoElement.current!.onloadedmetadata = () => {
        videoElement.current?.play();
      };

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setStartTime(Date.now());
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (startTime) {
      const endTime = Date.now();
      const second = validationTime(endTime - startTime);
      if (second < LIMIT_TIME.MIN_SECONDS) return;
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsCompleted(true);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const playRecordedVideo = async () => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const recordedVideoURL = URL.createObjectURL(recordedBlob);
    if (recordedVideoElement.current) {
      recordedVideoElement.current.src = recordedVideoURL;
      recordedVideoElement.current.play();
      const record = await createRecord(recordedBlob);
      setRecords((prevState) => [...prevState, record]);
    }
  };

  useEffect(() => {
    setInterval(() => {
      if (isRecording && startTime) {
        const endTime = Date.now();
        const second = validationTime(endTime - startTime);
        if (second >= LIMIT_TIME.MAX_SECONDS) {
          mediaRecorder?.stop();
          setIsRecording(false);
          setIsCompleted(true);
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        }
      }
    }, 1000);
  }, [isRecording, mediaRecorder, startTime, stream]);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl overflow-hidden h-96 w-96 shadow-2xl">
        {isCompleted && (
          <video
            ref={recordedVideoElement}
            controls
            className="h-full w-full object-cover"
          />
        )}
        {!isCompleted && (
          <video ref={videoElement} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        {!isCompleted && (
          <>
            <PlayButton handleClick={startVideo}>{<CameraIcon />}</PlayButton>
            <button
              className="bg-red-600 text-white p-4 rounded-full duration-300 hover:bg-red-800 hover:scale-105 active:bg-red-900"
              onClick={stopRecording}
            >
              {<CameraCancelIcon />}
            </button>
          </>
        )}
        {isCompleted && (
          <div>
            <button
              className="bg-blue-600 text-white p-4 rounded-full duration-300 hover:bg-blue-800 hover:scale-105 active:bg-blue-900"
              onClick={playRecordedVideo}
              disabled={recordedChunks.length === 0}
            >
              <PlayIcon />
            </button>
          </div>
        )}
        <button
          className="bg-slate-600 text-white p-4 rounded-full duration-300 hover:bg-slate-800 hover:scale-105 active:bg-slate-900"
          onClick={() => setInitRecord(false)}
        >
          {<CloseIcon />}
        </button>
      </div>
    </div>
  );
};

export default VideoRecord;
