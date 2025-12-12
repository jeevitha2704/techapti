// src/utils/auth.ts
export type ProfileData = {
  fullName: string;
  username: string;
  email: string;
  avatarDataUrl?: string | null;
  preferences?: {
    emailNotifications?: boolean;
    learningGoals?: string;
  };
};

const CURRENT_KEY = "techapti_current_user";
const PROFILE_PREFIX = "profile:";
const RESULT_PREFIX = "result:";

/** current user id (use email as id for simplicity) */
export function getCurrentUserId(): string | null {
  try {
    return localStorage.getItem(CURRENT_KEY);
  } catch {
    return null;
  }
}

export function setCurrentUserId(id: string | null) {
  try {
    if (id === null) localStorage.removeItem(CURRENT_KEY);
    else localStorage.setItem(CURRENT_KEY, id);
  } catch {}
}

/** profile helpers */
export function loadProfileForUser(id: string): ProfileData | null {
  try {
    const raw = localStorage.getItem(PROFILE_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as ProfileData;
  } catch {
    return null;
  }
}
export function saveProfileForUser(id: string, profile: ProfileData) {
  try {
    localStorage.setItem(PROFILE_PREFIX + id, JSON.stringify(profile));
  } catch {}
}

/** result helpers */
export type QuizResultPayload = {
  score: number;
  total: number;
  results: any[];
  timestamp?: number;
  title?: string;
};
export function saveResultForUser(id: string, payload: QuizResultPayload) {
  try {
    localStorage.setItem(RESULT_PREFIX + id, JSON.stringify(payload));
  } catch {}
}
export function loadResultForUser(id: string): QuizResultPayload | null {
  try {
    const raw = localStorage.getItem(RESULT_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as QuizResultPayload;
  } catch {
    return null;
  }
}
