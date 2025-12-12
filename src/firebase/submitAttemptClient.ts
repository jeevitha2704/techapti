// src/firebase/submitAttemptClient.ts
import { getFunctions, httpsCallable } from "firebase/functions";

export type AnswerPayload = { questionId: string; selectedIndex: number | null };

/**
 * Call the callable Cloud Function submitAttempt.
 * Expects the function to return { attemptId, score, total, durationSeconds }.
 */
export async function submitAttemptClient(
  attemptId: string,
  quizId: string,
  answers: AnswerPayload[]
) {
  const functions = getFunctions();
  const submit = httpsCallable(functions, "submitAttempt");
  const res = await submit({ attemptId, quizId, answers });
  return res.data;
}
