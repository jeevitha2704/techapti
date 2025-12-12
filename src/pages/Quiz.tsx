// src/pages/Quiz.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QUESTIONS, { Question } from "../data/quizQuestions";
import "../styles/quiz.css";
import { startAttempt } from "../firebase/startAttempt";
import { submitAttemptClient } from "../firebase/submitAttemptClient";

type AnswersMap = Record<string, number | null>;

export default function Quiz() {
  const navigate = useNavigate();
  const { quizId: routeQuizId } = useParams<{ quizId?: string }>();
  const quizId = routeQuizId || "number-system"; // fallback if you don't use route param

  // initialize answers from localStorage or default nulls
  const initialAnswers = useMemo(() => {
    const map: AnswersMap = Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
    try {
      const raw = localStorage.getItem(`quiz_answers:${quizId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as AnswersMap;
        return { ...map, ...parsed };
      }
    } catch {}
    return map;
  }, [quizId]);

  const [answers, setAnswers] = useState<AnswersMap>(initialAnswers);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attemptId, setAttemptId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`attempt:${quizId}`);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // persist answers to localStorage whenever they change (debounced simple)
  useEffect(() => {
    try {
      localStorage.setItem(`quiz_answers:${quizId}`, JSON.stringify(answers));
    } catch {}
  }, [answers, quizId]);

  // helper to set an answer
  function setAnswer(qid: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
    setTouched((t) => ({ ...t, [qid]: true }));
  }

  // Start attempt: create attempt doc and persist attemptId
  async function handleStart() {
    if (attemptId) return; // already started
    try {
      setLoading(true);
      const id = await startAttempt(quizId);
      setAttemptId(id);
      try {
        localStorage.setItem(`attempt:${quizId}`, id);
      } catch {}
    } catch (err) {
      console.error("Failed to start attempt", err);
      alert("Could not start attempt. Please sign in and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Build answers payload for submit
  function buildAnswersPayload() {
    return QUESTIONS.map((q) => ({
      questionId: q.id,
      selectedIndex: answers[q.id] ?? null,
    }));
  }

  // Submit: call Cloud Function to compute and persist results
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!attemptId) {
      // if user never clicked Start, create attempt now
      await handleStart();
      if (!attemptId && !localStorage.getItem(`attempt:${quizId}`)) {
        // start failed
        return;
      }
    }

    // confirm at least one answer selected (optional)
    const anyAnswered = Object.values(answers).some((v) => v !== null);
    if (!anyAnswered && !confirm("You haven't answered any questions. Submit anyway?")) return;

    try {
      setLoading(true);
      const payload = buildAnswersPayload();
      // call callable function; it will validate, compute, and update attempt doc
      const res = await submitAttemptClient(attemptId || localStorage.getItem(`attempt:${quizId}`)!, quizId, payload);
      // res expected: { attemptId, score, total, durationSeconds }
      // clear local progress
      try {
        localStorage.removeItem(`quiz_answers:${quizId}`);
        localStorage.removeItem(`attempt:${quizId}`);
      } catch {}
      // navigate to results page (Results page should read attempt doc or fetch latest)
      navigate("/results");
    } catch (err) {
      console.error("Submit failed", err);
      alert("Failed to submit attempt. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Clear answers
  function clearAnswers() {
    if (!confirm("Clear all answers?")) return;
    const cleared = Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
    setAnswers(cleared as AnswersMap);
    setTouched({});
    try {
      localStorage.removeItem(`quiz_answers:${quizId}`);
    } catch {}
  }

  return (
    <main className="quiz-root">
      <h2 className="quiz-title">Aptitude Quiz — {QUESTIONS.length} Questions</h2>
      <p className="quiz-sub">Answer the questions below and submit to see your results.</p>

      {!attemptId ? (
        <div style={{ marginBottom: 16 }}>
          <button className="btn-primary" onClick={handleStart} disabled={loading}>
            {loading ? "Starting…" : "Start Quiz"}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 12, color: "#0f172a" }}>
          Attempt in progress — <strong>Attempt ID:</strong> {attemptId}
        </div>
      )}

      <form
        className="quiz-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {QUESTIONS.map((q: Question, idx) => (
          <fieldset key={q.id} className="q-fieldset" aria-labelledby={`${q.id}-label`}>
            <legend id={`${q.id}-label`} className="q-legend">
              {idx + 1}. {q.text}
            </legend>

            <div role="radiogroup" aria-labelledby={`${q.id}-label`} className="q-choices">
              {q.choices.map((c, i) => (
                <label key={i} className={`q-choice ${answers[q.id] === i ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name={q.id}
                    value={i}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswer(q.id, i)}
                  />
                  <span className="choice-letter">{String.fromCharCode(97 + i)})</span>
                  <span className="choice-text">{c}</span>
                </label>
              ))}
            </div>

            <div className="q-hint" aria-hidden={!touched[q.id]}>
              {touched[q.id] ? "Answer recorded" : "Not answered yet"}
            </div>
          </fieldset>
        ))}

        <div className="quiz-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting…" : "Submit Answers"}
          </button>

          <button type="button" className="btn-ghost" onClick={clearAnswers} disabled={loading}>
            Clear Answers
          </button>
        </div>
      </form>
    </main>
  );
}