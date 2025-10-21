import React, { useState } from "react";
import QuizForm from "./QuizForm";
import Quiz from "./Quiz";
import "./App.css";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [view, setView] = useState("form"); // "form" or "quiz"

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

  return (
    <div className="app">
      <h1>AI Quiz Generator</h1>
      {view === "form" ? (
        <QuizForm onQuizGenerated={handleQuizGenerated} />
      ) : (
        <Quiz quiz={quiz} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
