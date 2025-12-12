import { useEffect, useState } from "react";
import { materialsCol } from "../lib/firestore";
import { getDocs, query, where } from "firebase/firestore";
import CategoryFilter from "../components/CategoryFilter";

type Material = {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  url?: string;
};

export default function StudyMaterials() {
  const [active, setActive] = useState<string>("All");
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    if (active !== "All") {
      const filter = query(materialsCol(), where("category", "==", active));
      const snap = await getDocs(filter);
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } else {
      const snap = await getDocs(materialsCol());
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [active]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Study Materials</h2>
      <p className="text-gray-600 mb-4">Browse and access learning resources organized by topic</p>
      <CategoryFilter active={active} onChange={setActive} />
      <div className="mt-4">
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No study materials available in this category yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((m) => (
              <div key={m.id} className="p-4 bg-white border rounded">
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {m.category} • {m.difficulty}
                </div>
                <div className="text-sm text-gray-700 mt-2">{m.description}</div>
                {m.url && (
                  <a href={m.url} target="_blank" rel="noreferrer" className="text-blue-700 text-sm mt-2 inline-block">
                    Open resource
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
