// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.submitAttempt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }
  const uid = context.auth.uid;
  const { attemptId, quizId, answers } = data || {};

  if (!attemptId || !quizId || !Array.isArray(answers)) {
    throw new functions.https.HttpsError("invalid-argument", "Missing attemptId, quizId or answers");
  }

  // Load quiz doc (server copy with correct answers)
  const quizRef = db.doc(`quizzes/${quizId}`);
  const quizSnap = await quizRef.get();
  if (!quizSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Quiz not found");
  }
  const quiz = quizSnap.data() || {};
  const questions = quiz.questions || [];

  // Build question map
  const qMap = new Map();
  for (const q of questions) {
    if (q && q.id) qMap.set(q.id, q);
  }

  // Validate submitted question IDs
  for (const a of answers) {
    if (!qMap.has(a.questionId)) {
      throw new functions.https.HttpsError("invalid-argument", `Invalid questionId: ${a.questionId}`);
    }
  }

  // Read attempt doc to verify ownership and get startTime
  const attemptRef = db.doc(`attempts/${attemptId}`);
  const attemptSnap = await attemptRef.get();
  if (!attemptSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Attempt not found");
  }
  const attempt = attemptSnap.data() || {};
  if (attempt.userId !== uid) {
    throw new functions.https.HttpsError("permission-denied", "Not allowed to submit this attempt");
  }

  // If already completed, return existing result (idempotency)
  if (attempt.status === "completed" && typeof attempt.score === "number") {
    return {
      attemptId,
      score: attempt.score,
      total: attempt.total || questions.length,
      durationSeconds: attempt.durationSeconds || null
    };
  }

  // Compute details and score
  const details = answers.map((a) => {
    const q = qMap.get(a.questionId);
    const selected = typeof a.selectedIndex === "number" ? a.selectedIndex : null;
    const correctIndex = q.answerIndex;
    const correct = selected === correctIndex;
    return {
      questionId: a.questionId,
      selectedIndex: selected,
      correctIndex,
      correct,
      explanation: q.explanation || null
    };
  });

  const score = details.filter((d) => d.correct).length;
  const total = questions.length;

  // Compute endTime and durationSeconds
  const endTime = admin.firestore.Timestamp.now();
  let durationSeconds = null;
  if (attempt.startTime && attempt.startTime.toDate) {
    const start = attempt.startTime.toDate();
    durationSeconds = Math.max(0, Math.round((endTime.toDate().getTime() - start.getTime()) / 1000));
  }

  // Update attempt doc with results (merge)
  await attemptRef.set({
    endTime,
    durationSeconds,
    score,
    total,
    details,
    status: "completed",
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  // Optionally write a summary into quizzes/{quizId}/attempts/{attemptId}
  const summaryRef = db.doc(`quizzes/${quizId}/attempts/${attemptId}`);
  await summaryRef.set({
    attemptId,
    userId: uid,
    score,
    total,
    durationSeconds,
    startTime: attempt.startTime || null,
    endTime,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { attemptId, score, total, durationSeconds };
});
