// src/pages/Results.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId, loadResultForUser } from "../utils/auth";

import "../styles/quiz.css";
import "../styles/results.css";

type StoredResult = {
  score: number;
  total: number;
  results: Array<{
    id: string;
    text: string;
    choices: string[];
    correctIndex: number;
    selectedIndex: number | null;
    explanation?: string;
    correct: boolean;
  }>;
  timestamp?: number;
  title?: string;
};

export default function Results() {
  const [data, setData] = useState<StoredResult | null>(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const id = getCurrentUserId();
  if (!id) { navigate("/login"); return; }
  const r = loadResultForUser(id);
  setData(r);
}, []);


  if (!data) {
    return (
      <main className="quiz-root">
        <h2>No recent quiz results</h2>
        <p>You haven't completed a quiz yet. Go to <button className="btn-link" onClick={() => navigate("/quizzes")}>Quizzes</button> to attempt one.</p>
      </main>
    );
  }

  const percent = Math.round((data.score / data.total) * 100);
  const passed = percent >= 50; // change threshold as needed

  // compact summary of which questions are right
  const summaryItems = data.results.map((r, i) => ({
    index: i + 1,
    correct: r.correct,
  }));

  return (
    <main className="quiz-root">
      <header className="results-header">
        <h2>Latest Quiz Results</h2>
        <div className="results-actions">
          <button className="btn-primary" onClick={() => navigate("/materials")}>Go to Materials</button>
          <button className="btn-ghost" onClick={() => navigate("/quizzes")}>Back to Quizzes</button>
        </div>
      </header>

      <section className="results-summary-area">
        <article
          className="summary-card"
          role="button"
          tabIndex={0}
          onClick={() => setExpanded((s) => !s)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded((s) => !s); }}
          aria-expanded={expanded}
          aria-label="Toggle quiz result details"
        >
          <div className="summary-left">
            <div className="summary-title">{data.title ?? "Number System — Aptitude Quiz"}</div>
            <div className="summary-meta">{data.total} questions · {data.score} correct</div>
            <div className="summary-pass">
              <span className={`pass-badge ${passed ? "pass" : "fail"}`}>{passed ? "Passed" : "Failed"}</span>
              <span className="percent">{percent}%</span>
            </div>
          </div>

          <div className="summary-right">
            <div className="mini-grid" aria-hidden="true">
              {summaryItems.map((s) => (
                <div key={s.index} className={`mini-dot ${s.correct ? "correct" : "incorrect"}`} title={`Q${s.index} ${s.correct ? "Correct" : "Wrong"}`}>
                  {s.index}
                </div>
              ))}
            </div>
            <div className="summary-hint">{expanded ? "Hide details" : "View details"}</div>
          </div>
        </article>

        {expanded && (
          <div className="details-panel" role="region" aria-label="Quiz detailed results">
            <div className="details-header">
              <strong>Detailed Results</strong>
              <div className="details-stats">{data.score}/{data.total} correct · {percent}%</div>
            </div>

            <div className="results-list">
              {data.results.map((r, i) => (
                <article key={r.id} className={`result-item ${r.correct ? "correct" : "incorrect"}`}>
                  <div className="result-top">
                    <h3 className="result-q">{i + 1}. {r.text}</h3>
                    <div className="result-indicator">{r.correct ? "Correct" : "Wrong"}</div>
                  </div>

                  <ul className="result-choices">
                    {r.choices.map((c, idx) => {
                      const isSelected = r.selectedIndex === idx;
                      const isCorrect = r.correctIndex === idx;
                      return (
                        <li key={idx} className={`result-choice ${isCorrect ? "correct-choice" : ""} ${isSelected ? "selected-choice" : ""}`}>
                          <span className="choice-letter">{String.fromCharCode(97 + idx)})</span>
                          <span className="choice-text">{c}</span>
                          {isCorrect && <span className="choice-badge">Answer</span>}
                          {isSelected && !isCorrect && <span className="choice-badge wrong">Your answer</span>}
                        </li>
                      );
                    })}
                  </ul>

                  {r.explanation && <div className="result-explain"><strong>Explanation:</strong> {r.explanation}</div>}
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
