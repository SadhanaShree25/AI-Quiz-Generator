import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
      explanation: { type: String },
      userAnswer: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;
