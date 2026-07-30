import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import AddBook from "./components/AddBook";
import Goals from "./pages/Goals";
import AddGoal from "./components/AddGoal";
import Recommendations from "./pages/Recommendations";
import ProtectedRoute from "./services/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>}/>
          <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>}/>
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>}/>
          <Route path="/add-goal" element={<ProtectedRoute><AddGoal /></ProtectedRoute>}/>
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>}/>     
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;