# AI Quiz Generator

AI-powered quiz generator web app that dynamically creates multiple-choice quizzes based on any topic you provide.

## Features

- **Dynamic Quiz Generation**: Generate quizzes based on any topic input.  
- **Customizable Questions**: Specify the number of questions to generate.  
- **Multiple Choice Options**: Each question has 4 options (A–D) with correct answers.  
- **Interactive Quiz Interface**: Select answers with radio buttons.  
- **Score Evaluation**: Submit answers and see your score instantly.  
- **Correct/Incorrect Highlighting**: Your answers are highlighted in red/green.  
- **Responsive UI**: Works on both desktop and mobile.  
- **Smooth Transitions & Hover Effects**: Enhances user experience.  
- **Confetti Animation**: Celebration effect on quiz completion.  

## Demo

Provide a link to your hosted app or screenshots here:  
[Your Demo Link](https://your-username.github.io/ai-quiz-generator/)

## Tech Stack

- **Frontend**: React, Axios, Vite  
- **Backend**: Node.js, Express  
- **API**: OpenAI GPT-4 Mini (`gpt-4o-mini`)  
- **Styling**: CSS with gradient backgrounds and responsive design  

## Project Structure

Ai-Quiz-Generator/
├─ backend/
│ ├─ index.js
│ ├─ server.js
│ ├─ routes/
│ │ └─ quizRoutes.js
│ └─ .env (contains OPENAI_API_KEY, not pushed to GitHub)
├─ frontend/
│ ├─ src/
│ │ ├─ App.jsx
│ │ ├─ QuizForm.jsx
│ │ ├─ Quiz.jsx
│ │ ├─ App.css
│ │ └─ main.jsx
│ └─ package.json
├─ .gitignore
└─ README.md

shell
Copy code

## Installation

### Backend Setup
```bash
cd backend
npm install

###Create a .env file inside the backend folder:

OPENAI_API_KEY=your_openai_api_key_here
**Start the server:**  node server.js
The backend runs on http://localhost:5000.

###Frontend Setup
cd frontend
npm install
npm run dev
The frontend runs on http://localhost:5173.


##Environment Variables
Store your OpenAI API key in .env inside the backend folder:
OPENAI_API_KEY=your_openai_api_key
Important: Do not push this file to GitHub.

