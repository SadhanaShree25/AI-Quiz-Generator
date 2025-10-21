import React, { useState } from "react";

export default function Quiz({ quiz, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => setSubmitted(true);

  const score = quiz.reduce((acc, q, i) => {
    return answers[i] === q.answerText ? acc + 1 : acc;
  }, 0);

  return (
    <div className="quiz-container">
      {!submitted ? (
        <>
          {quiz.map((q, i) => (
            <div key={i} className="question">
              <h3>
                {i + 1}. {q.question}
              </h3>
              {q.options.map((opt, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
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
          {quiz.map((q, i) => (
            <div key={i} className="question-result">
              <h3>
                {i + 1}. {q.question}
              </h3>
              <p>
                Your answer:{" "}
                <span className={answers[i] === q.answerText ? "correct" : "wrong"}>
                  {answers[i] || "No answer"}
                </span>
              </p>
              <p>
                Correct answer: <span className="correct">{q.answerText}</span>
              </p>
            </div>
          ))}
          <button onClick={onBack}>Back</button>
        </div>
      )}
    </div>
  );
}
