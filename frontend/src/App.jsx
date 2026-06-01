import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import AdvancedDashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<AdvancedDashboard />} />
      <Route path="/dashboard" element={<AdvancedDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* CATCH-ALL: Redirect unknown URLs to Home Dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;