// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import "../styles/login.css";

type Provider = "google" | "github";

const mockAccounts: Record<Provider, string[]> = {
  google: ["jeevitha@gmail.com", "work.jeevitha@company.com"],
  github: ["jeevitha", "jeevitha-dev@users.noreply.github.com"],
};

function SocialPicker({
  provider,
  accounts,
  onSelect,
  onClose,
}: {
  provider: Provider;
  accounts: string[];
  onSelect: (emailOrId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="picker-backdrop" role="dialog" aria-modal="true" aria-label="Choose account">
      <div className="picker-card">
        <header className="picker-header">
          <strong>Continue with {provider === "google" ? "Google" : "GitHub"}</strong>
          <button className="picker-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <p className="picker-sub">Choose an account to continue</p>

        <ul className="picker-list">
          {accounts.map((a) => (
            <li key={a}>
              <button
                className="picker-item"
                onClick={() => onSelect(a)}
                aria-label={`Sign in as ${a}`}
              >
                <span className="picker-avatar" aria-hidden="true">
                  {provider === "google" ? <FaGoogle /> : <FaGithub />}
                </span>
                <span className="picker-text">{a}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="picker-footer">
          <button className="picker-add" onClick={() => onSelect("add-new")}>Use another account</button>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState<{ provider: Provider; open: boolean } | null>(null);

  function openPicker(provider: Provider) {
    setPicker({ provider, open: true });
  }

  function closePicker() {
    setPicker(null);
  }

  function handleSocialSelect(account: string) {
    // Simulate sign-in flow
    setLoading(true);
    // In a real flow you would exchange provider token on the server
    setTimeout(() => {
      setLoading(false);
      // For testing, navigate to materials and optionally store user info
      // You can replace this with your auth success handler
      navigate("/materials");
    }, 600);
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

        <label className="login-label">
          Email
          <input className="login-input" type="email" placeholder="you@example.com" />
        </label>

        <label className="login-label">
          Password
          <input className="login-input" type="password" placeholder="••••••••" />
        </label>

        <div className="login-actions">
          <button
            className="login-btn"
            onClick={() => navigate("/materials")}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <button
            className="login-ghost"
            onClick={() => navigate("/get-started")}
            aria-label="Back to get started"
          >
            Back
          </button>
        </div>
      </div>

      {picker?.open && (
        <SocialPicker
          provider={picker.provider}
          accounts={mockAccounts[picker.provider]}
          onSelect={(a) => {
            // If user chooses "add-new" you can open a real OAuth popup or show an input
            if (a === "add-new") {
              closePicker();
              // For now, simulate adding a new account by navigating to materials
              setLoading(true);
              setTimeout(() => { setLoading(false); navigate("/materials"); }, 600);
              return;
            }
            handleSocialSelect(a);
          }}
          onClose={closePicker}
        />
      )}
    </div>
  );
}
