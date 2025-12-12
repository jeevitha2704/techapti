// src/pages/Quizzes.tsx
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";
import "./Quizzes.css"; // optional extra styles for the page

export default function Quizzes() {
  const navigate = useNavigate();

  return (
    <main className="quizzes-root">
      <header className="quizzes-header">
        <h1 className="quizzes-title">Quizzes</h1>
        <p className="quizzes-sub">Attempt curated aptitude quizzes to test and track your skills.</p>
      </header>

      <section className="quizzes-list">
        <article
          className="quiz-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/quiz")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate("/quiz"); }}
          aria-label="Open Number System Aptitude Quiz, 15 questions"
        >
          <div className="quiz-card-left">
            <div className="quiz-card-title">Number System — Aptitude Quiz</div>
            <div className="quiz-card-meta">15 questions · Medium → Hard</div>
          </div>

          <div className="quiz-card-right">
            <div className="quiz-card-cta">Attempt Quiz</div>
          </div>
        </article>
      </section>
    </main>
  );
}

