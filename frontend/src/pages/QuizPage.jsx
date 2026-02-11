import { useState } from "react";
import QuizForm from "./QuizForm";
import Quiz from "./Quiz";
import Home from "../Home";

const QuizPage = () => {
  const [quiz, setQuiz] = useState([]);
  const [view, setView] = useState("home");

  const handleQuizGenerated = (generatedQuiz) => {
    if (Array.isArray(generatedQuiz)) {
      setQuiz(generatedQuiz);
      setView("quiz");
    } else {
      alert("Quiz generation failed");
    }
  };

  return (
    <>
      {view === "home" && <Home onStart={() => setView("form")} />}
      {view === "form" && (
        <QuizForm onQuizGenerated={handleQuizGenerated} />
      )}
      {view === "quiz" && (
        <Quiz quiz={quiz} onBack={() => setView("home")} />
      )}
    </>
  );
};

export default QuizPage;
