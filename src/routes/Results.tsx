import { useEffect, useMemo, useState } from "react";
import { attemptsCol } from "../lib/firestore";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

type Attempt = { id: string; score: number; quizId: string; createdAt?: any; };

export default function Results() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const q = query(attemptsCol(), where("uid", "==", user.uid));
    const snap = await getDocs(q);
    const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    setAttempts(rows);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const totalAttempts = attempts.length;
  const average = useMemo(() => (!attempts.length ? 0 : Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)), [attempts]);
  const highest = useMemo(() => attempts.reduce((h, a) => Math.max(h, a.score), 0), [attempts]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Results</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Metric title="Total Attempts" value={`${totalAttempts} (Across ${new Set(attempts.map(a => a.quizId)).size} quizzes)`} />
        <Metric title="Average Score" value={`${average}%`} />
        <Metric title="Highest Score" value={`${highest}% ${highest < 70 ? "(Needs Improvement)" : ""}`} />
      </div>

      <div className="mt-6">
        <div className="font-semibold mb-2">Quiz History</div>
        {loading ? (
          <div>Loading...</div>
        ) : attempts.length === 0 ? (
          <div className="text-gray-600">No quiz results yet. Start taking quizzes to see your performance!</div>
        ) : (
          <div className="bg-white border rounded">
            {attempts.map((a) => (
              <div key={a.id} className="flex justify-between px-4 py-3 border-b last:border-b-0">
                <div className="text-sm">Quiz: {a.quizId}</div>
                <div className="text-sm">Score: {a.score}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 bg-white border rounded">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
