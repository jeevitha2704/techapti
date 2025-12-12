// src/pages/Profile.tsx
import { useEffect, useRef, useState } from "react";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserId,
  loadProfileForUser,
  saveProfileForUser,
  setCurrentUserId,
} from "../utils/auth";

type LocalProfile = {
  fullName: string;
  username: string;
  email: string;
  avatarDataUrl?: string | null;
  preferences?: {
    emailNotifications?: boolean;
    learningGoals?: string;
  };
};

function defaultProfileForId(id: string): LocalProfile {
  const name = id.includes("@") ? id.split("@")[0] : id;
  return {
    fullName: name,
    username: name,
    email: id.includes("@") ? id : `${id}@example.com`,
    avatarDataUrl: null,
    preferences: { emailNotifications: true, learningGoals: "3 quizzes / week" },
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<LocalProfile | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // load profile for current user on mount
  useEffect(() => {
    const id = getCurrentUserId();
    if (!id) {
      navigate("/login");
      return;
    }
    const p = loadProfileForUser(id);
    if (p) {
      setProfile(p);
      setForm(p);
    } else {
      const def = defaultProfileForId(id);
      saveProfileForUser(id, def);
      setProfile(def);
      setForm(def);
    }
    // listen for profile updates from other parts of the app
    function onUpdate() {
      const id2 = getCurrentUserId();
      if (!id2) {
        setProfile(null);
        setForm(null);
        return;
      }
      const updated = loadProfileForUser(id2) || defaultProfileForId(id2);
      setProfile(updated);
      setForm(updated);
    }
    window.addEventListener("profile-updated", onUpdate as EventListener);
    return () => window.removeEventListener("profile-updated", onUpdate as EventListener);
  }, [navigate]);

  // keep form in sync when profile changes
  useEffect(() => {
    setForm(profile);
  }, [profile]);

  function persistProfile(newProfile: LocalProfile) {
    const id = getCurrentUserId();
    if (!id) {
      // if no user, redirect to login
      navigate("/login");
      return;
    }
    saveProfileForUser(id, newProfile);
    setProfile(newProfile);
    setForm(newProfile);
    window.dispatchEvent(new CustomEvent("profile-updated", { detail: newProfile }));
  }

  function onChangeField<K extends keyof LocalProfile>(key: K, value: LocalProfile[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : null));
  }

  function onSave(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form) return;
    if (!form.fullName.trim()) return alert("Full name cannot be empty.");
    if (!form.username.trim()) return alert("Username cannot be empty.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email))) return alert("Enter a valid email.");
    persistProfile(form);
    setEditing(false);
  }

  function onAvatarPick(file?: File) {
    if (!file || !form) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setForm((f) => (f ? { ...f, avatarDataUrl: dataUrl } : f));
    };
    reader.readAsDataURL(file);
  }

  function onRemoveAvatar() {
    if (!form) return;
    setForm((f) => (f ? { ...f, avatarDataUrl: null } : f));
  }

  function handleSignOut() {
    if (!confirm("Sign out?")) return;
    setCurrentUserId(null);
    navigate("/login");
  }

  if (!profile || !form) {
    return (
      <main className="profile-root">
        <header className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-sub">Manage your account settings and preferences</p>
          </div>
        </header>

        <div style={{ padding: 20 }}>
          <p>Loading profile…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-root">
      <header className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-sub">Manage your account settings and preferences</p>
        </div>
      </header>

      <div className="profile-top">
        <div className="profile-left">
          <div className="avatar-wrap" aria-hidden={!profile.avatarDataUrl}>
            {form.avatarDataUrl ? (
              <img src={form.avatarDataUrl} alt={`${form.fullName} avatar`} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-fallback" aria-hidden="true">
                {String(form.fullName || "SU")
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-name">
            <div className="profile-fullname">{profile.fullName}</div>
            <div className="profile-role">Student</div>
          </div>
        </div>

        <div className="profile-right">
          {!editing ? (
            <>
              <div className="account-info">
                <div className="info-row">
                  <span className="label">Full name</span>
                  <span className="value">{profile.fullName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Username</span>
                  <span className="value">{profile.username}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email</span>
                  <span className="value">{profile.email}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditing(true);
                    setForm(profile);
                  }}
                >
                  Edit
                </button>
                <button className="btn-ghost" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <form className="edit-form" onSubmit={onSave}>
              <label className="form-row">
                <span className="form-label">Full name</span>
                <input className="form-input" value={form.fullName} onChange={(e) => onChangeField("fullName", e.target.value)} />
              </label>

              <label className="form-row">
                <span className="form-label">Username</span>
                <input className="form-input" value={form.username} onChange={(e) => onChangeField("username", e.target.value)} />
              </label>

              <label className="form-row">
                <span className="form-label">Email</span>
                <input className="form-input" value={form.email} onChange={(e) => onChangeField("email", e.target.value)} />
              </label>

              <div className="form-row avatar-row">
                <span className="form-label">Avatar</span>
                <div className="avatar-controls">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(ev) => {
                      const f = ev.target.files?.[0];
                      if (f) onAvatarPick(f);
                    }}
                  />
                  <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
                    Upload
                  </button>
                  <button type="button" className="btn-ghost" onClick={onRemoveAvatar}>
                    Remove
                  </button>
                </div>
              </div>

              <div className="form-row prefs-row">
                <span className="form-label">Email notifications</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!!form.preferences?.emailNotifications}
                    onChange={(e) => {
                      setForm((f) => (f ? { ...f, preferences: { ...(f.preferences || {}), emailNotifications: e.target.checked } } : f));
                    }}
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              <div className="form-row">
                <span className="form-label">Learning goals</span>
                <input
                  className="form-input"
                  value={form.preferences?.learningGoals || ""}
                  onChange={(e) => {
                    setForm((f) => (f ? { ...f, preferences: { ...(f.preferences || {}), learningGoals: e.target.value } } : f));
                  }}
                />
              </div>

              <div className="profile-actions">
                <button type="submit" className="btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setEditing(false);
                    setForm(profile);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <section className="profile-lower">
        <h3>Preferences</h3>

        <div className="prefs-cards">
          <div className="pref-card">
            <div className="pref-card-left">
              <div className="pref-title">Preferences</div>
              <div className="pref-desc">Customize your learning experience</div>
            </div>
            <div className="pref-card-right">
              <button
                className="btn-ghost"
                onClick={() => {
                  setEditing(true);
                }}
              >
                Configure
              </button>
            </div>
          </div>

          <div className="pref-card">
            <div className="pref-card-left">
              <div className="pref-title">Email Notifications</div>
              <div className="pref-desc">Receive notifications about quiz results and updates</div>
            </div>
            <div className="pref-card-right">
              <label className="switch-inline">
                <input
                  type="checkbox"
                  checked={!!profile.preferences?.emailNotifications}
                  onChange={(e) => {
                    const updated = { ...profile, preferences: { ...(profile.preferences || {}), emailNotifications: e.target.checked } };
                    persistProfile(updated);
                  }}
                />
                <span className="switch-slider-small" />
              </label>
            </div>
          </div>

          <div className="pref-card">
            <div className="pref-card-left">
              <div className="pref-title">Learning Goals</div>
              <div className="pref-desc">Set daily or weekly quiz completion targets</div>
            </div>
            <div className="pref-card-right">
              <button
                className="btn-ghost"
                onClick={() => {
                  setEditing(true);
                }}
              >
                Set Goals
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
