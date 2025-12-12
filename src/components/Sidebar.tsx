
import { FaBook, FaRegFileAlt, FaClipboardList, FaChartLine, FaCertificate } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  // Sidebar is always open, no toggle or localStorage
  return (
    <aside className="sidebar sidebar-open">
      <div className="sidebar-top">
        <div className="brand">
          <FaBook className="brand-icon" />
          <span className="brand-text">Techapti</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink to="/materials" className="nav-item">
          <FaRegFileAlt className="nav-icon" />
          <span className="nav-text">Study Materials</span>
        </NavLink>

        <NavLink to="/quizzes" className="nav-item">
          <FaClipboardList className="nav-icon" />
          <span className="nav-text">Quizzes</span>
        </NavLink>

        <NavLink to="/results" className="nav-item">
          <FaChartLine className="nav-icon" />
          <span className="nav-text">Results</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          <FaCertificate className="nav-icon" />
          <span className="nav-text">Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}
