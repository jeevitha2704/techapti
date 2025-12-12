// src/pages/Login.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import "../styles/login.css";
import {
  setCurrentUserId,
  loadProfileForUser,
  saveProfileForUser,
  ProfileData,
} from "../utils/auth";

/**
 * Simple client-side credential store for mock email/password sign-in.
 * This is only for local testing. Replace with real auth in production.
 */
const CREDENTIALS_KEY = "techapti_credentials_v1";
function loadCredentials(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveCredentials(creds: Record<string, string>) {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch {}
}

const mockAccounts = {
  google: ["jeevitha@gmail.com", "work.jeevitha@company.com"],
  github: ["jeevitha", "jeevitha-dev@users.noreply.github.com"],
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // email/password form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // social picker state
  const [picker, setPicker] = useState<{ provider: "google" | "github"; open: boolean } | null>(null);

  // simple ref for creating account
  const passRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // If already signed in, go to materials
    try {
      const current = localStorage.getItem("techapti_current_user");
      if (current) navigate("/materials");
    } catch {}
  }, [navigate]);

  function ensureProfileForId(id: string) {
    const existing = loadProfileForUser(id);
    if (!existing) {
      const defaultProfile: ProfileData = {
        fullName: id.includes("@") ? id.split("@")[0] : id,
        username: id.includes("@") ? id.split("@")[0] : id,
        email: id.includes("@") ? id : `${id}@example.com`,
        avatarDataUrl: null,
        preferences: { emailNotifications: true, learningGoals: "3 quizzes / week" },
      };
      saveProfileForUser(id, defaultProfile);
    }
  }

  function handleEmailSignIn(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email || !password) return alert("Enter email and password (mock).");

    setLoading(true);
    setTimeout(() => {
      const creds = loadCredentials();
      // if user exists, verify password
      if (creds[email]) {
        if (creds[email] !== password) {
          setLoading(false);
          return alert("Incorrect password (mock).");
        }
      } else {
        // create account automatically (mock sign-up)
        creds[email] = password;
        saveCredentials(creds);
      }

      // set current user and ensure profile exists
      setCurrentUserId(email);
      ensureProfileForId(email);

      setLoading(false);
      navigate("/materials");
    }, 500);
  }

  function openPicker(provider: "google" | "github") {
    setPicker({ provider, open: true });
  }

  function closePicker() {
    setPicker(null);
  }

  function handleSocialSelect(account: string) {
    // account is used as user id (email or github id)
    setLoading(true);
    setTimeout(() => {
      setCurrentUserId(account);
      ensureProfileForId(account);
      setLoading(false);
      closePicker();
      navigate("/materials");
    }, 400);
  }

  return (
    <div className="login-root">
      <div className="login-card" role="form" aria-labelledby="login-title">
        <h2 id="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to continue to Techapti</p>

        <div className="social-row">
          <button
            className="social-btn google"
            onClick={() => openPicker("google")}
            aria-haspopup="dialog"
            aria-expanded={picker?.open && picker.provider === "google"}
          >
            <FaGoogle className="social-icon" /> Continue with Google
          </button>

          <button
            className="social-btn github"
            onClick={() => openPicker("github")}
            aria-haspopup="dialog"
            aria-expanded={picker?.open && picker.provider === "github"}
          >
            <FaGithub className="social-icon" /> Continue with GitHub
          </button>
        </div>

        <div className="divider"><span>or</span></div>

        <form onSubmit={handleEmailSignIn}>
          <label className="login-label">
            Email
            <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="login-label">
            Password
            <input
              ref={passRef}
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="login-actions">
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              className="login-ghost"
              onClick={() => {
                setEmail("");
                setPassword("");
                navigate("/get-started");
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>

      {/* Social account picker modal (mock) */}
      {picker?.open && (
        <div className="picker-backdrop" role="dialog" aria-modal="true" aria-label="Choose account">
          <div className="picker-card">
            <header className="picker-header">
              <strong>Continue with {picker.provider === "google" ? "Google" : "GitHub"}</strong>
              <button className="picker-close" onClick={closePicker} aria-label="Close">✕</button>
            </header>

            <p className="picker-sub">Choose an account to continue</p>

            <ul className="picker-list">
              {mockAccounts[picker.provider].map((a) => (
                <li key={a}>
                  <button
                    className="picker-item"
                    onClick={() => handleSocialSelect(a)}
                    aria-label={`Sign in as ${a}`}
                  >
                    <span className="picker-avatar" aria-hidden="true">
                      {picker.provider === "google" ? <FaGoogle /> : <FaGithub />}
                    </span>
                    <span className="picker-text">{a}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="picker-footer">
              <button
                className="picker-add"
                onClick={() => {
                  // "Use another account" — prompt for an email (mock)
                  const other = prompt("Enter email or username to sign in with:");
                  if (other) handleSocialSelect(other.trim());
                }}
              >
                Use another account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
