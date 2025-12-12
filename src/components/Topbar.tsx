import { useAuth } from "../context/AuthContext";
import { logout } from "../lib/auth";
import { Link } from "react-router-dom";

export default function Topbar() {
  const { user } = useAuth();
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <div className="font-medium">Learning Platform</div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button onClick={logout} className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
              Sign out
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Sign in</Link>
        )}
      </div>
    </header>
  );
}
