import { useState } from 'react';

export type Step = {
  id: number;
  type: 'intro' | 'comparison' | 'quiz'| 'concept';
  title: string;
  description: string;
  options?: string[];
  correctAnswer?: string;
};

export const useLesson = (steps: Step[]) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFinished = currentStep >= steps.length;

  const handleCheck = () => {
    if (step?.type === 'quiz') {
      setIsCorrect(selectedOption === step.correctAnswer);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Logic for completion
      setCurrentStep(steps.length);
    }
  };

  return {
    step,
    progress,
    selectedOption,
    setSelectedOption,
    isCorrect,
    handleCheck,
    handleNext,
    isFinished,
  };
};