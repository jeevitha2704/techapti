// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import GetStarted from "./pages/GetStarted";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Quizzes from "./pages/Quizzes";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Header from "./components/Header";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import RequireAuth from "./components/RequireAuth";
import "./styles/app.css";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app-main">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/get-started" replace />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/materials" element={<RequireAuth><Materials /></RequireAuth>} />
          <Route path="/quizzes" element={<RequireAuth><Quizzes /></RequireAuth>} />
          <Route path="/results" element={<RequireAuth><Results /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
          <Route path="/quiz-results" element={<RequireAuth><QuizResults /></RequireAuth>} />
        </Routes>
      </main>
    </div>
  );
}
