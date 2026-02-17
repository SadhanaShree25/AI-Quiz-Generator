import React, { useState } from "react";
import api from "../services/api";

const getNormalizedCorrect = (question) => {
  const raw = String(question.correctAnswer || "").trim().toLowerCase();
  if (!Array.isArray(question.options)) return question.correctAnswer;
  const match = question.options.find(
    (opt) => String(opt).trim().toLowerCase() === raw
  );
  return match || question.correctAnswer;
};

const QuizPlayer = ({ questions, topic, difficulty, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-4">No questions available</h2>
        <button onClick={onBack} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500">Go Back</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const normalizedCorrect = getNormalizedCorrect(currentQuestion);

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = option;
      return next;
    });
    setShowExplanation(true);

    if (option === normalizedCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleSkip = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleFinish = async () => {
    if (topic && difficulty) {
      try {
        await api.post("/quiz/save-result", {
          topic,
          difficulty,
          score,
          totalQuestions: questions.length,
        });
      } catch (err) {
        console.error("Failed to save result:", err);
      }
    }
    onBack();
  };

  if (quizFinished) {
    return (
      <div className="p-10 bg-[#18181f] rounded-3xl border border-zinc-800 max-w-5xl mx-auto space-y-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-black text-zinc-100 mb-3">
            🎉 Quiz Finished!
          </h2>
          <h3 className="text-2xl text-zinc-300 mb-2">
            Your Score: {score} / {questions.length}
          </h3>
          <p className="text-zinc-400 text-base mt-3">
            Review each question below to see which answers were correct and
            revise your mistakes.
          </p>
        </div>

        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const correct = getNormalizedCorrect(q);
            const isCorrect =
              userAnswer &&
              String(userAnswer).trim().toLowerCase() ===
                String(correct).trim().toLowerCase();

            return (
              <div
                key={index}
                className="bg-[#1e1e28] border border-zinc-800 rounded-2xl p-6 text-left hover:border-indigo-500/30 transition-colors"
              >
                <p className="text-base text-zinc-400 mb-2 font-bold">
                  Question {index + 1} of {questions.length}
                </p>
                <p className="text-lg text-zinc-100 font-semibold mb-4">
                  {q.question}
                </p>
                <div className="space-y-2">
                  <p
                    className={`text-base font-semibold ${
                      isCorrect ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    Your answer: {userAnswer ?? "Not answered"}
                  </p>
                  {!isCorrect && (
                    <p className="text-base text-emerald-400 font-semibold">
                      ✅ Correct answer: {correct}
                    </p>
                  )}
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                      <p className="text-sm text-zinc-300 font-medium">
                        <span className="text-zinc-400">Explanation:</span> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleFinish}
            className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-[#18181f] rounded-3xl border border-zinc-800 shadow-xl">
      <div className="mb-6">
        <h2 className="text-zinc-400 font-bold text-lg mb-1">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-zinc-100 mb-8 leading-relaxed">{currentQuestion.question}</h3>

      <div className="space-y-4 mb-8">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            disabled={selectedAnswer !== null}
            className={`w-full block text-left p-5 rounded-xl font-medium transition-all text-lg ${
              selectedAnswer === option
                ? option === normalizedCorrect
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-rose-600 text-white shadow-lg"
                : "bg-[#1e1e28] text-zinc-200 border border-zinc-800 hover:border-indigo-500/50 hover:bg-[#252530]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-6 p-6 rounded-2xl bg-[#1e1e28] border border-zinc-800">
          {selectedAnswer === normalizedCorrect ? (
            <div>
              <p className="text-emerald-400 font-bold text-lg mb-2">✅ Correct!</p>
              {currentQuestion.explanation && (
                <p className="text-zinc-300 text-base mt-2">{currentQuestion.explanation}</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-rose-400 font-bold text-lg mb-2">❌ Wrong Answer</p>
              <p className="text-zinc-300 text-base mb-2">
                <strong className="text-emerald-400">Correct answer:</strong> {normalizedCorrect}
              </p>
              {currentQuestion.explanation && (
                <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-zinc-300 text-base">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex gap-4 justify-end">
        <button
          onClick={handleSkip}
          className="px-8 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-bold hover:bg-zinc-700 text-base"
        >
          Skip
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAnswer && !showExplanation}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {currentIndex + 1 === questions.length ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;

