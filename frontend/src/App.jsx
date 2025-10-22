import React, { useState } from "react";
import QuizForm from "./QuizForm";
import Quiz from "./Quiz";
import "./App.css";
import Home from "./Home";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [view, setView] = useState("form"); // "form" or "quiz"
  const [showHome, setShowHome] = useState(true);

  const handleQuizGenerated = (generatedQuiz) => {
    if (Array.isArray(generatedQuiz)) {
      setQuiz(generatedQuiz);
      setView("quiz");
    } else {
      console.error("Quiz data is not an array:", generatedQuiz);
      alert("Failed to generate a proper quiz.");
    }
  };

  const handleBack = () => {
    setQuiz([]);
    setView("form");
  };

  const handleStart = () => setShowHome(false);

  return (
    <div className="app">
      {showHome ? (
        <Home onStart={handleStart} />
      ) : view === "form" ? (
        <QuizForm onQuizGenerated={handleQuizGenerated} />
      ) : (
        <Quiz quiz={quiz} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
