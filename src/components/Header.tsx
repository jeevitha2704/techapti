// src/components/Header.tsx
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { getCurrentUserId, loadProfileForUser, setCurrentUserId } from "../utils/auth";

type Notification = {
  id: string;
  title: string;
  body: string;
  time?: string;
  read?: boolean;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Maintenance",
      body: "The app is currently under building. Some features may be unavailable.",
      time: "Just now",
      read: false,
    },
  ]);

  const popRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<{ fullName?: string; avatarDataUrl?: string } | null>(null);

  useEffect(() => {
  const loadProfile = () => {
    try {
      const id = getCurrentUserId();
      if (!id) {
        setProfileData(null);
        return;
      }

      // defensive: ensure the helper exists and is callable
      if (typeof loadProfileForUser !== "function") {
        console.error("loadProfileForUser is not a function", loadProfileForUser);
        setProfileData(null);
        return;
      }

      const p = loadProfileForUser(id); // may return null or a full profile object

      // normalize to the shape this component expects
      if (p && typeof p === "object") {
        setProfileData({
          fullName: (p as any).fullName || undefined,
          avatarDataUrl: (p as any).avatarDataUrl || undefined,
        });
      } else {
        setProfileData(null);
      }
    } catch (err) {
      console.error("Error loading profile in Header:", err);
      setProfileData(null);
    }
  };

  loadProfile();
  window.addEventListener("profile-updated", loadProfile);
  return () => window.removeEventListener("profile-updated", loadProfile);
}, []);

  function toggle() {
    setOpen((v) => !v);
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  }

  function signOut() {
    setCurrentUserId(null);
    navigate("/login");
  }

  return (
    <header className="app-header">
      <div className="header-right">
        <div className="notif-wrap" ref={popRef}>
          <button
            className="notif-btn"
            onClick={toggle}
            aria-haspopup="true"
            aria-expanded={open}
            aria-label="Notifications"
            title="Notifications"
          >
            <FaBell />
            {notifications.some(n => !n.read) && <span className="notif-dot" aria-hidden="true" />}
          </button>

          {open && (
            <div className="notif-pop" role="dialog" aria-label="Notifications">
              <div className="notif-pop-header">
                <strong>Notifications</strong>
                <button className="notif-mark" onClick={markAllRead} aria-label="Mark all as read">Mark all</button>
              </div>

              <ul className="notif-list">
                {notifications.map(n => (
                  <li
                    key={n.id}
                    className={`notif-item ${n.read ? "read" : "unread"}`}
                    onClick={() => { markRead(n.id); setOpen(false); }}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") { markRead(n.id); setOpen(false); } }}
                    role="button"
                    aria-pressed={n.read}
                  >
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-body">{n.body}</div>
                    <div className="notif-time">{n.time}</div>
                  </li>
                ))}
              </ul>

              <div className="notif-pop-footer">
                <button className="notif-view-all" onClick={() => { setOpen(false); navigate("/results"); }}>
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        <NavLink to="/profile" className="profile-link" aria-label="Profile">
          {profileData?.avatarDataUrl ? (
            <img src={profileData.avatarDataUrl} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-fallback-small" aria-hidden="true">
              {(profileData?.fullName || "SU").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase()}
            </div>
          )}
        </NavLink>

        <button className="header-signout btn-ghost" onClick={signOut} aria-label="Sign out">Sign out</button>
      </div>
    </header>
  );
}
