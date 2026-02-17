import React, { useState } from "react";
import { FaHome } from "react-icons/fa";

export default function Quiz({ quiz = [], onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2>No quiz available</h2>
        <button onClick={onBack} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Go Back
        </button>
      </div>
    );
  }

  const normalize = (text = "") =>
    text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const calculateScore = () =>
    quiz.reduce((acc, q, i) => {
      if (!q.correctAnswer) return acc;
      return normalize(answers[i]) === normalize(q.correctAnswer)
        ? acc + 1
        : acc;
    }, 0);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = calculateScore();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <FaHome
        className="text-2xl cursor-pointer mb-4"
        onClick={onBack}
      />

      {!submitted ? (
        <>
          {quiz.map((q, i) => (
            <div key={i} className="mb-6 p-4 border rounded shadow">
              <h3 className="font-semibold mb-3">
                {i + 1}. {q.question}
              </h3>

              {Array.isArray(q.options) &&
                q.options.map((opt, idx) => (
                  <label key={idx} className="block mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === opt}
                      onChange={() => handleSelect(i, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Your Score: {score} / {quiz.length}
          </h2>

          <button
            onClick={onBack}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
