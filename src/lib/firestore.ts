import { doc, setDoc, getDoc, addDoc, serverTimestamp, collection } from "firebase/firestore";

import { db } from "./firebase";

export type Category = "Aptitude" | "Technical" | "Coding" | "Interview Prep" | "Logical Reasoning";

export const usersCol = () => collection(db, "users");
export const materialsCol = () => collection(db, "materials");
export const quizzesCol = () => collection(db, "quizzes");
export const attemptsCol = () => collection(db, "attempts");

export const ensureUserDoc = async (uid: string, data?: any) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: data?.displayName ?? "",
      email: data?.email ?? "",
      preferences: { emailNotifications: true, dailyTarget: 0, weeklyTarget: 3 },
      createdAt: serverTimestamp(),
    });
  }
  return ref;
};

export const saveAttempt = async (payload: { uid: string; quizId: string; score: number }) => {
  return await addDoc(attemptsCol(), {
    uid: payload.uid,
    quizId: payload.quizId,
    score: payload.score,
    createdAt: serverTimestamp(),
  });
};
