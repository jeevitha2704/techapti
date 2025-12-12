import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("student");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyTarget, setDailyTarget] = useState(0);
  const [weeklyTarget, setWeeklyTarget] = useState(3);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const data = snap.data() || {};
    setDisplayName(data.displayName || user.displayName || "Student User");
    setEmail(user.email || "");
    setEmailNotifications(data.preferences?.emailNotifications ?? true);
    setDailyTarget(data.preferences?.dailyTarget ?? 0);
    setWeeklyTarget(data.preferences?.weeklyTarget ?? 3);
    setLoading(false);
  };

  const save = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      displayName,
      preferences: { emailNotifications, dailyTarget, weeklyTarget },
    });
    alert("Profile updated.");
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Profile</h2>
      <p className="text-gray-600 mb-4">Manage your account settings and preferences</p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white border rounded">
            <div className="text-sm font-semibold mb-3">Account Information</div>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Full Name</label>
                <input className="w-full border rounded px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Username</label>
                <input className="w-full border rounded px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input className="w-full border rounded px-3 py-2" value={email} disabled />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border rounded">
            <div className="text-sm font-semibold mb-3">Preferences</div>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                <span className="text-sm">Email Notifications: Receive notifications about quiz results and updates</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Daily Target</label>
                  <input type="number" className="w-full border rounded px-3 py-2" value={dailyTarget} onChange={(e) => setDailyTarget(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm">Weekly Target</label>
                  <input type="number" className="w-full border rounded px-3 py-2" value={weeklyTarget} onChange={(e) => setWeeklyTarget(Number(e.target.value))} />
                </div>
              </div>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
