"use client";
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ChevronLeft, X } from 'lucide-react';
 // shadcn
import TactileButton from '../_components/TactileButton';
import { Progress } from '@/components/ui/progress';
// The component we built earlier

const LessonPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleCheck = () => {
    if (step?.type === 'quiz') {
      setIsCorrect(selectedOption === step.correctAnswer);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col h-screen  font-sans bg-black text-white">
      {/* HEADER */}
      <header className="flex items-center gap-4 p-4 max-w-2xl mx-auto w-full">
        <X className="text-gray-400 cursor-pointer" onClick={() => window.history.back()} />
        <Progress value={progress} className="h-3 rounded-full" />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
          
          {/* Visual Aid */}
          <div className="flex justify-center mb-4">
            {step?.id === 1 ? (
              <ShieldAlert size={80} className="text-orange-400" />
            ) : (
              <ShieldCheck size={80} className="text-green-500" />
            )}
          </div>

          <h1 className="text-2xl font-black text-gray-300">{step?.title}</h1>
          <p className="text-xl text-gray-400 leading-relaxed">{step?.description}</p>

          {/* Quiz Options */}
          {step?.type === 'quiz' && (
            <div className="grid gap-3 mt-8 w-full">
              {step.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`p-4 border-2 rounded-2xl text-lg font-bold transition-all ${
                    selectedOption === option 
                      ? 'border-blue-400 bg-blue-50 text-blue-600' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER FEEDBACK TRAY */}
      <footer className={`p-6 border-t-2 bg-black ${
        isCorrect === true ? 'bg-green-100 border-green-200' : 
        isCorrect === false ? 'bg-red-100 border-red-200' : 'bg-black'
      }`}>
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {isCorrect !== null && (
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCorrect ? <ShieldCheck className="text-white" /> : <X className="text-white" />}
              </div>
              <h2 className={`text-xl font-black ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Excellent!' : 'Check the URL again!'}
              </h2>
            </div>
          )}
          
          <TactileButton
            variant={isCorrect === false ? 'danger' : 'primary'}
            disabled={step?.type === 'quiz' && !selectedOption}
            onClick={isCorrect === null ? handleCheck : handleNext}
            className="w-full md:w-48"
          >
            {isCorrect === null ? 'Check' : 'Continue'}
          </TactileButton>
        </div>
      </footer>
    </div>
  );
};

export default LessonPage;


type Step = {
    id: number;
    type: 'intro' | 'comparison' | 'quiz';
    title: string;
    description: string;
    illustration?: string;
    options?: string[];
    correctAnswer?: string;
  };
  
  const STEPS: Step[] = [
    {
      id: 1,
      type: 'intro',
      title: "The Web's Secret Language",
      description: "When your browser talks to a website, it uses HTTP. But there's a problem: standard HTTP is like sending a postcard—anyone can read it!",
    },
    {
      id: 2,
      type: 'comparison',
      title: "HTTP vs. HTTPS",
      description: "The 'S' stands for **Secure**. HTTPS wraps your data in an encrypted 'envelope' so hackers can't peek inside.",
    },
    {
      id: 3,
      type: 'quiz',
      title: "Spot the Difference",
      description: "Which one should you use when entering your credit card details?",
      options: ["http://myshop.com", "https://myshop.com"],
      correctAnswer: "https://myshop.com",
    }
  ];