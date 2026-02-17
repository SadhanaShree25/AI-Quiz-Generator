import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Changed from Register to Signup to match new UI
import AdvancedDashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      {/* Now the root of your app is the beautiful Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdvancedDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />

      {/* CATCH-ALL: Redirect unknown URLs to Landing Page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;