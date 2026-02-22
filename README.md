# 🤖 AI Quiz Generator  

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express-5-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/AI-Groq_Llama-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
</p>

<p align="center">
  🚀 A full-stack web application that generates intelligent, personalized quizzes on any topic using AI (Groq/Llama). Users can create accounts, generate quizzes, track their progress, and review their answers with explanations.
</p>

---

# ✨ Features

## 🧠 AI Quiz Generation
Generate quizzes on any topic using **Groq's Llama model**  
✔ 1–20 questions  
✔ Easy / Medium / Hard difficulty  
✔ Instant explanations  

---

## 🔐 Authentication System
✔ Register & Login  
✔ JWT-based session management  
✔ Protected routes  

---

## 📊 Dashboard & Analytics
✔ Total quizzes overview  
✔ Recent activity  
✔ Last Topic

---

## 🎮 Interactive Quiz Player
✔ Progress bar  
✔ Instant answer feedback  
✔ Detailed explanations  
✔ Final result summary  

---

## 🌗 UI & Experience
✔ Dark / Light mode (saved in localStorage)  
✔ Responsive design  
✔ Clean modern UI with Tailwind CSS  

---

# 🛠️ Tech Stack

## 💻 Frontend

| Technology | Purpose |
|------------|---------|
| ⚛ React 19 | UI Library |
| ⚡ Vite 7 | Build tool |
| 🧭 React Router 7 | Routing |
| 🎨 Tailwind CSS 4 | Styling |
| 📡 Axios | API calls |
| 📊 Recharts | Dashboard charts |

---

## 🖥️ Backend

| Technology | Purpose |
|------------|---------|
| 🟢 Node.js | Runtime |
| 🚏 Express 5 | Web framework |
| 🍃 MongoDB | Database |
| 🔐 JWT | Authentication |
| 🔒 bcryptjs | Password hashing |
| 🤖 Groq API (Llama 3.3 70B) | AI quiz generation |

---

# 📁 Project Structure

---

## Project Structure

```
Ai-Quiz-Generator/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe, forgot/reset password
│   │   └── quizController.js  # Generate quiz, save result, history, stats, leaderboard
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── QuizResult.js      # Quiz result schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   ├── quizRoutes.js      # /api/quiz/*
│   │   └── userRoutes.js      # /api/user/*
│   ├── services/
│   │   └── aiService.js       # (Optional) Gemini integration
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── package.json
│   └── server.js              # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuizPlayer.jsx     # Quiz playing & result review
│   │   │   ├── MyQuizzesSection.jsx
│   │   │   ├── SettingsSection.jsx
│   │   │   ├── LeaderboardSection.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state & methods
│   │   │   └── ThemeContext.jsx   # Dark/light theme
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx      # Main dashboard with sidebar
│   │   │   ├── QuizPage.jsx       # Alternative quiz route
│   │   │   ├── QuizForm.jsx       # Quiz generation form
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + auth header
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                     # VITE_API_URL (optional)
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MongoDB** (local or Atlas)
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ai-Quiz-Generator
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your-secure-random-string
GROQ_API_KEY=your-groq-api-key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder (optional):

```env
# Only needed if backend is on a different URL
VITE_API_URL=http://localhost:5000
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `GROQ_API_KEY` | Yes | Groq API key for AI quiz generation |
| `FRONTEND_URL` | No | Frontend base URL (e.g. for reset links) |

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API base URL (default: `http://localhost:5000`) |

---

## Running the Application

### Development mode

**Terminal 1 – Backend:**

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`.

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Production build

```bash
# Frontend
cd frontend
npm run build

# Serve the built files with a static server or your backend
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register user (name, email, password) |
| POST | `/login` | No | Login (email, password) |
| GET | `/me` | Yes | Get current user |
| POST | `/forgot-password` | No | Request password reset |
| POST | `/reset-password` | No | Reset password with token |

### Quiz (`/api/quiz`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/generate-quiz` | No | Generate quiz (topic, difficulty, numQuestions) |
| POST | `/save-result` | Yes | Save quiz result |
| GET | `/history` | Yes | Get user's quiz history |
| GET | `/stats` | Yes | Get user's quiz stats |
| DELETE | `/history/all` | Yes | Delete all quiz history |
| GET | `/leaderboard` | No | Get leaderboard |

### Protected routes

Use header:

```
Authorization: Bearer <token>
```

---

## User Flow

1. **Landing page** (`/`) – Overview and links to Sign up / Login.
2. **Sign up** (`/signup`) – Create account (name, email, password).
3. **Login** (`/login`) – Sign in with email and password.
4. **Dashboard** (`/dashboard`) – After login:
   - Overview: stats, generate quiz CTA, recent quizzes.
   - Click **Generate Quiz** to open the quiz form.
5. **Quiz form** – Enter topic, difficulty, number of questions → **Generate Quiz**.
6. **Quiz player** – Answer questions, see feedback and explanations.
7. **Quiz result** – Review all questions, your answers, correct answers, and explanations.
8. **My Quizzes** – View all completed quizzes.
9. **Profile** – View profile and recent activity.
10. **Settings** – View account info and clear quiz history.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## 👩‍💻 Author

**Sadhana Shree**
