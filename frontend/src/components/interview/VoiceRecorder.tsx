import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
}

export const VoiceRecorder = ({
  onTranscriptChange,
  isActive,
  onActiveChange,
}: VoiceRecorderProps) => {
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition();

  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  useEffect(() => {
    onActiveChange(isListening);
  }, [isListening, onActiveChange]);

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const handleStartRecording = () => {
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Voice recording is not supported in your browser. Please type your answer instead.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Voice Recording
        </h4>
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-electric-600">
            <motion.div
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Recording: {formatTime(recordingTime)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isListening ? (
          <Button
            variant="secondary"
            onClick={handleStartRecording}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Start Recording
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={handleStopRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
            </svg>
            Stop Recording
          </Button>
        )}

        {transcript && (
          <Button
            variant="ghost"
            onClick={resetTranscript}
            className="text-sm"
          >
            Clear
          </Button>
        )}
      </div>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-electric-50 dark:bg-electric-900/20 border border-electric-200 dark:border-electric-800 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              className="flex gap-1"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-electric-500 rounded-full"
                  animate={{
                    height: [4, 16, 4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
            <span className="text-sm font-medium text-electric-700 dark:text-electric-300">
              Listening...
            </span>
          </div>
          {transcript && (
            <p className="text-sm text-electric-600 dark:text-electric-400">
              "{transcript}"
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};