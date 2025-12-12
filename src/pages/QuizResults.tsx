// src/pages/QuizResults.tsx
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/quiz.css";

export default function QuizResults() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();

  if (!state || !state.results) {
    // If user lands here directly, redirect to quiz
    navigate("/quiz");
    return null;
  }

  const { results, score, total } = state;
  const percent = Math.round((score / total) * 100);

  return (
    <main className="quiz-root">
      <header className="results-header">
        <h2>Quiz Results</h2>
        <div className="results-summary">
          <div className="score">{score}/{total}</div>
          <div className="percent">{percent}%</div>
        </div>
        <div className="results-actions">
          <button className="btn-primary" onClick={() => navigate("/materials")}>Go to Materials</button>
          <button className="btn-ghost" onClick={() => navigate("/quiz")}>Retake Quiz</button>
        </div>
      </header>

      <section className="results-list">
        {results.map((r: any, i: number) => (
          <article key={r.id} className={`result-item ${r.correct ? "correct" : "incorrect"}`}>
            <h3 className="result-q">{i + 1}. {r.text}</h3>

            <ul className="result-choices">
              {r.choices.map((c: string, idx: number) => {
                const isSelected = r.selectedIndex === idx;
                const isCorrect = r.correctIndex === idx;
                return (
                  <li key={idx} className={`result-choice ${isCorrect ? "correct-choice" : ""} ${isSelected ? "selected-choice" : ""}`}>
                    <span className="choice-letter">{String.fromCharCode(97 + idx)})</span>
                    <span className="choice-text">{c}</span>
                    {isCorrect && <span className="choice-badge">Correct</span>}
                    {isSelected && !isCorrect && <span className="choice-badge wrong">Your answer</span>}
                  </li>
                );
              })}
            </ul>

            {r.explanation && <div className="result-explain"><strong>Explanation:</strong> {r.explanation}</div>}
          </article>
        ))}
      </section>
    </main>
  );
}
