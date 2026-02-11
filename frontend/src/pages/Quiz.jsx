import React, { useState } from "react";
import { FaHome } from "react-icons/fa";

export default function Quiz({ quiz, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const normalize = (text = "") =>
    text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const calculateScore = () =>
    quiz.reduce(
      (acc, q, i) =>
        normalize(answers[i]) === normalize(q.correctAnswer)
          ? acc + 1
          : acc,
      0
    );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = calculateScore();

  return (
    <div className="quiz-container">
      <FaHome className="home-icon" onClick={onBack} />

      {!submitted ? (
        <>
          {quiz.map((q, i) => (
            <div key={i} className="question">
              <h3>{i + 1}. {q.question}</h3>

              {q.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={answers[i] === opt}
                    onChange={() => handleSelect(i, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </>
      ) : (
        <div>
          <h2>Your Score: {score}/{quiz.length}</h2>
          <button onClick={onBack}>Back</button>
        </div>
      )}
    </div>
  );
}
