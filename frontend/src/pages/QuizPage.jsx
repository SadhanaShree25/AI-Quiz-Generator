import { useState } from "react";
import QuizForm from "./QuizForm";
import QuizPlayer from "../components/QuizPlayer";
import Home from "../Home";

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null); // 🔥 change from [] to null
  const [view, setView] = useState("home");

  const handleQuizGenerated = (data) => {
    const questions = Array.isArray(data) ? data : data?.questions;
    if (questions?.length > 0) {
      setQuiz(typeof data === "object" && !Array.isArray(data) ? data : { questions: data, topic: "", difficulty: "medium" });
      setTimeout(() => setView("quiz"), 0);
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

      {view === "quiz" && quiz && (
        <QuizPlayer
          questions={quiz.questions || quiz}
          topic={quiz.topic}
          difficulty={quiz.difficulty || "medium"}
          onBack={() => {
            setQuiz(null);
            setView("home");
          }}
        />
      )}
    </>
  );
};

export default QuizPage;
