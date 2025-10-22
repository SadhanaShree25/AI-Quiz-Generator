import React, { useState } from "react";
import QuizForm from "./QuizForm";
import Quiz from "./Quiz";
import Home from "./Home";
import "./App.css";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [view, setView] = useState("form"); // "form" or "quiz"
  const [showHome, setShowHome] = useState(true);

  // Called when quiz is generated
  const handleQuizGenerated = (generatedQuiz) => {
    if (Array.isArray(generatedQuiz)) {
      setQuiz(generatedQuiz);
      setView("quiz");
      setShowHome(false); // hide home when quiz starts
    } else {
      console.error("Quiz data is not an array:", generatedQuiz);
      alert("Failed to generate a proper quiz.");
    }
  };

  // Called when Home icon is clicked
  const handleBackToHome = () => {
    setQuiz([]);       // clear quiz
    setView("form");   // reset form view
    setShowHome(true); // show home
  };

  // Called when Start Quiz button on Home is clicked
  const handleStart = () => {
    setShowHome(false); // hide home
    setView("form");    // show quiz form
  };

  return (
    <div className="app">
      {showHome ? (
        <Home onStart={handleStart} />
      ) : view === "form" ? (
        <QuizForm onQuizGenerated={handleQuizGenerated} />
      ) : (
        <Quiz quiz={quiz} onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
