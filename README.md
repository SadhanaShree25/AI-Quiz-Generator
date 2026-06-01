# 🤖 AI Quiz Generator (QUIZ.AI)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express-5-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/AI-Groq_Llama-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
</p>

<h3 align="center">
  🚀 A premium, full-stack AI-powered learning platform that generates intelligent, personalized quizzes from any topic or text-readable PDF. Users can create accounts, track their progress, and review complete historical questions and answers with detailed AI explanations.
</h3>

---

## 🆕 What's New (Latest Updates)

Here is a summary of the major features, UI redesigns, and bug fixes recently implemented:

### 1. 📂 PDF Quiz Generation (Contextual Extraction)
* **Document Parsing**: Added support for uploading study materials, lecture notes, or textbook chapters in PDF format (up to 5MB).
* **Robust PDF Parsing**: Integrated class-based parsing via `pdf-parse` v2 (`new PDFParse(Uint8Array)`), fixing legibility and server crashes caused by legacy function-based parser integrations.
* **Smart Quiz Extraction**: AI analyzes the semantic context of your uploaded PDF and generates precise questions matching your preferred blueprint.

### 2. 📝 Quiz Revision History
* **Question Logs Retention**: Extended the MongoDB schema to retain complete historical records of quiz runs—storing questions, option arrays, correct answers, explanations, and user selections.
* **Detailed Revision Modal**: Built a dedicated revision review window in the **History** tab. Users can review past quizzes with color-coded options (green for correct, red for selected wrong answers) and reference easy AI explanations for revision.

### 3. 🌗 Universal Light & Dark Mode
* **Theme Contrast Optimization**: Fixed visibility bugs in light theme. High-contrast colors are applied to labels, metric values, inputs, and dropdowns. Correct/incorrect highlights dynamically swap to rich dark-emerald and dark-rose tones in light mode to guarantee full readability.
* **Responsive Profile Section**: Refactored the `ProfileSection` subcomponent to listen directly to the global theme context, ensuring identity cards and metric cards adapt seamlessly.

### 4. ⚡ Sleek, Simplified User Flow
* **Direct Landing Dashboard**: Removed the generic landing page. Both `/` and `/dashboard` load the main dashboard directly.
* **Dynamic Guest View**: Logged-out visitors can explore the dashboard's features, capability cards, and product descriptions, with a clear "Login / Register 🔑" button below the header. Protecting api routes keeps keys secure, prompting guests to authenticate only when launching a quiz.
* **Unified Auth Rename**: Cleaned up route structures and normalized the login/signup controllers.

### 5. 🛠️ Authentication & Evaluation Bug Fixes
* **Case-Insensitive Logins**: Standardized user creation and authentication handlers to enforce trimmed, lowercase emails, resolving MongoDB duplication and registration blocks.
* **Strict Evaluation logic**: Normalized AI-generated answers to strictly match one of the provided option choices (case-insensitive fallback), preventing evaluation discrepancy.

---

## ✨ Core Features

* **🧠 AI Quiz Generator**: Create custom quizzes on any topic using **Groq's Llama 3.3 70B** models, selecting question counts (5-20) and format blueprints (MCQs, True/False, Mixed).
* **🌗 Dark & Light Modes**: Seamless visual settings saved locally.
* **📊 Analytics Matrix**: Tracks your total quizzes completed, learning streak, best scores, and average score directly on the dashboard.
* **🎮 Interactive Quiz Player**: Includes a live progress tracker, instant answer grading, and contextual explanations.

---

## 🛠️ Tech Stack

### 💻 Frontend
* **React 19** & **Vite 7** (Modern UI & ultra-fast hot reloading)
* **React Router 7** (Unified routing)
* **Tailwind CSS 4** (Responsive styling and layouts)
* **Axios** (API requests)

### 🖥️ Backend
* **Node.js** & **Express 5** (Server framework)
* **MongoDB** (Database, using Mongoose)
* **JWT** & **bcryptjs** (Secure authentication mapping)
* **pdf-parse** (PDF text extraction)
* **Groq SDK** (Orchestrates Llama model integration)

---

## 📁 Project Structure

```
Ai-Quiz-Generator/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, me, forgot/reset password (casing normalized)
│   │   └── quizController.js  # Generate quiz, PDF quiz extraction, save result, history, stats
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema (trimmed & lowercase email constraints)
│   │   └── QuizResult.js      # Quiz result schema (stores complete historical questions/answers)
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   ├── quizRoutes.js      # /api/quiz/* (secured routes)
│   │   └── userRoutes.js      # /api/user/*
│   ├── .env                   # Backend environment variables
│   ├── server.js              # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuizPlayer.jsx       # Theme-aware interactive player & summary sheet
│   │   │   ├── MyQuizzesSection.jsx # Quizzes history list & revision review modal
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Authentication provider
│   │   │   └── ThemeContext.jsx   # Dark/light theme state provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Core Dashboard workspace & ProfileSection
│   │   │   ├── QuizForm.jsx       # Topic-based quiz config form
│   │   │   ├── PdfQuizForm.jsx    # PDF upload drag-and-drop quiz form
│   │   │   ├── Login.jsx          # Login screen
│   │   │   └── Signup.jsx         # Account registration screen
│   │   ├── services/
│   │   │   └── api.js             # Axios setup with interceptors
│   │   ├── App.jsx            # Routing configuration
│   │   ├── index.css          # Design system classes
│   │   └── main.jsx
│   ├── .env                   # Frontend environment variables
│   ├── tailwind.config.cjs
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* **Node.js** 18+ installed on your system.
* **MongoDB** connection (local server or MongoDB Atlas).
* **Groq API Key** (Obtain for free at [console.groq.com](https://console.groq.com)).

### 2. Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Ai-Quiz-Generator
   ```

2. **Configure the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai_quiz_db
   JWT_SECRET=your_secure_jwt_random_secret_string
   GROQ_API_KEY=gsk_your_groq_api_key_here
   FRONTEND_URL=http://localhost:5174
   ```

3. **Configure the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` folder (optional, default falls back to `5000`):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

---

## 🚀 Running the Application

To run the application locally in development mode:

**Terminal 1 – Start Backend:**
```bash
cd backend
npm run dev
```
*Backend runs at: `http://localhost:5000`*

**Terminal 2 – Start Frontend:**
```bash
cd frontend
npm run dev
```
*Frontend runs at: `http://localhost:5174` (or `http://localhost:5173` depending on port availability)*

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### 🔑 Authentication (`/api/auth`)
* `POST /register`: Registers a new user.
* `POST /login`: Log in user and receive a JWT.
* `GET /me`: Fetch authenticated user profile data (Requires Token).

### 📝 Quiz Operations (`/api/quiz`)
* `POST /generate-quiz`: Generates a quiz from a topic (JSON payload) or PDF (Multipart file upload). (Requires Token).
* `POST /save-result`: Saves completed quiz answers, score, and explanations. (Requires Token).
* `GET /history`: Retrieves authenticated user's quiz log history. (Requires Token).
* `GET /stats`: Computes streak, total quiz counts, average scores. (Requires Token).
* `DELETE /history/all`: Clears the user's completed history list. (Requires Token).

---

## 👩‍💻 Author
**Sadhana Shree**
