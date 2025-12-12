const categories = ["All", "Aptitude", "Technical", "Coding", "Interview Prep", "Logical Reasoning"];

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((c) => (
        <button
          key={c}
          className={`px-3 py-1 rounded border ${active === c ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
