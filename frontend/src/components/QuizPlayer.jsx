import React, { useState, useEffect } from "react";
import api from "../services/api";
import { CheckCircle, Timer, Award, ArrowRight } from "lucide-react";

const QuizPlayer = ({ quizData, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const { questions, topic, difficulty } = quizData;

  // Calculate Progress Percentage
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null); // Auto-skip on timeout
    }
  }, [timeLeft, showResult, isAnswered]);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const isCorrect = option === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + (100 / questions.length));
    }

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(30);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = async () => {
    setShowResult(true);
    try {
      // Save final rounded score to MongoDB
      await api.post("/quiz/save-result", {
        topic,
        level: difficulty,
        score: Math.round(score),
        totalQuestions: questions.length
      });
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  // Result Screen
  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-2">Quiz Finished!</h2>
        <p className="text-slate-400 font-medium mb-8 uppercase tracking-widest text-xs">Topic: {topic}</p>
        
        <div className="text-7xl font-black text-indigo-600 mb-8">{Math.round(score)}%</div>
        
        <button 
          onClick={onComplete}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          CONTINUE TO DASHBOARD <ArrowRight />
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
      
      {/* 🚀 PROGRESS BAR HEADER */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Live: <span className="text-slate-800">{topic}</span>
            </span>
          </div>
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 📝 QUESTION CARD */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative">
        {/* Timer UI */}
        <div className={`absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black ${timeLeft < 10 ? 'border-rose-100 text-rose-500 animate-pulse bg-rose-50' : 'border-slate-50 text-slate-400 bg-slate-50'}`}>
          <Timer size={18} />
          <span>{timeLeft}s</span>
        </div>

        <div className="mb-10 pt-4">
          <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">Question {currentQuestion + 1}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            {q.question}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-4">
          {q.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = isAnswered && option === q.correctAnswer;
            const isWrong = isAnswered && isSelected && option !== q.correctAnswer;

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center shadow-sm group
                  ${!isAnswered ? 'border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 bg-white' : ''}
                  ${isCorrect ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-50' : ''}
                  ${isWrong ? 'border-rose-500 bg-rose-50' : ''}
                  ${isAnswered && !isCorrect && !isWrong ? 'opacity-50 border-slate-50' : ''}
                `}
              >
                {/* Fixed Visibility: The box containing the letter */}
                <span className={`h-10 w-10 rounded-xl flex items-center justify-center mr-5 text-sm font-black transition-colors
                  ${isCorrect ? 'bg-emerald-500 text-white' : isWrong ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-800 group-hover:bg-indigo-600 group-hover:text-white'}
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                
                {/* Fixed Visibility: The Option Text */}
                <span className={`font-bold text-lg flex-1 ${isCorrect ? 'text-emerald-800' : isWrong ? 'text-rose-800' : 'text-slate-800'}`}>
                  {option}
                </span>

                {isCorrect && <CheckCircle className="text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        Don't rush! Correct answers boost your rank more than speed.
      </p>
    </div>
  );
};

export default QuizPlayer;