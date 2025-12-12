import { useEffect, useMemo, useState } from "react";
import { quizzesCol, saveAttempt } from "../lib/firestore";
import { getDocs, query, where } from "firebase/firestore";
import CategoryFilter from "../components/CategoryFilter";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

type Quiz = {
  id: string;
  title: string;
  category: string;
  questions: { q: string; options: string[]; answerIndex: number }[];
};

export default function Quizzes() {
  const [active, setActive] = useState<string>("All");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Quiz | null>(null);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    if (active !== "All") {
      const filter = query(quizzesCol(), where("category", "==", active));
      const snap = await getDocs(filter);
      setQuizzes(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } else {
      const snap = await getDocs(quizzesCol());
      setQuizzes(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [active]);

  const progress = useMemo(() => {
    if (!selected) return 0;
    const answered = Object.keys(responses).length;
    return selected.questions.length ? Math.round((answered / selected.questions.length) * 100) : 0;
  }, [responses, selected]);

  const submitQuiz = async () => {
    if (!user || !selected) return;
    let correct = 0;
    selected.questions.forEach((q, idx) => {
      if (responses[idx] === q.answerIndex) correct++;
    });
    const score = Math.round((correct / selected.questions.length) * 100);
    await saveAttempt({ uid: user.uid, quizId: selected.id, score });
    alert(`Submitted! Score: ${score}%`);
    setSelected(null);
    setResponses({});
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Quizzes</h2>
      <p className="text-gray-600 mb-4">Test your knowledge with our curated quizzes</p>
      <CategoryFilter active={active} onChange={setActive} />
      {!selected ? (
        <div className="mt-4">
          <div className="mb-4">
            <div className="text-sm text-gray-600">Your Progress</div>
            <div className="text-sm text-gray-600">Completed 0 of {quizzes.length} quizzes</div>
            <ProgressBar value={0} />
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-gray-600">No quizzes available in this category yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {quizzes.map((qz) => (
                <div key={qz.id} className="p-4 bg-white border rounded">
                  <div className="font-medium">{qz.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{qz.category}</div>
                  <button className="mt-3 px-3 py-1 rounded bg-blue-600 text-white" onClick={() => setSelected(qz)}>
                    Start
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="p-4 bg-white border rounded">
            <div className="font-medium">{selected.title}</div>
            <div className="mt-2">
              {selected.questions.map((q, idx) => (
                <div key={idx} className="mb-4">
                  <div className="font-medium">{idx + 1}. {q.q}</div>
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          checked={responses[idx] === oi}
                          onChange={() => setResponses((r) => ({ ...r, [idx]: oi }))}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="mb-2 text-sm text-gray-600">Progress</div>
              <ProgressBar value={progress} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setSelected(null)}>Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={submitQuiz}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
