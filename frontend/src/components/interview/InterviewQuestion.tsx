import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { VoiceRecorder } from './VoiceRecorder';
import { InterviewQuestion as IQuestion } from '@/types';

interface InterviewQuestionProps {
  question: IQuestion;
  onComplete: (response: {
    answer: string;
    transcript: string;
    responseTime: number;
  }) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const InterviewQuestion = ({
  question,
  onComplete,
  questionNumber,
  totalQuestions,
}: InterviewQuestionProps) => {
  const [answer, setAnswer] = useState('');
  const [transcript, setTranscript] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
  }, [question.id]);

  const handleSubmit = () => {
    const responseTime = Date.now() - startTime;
    const finalAnswer = answer.trim() || transcript.trim();
    
    if (!finalAnswer) {
      alert('Please provide an answer before submitting.');
      return;
    }

    onComplete({
      answer: finalAnswer,
      transcript: transcript || finalAnswer,
      responseTime,
    });

    setAnswer('');
    setTranscript('');
  };

  const handleVoiceComplete = (voiceTranscript: string) => {
    setTranscript(voiceTranscript);
    setAnswer(voiceTranscript);
  };

  return (
    <Card className="p-8 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="electric" size="sm">
            {question.type}
          </Badge>
          <Badge variant="violet" size="sm">
            {question.skill}
          </Badge>
        </div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold leading-relaxed"
        >
          {question.question}
        </motion.h2>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Answer
        </label>
        
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here or use voice recording..."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-electric-500 focus:border-transparent resize-none"
        />
      </div>

      <VoiceRecorder
        onTranscriptChange={handleVoiceComplete}
        isActive={isRecording}
        onActiveChange={setIsRecording}
      />

      {transcript && transcript !== answer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voice Transcript:
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{transcript}</p>
        </motion.div>
      )}

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() && !transcript.trim()}
          className="min-w-[120px]"
        >
          {questionNumber === totalQuestions ? 'Complete' : 'Next Question'}
        </Button>
      </div>
    </Card>
  );
};