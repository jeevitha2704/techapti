import { db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function seed() {
  const materials = [
    { title: "Number Series Basics", category: "Aptitude", difficulty: "Beginner", description: "Learn fundamentals of number series." },
    { title: "Data Structures Overview", category: "Technical", difficulty: "Intermediate", description: "Core DS concepts for interviews." },
    { title: "Greedy vs DP", category: "Coding", difficulty: "Advanced", description: "When to use greedy vs dynamic programming." },
    { title: "STAR Method", category: "Interview Prep", difficulty: "Beginner", description: "Structure your answers effectively." }
  ];
  for (const m of materials) await addDoc(collection(db, "materials"), m);

  const quiz = {
    title: "Aptitude Quick Check",
    category: "Aptitude",
    questions: [
      { q: "What comes next in 2, 4, 8, 16, ?", options: ["24", "32", "30", "18"], answerIndex: 1 },
      { q: "If x=3, evaluate 2x+5.", options: ["9", "11", "7", "6"], answerIndex: 1 },
      { q: "Find the odd one: 3, 9, 27, 81, 82", options: ["81", "27", "82", "9"], answerIndex: 2 }
    ]
  };
  await addDoc(collection(db, "quizzes"), quiz);
}
