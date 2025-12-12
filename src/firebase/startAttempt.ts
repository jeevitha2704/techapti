// src/firebase/startAttempt.ts
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function startAttempt(quizId: string) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  const db = getFirestore();
  const attemptRef = doc(collection(db, "attempts")); // auto id
  const attemptId = attemptRef.id;

  await setDoc(attemptRef, {
    userId: user.uid,
    quizId,
    startTime: serverTimestamp(),
    status: "in_progress",
    createdAt: serverTimestamp()
  });

  return attemptId;
}
