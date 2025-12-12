import { useNavigate } from "react-router-dom";
import { FaFeatherAlt, FaBookOpen, FaTasks, FaAward } from "react-icons/fa";
import "../styles/getstarted.css";

const features = [
  { icon: <FaFeatherAlt />, title: "Interactive Quills", desc: "Test your knowledge with comprehensive quizzes across topics." },
  { icon: <FaBookOpen />, title: "Study Materials", desc: "Access curated learning resources organized by category." },
  { icon: <FaTasks />, title: "Track Progress", desc: "Monitor performance and see your improvement over time." },
  { icon: <FaAward />, title: "Get Certified", desc: "Earn certificates and badges as you complete milestones." },
];

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <main className="gs-root">
      <section className="gs-hero">
        <h1 className="gs-title">Welcome to <span className="gs-brand">Techapti</span></h1>
        <p className="gs-sub">Your comprehensive learning and assessment platform for aptitude, technical skills, and interview preparation.</p>
        <center>
        <h2>
        <button className="gs-cta" onClick={() => navigate("/login")}>Get Started</button>
        </h2>
        </center>
      </section>

      <section className="gs-features" aria-label="Platform features">
        {features.map((f, i) => (
          <article key={i} className="gs-card" tabIndex={0} role="button" onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") window.location.href = "/quizzes";
          }} onClick={() => window.location.href = "/quizzes"}>
            <div className="gs-card-icon">{f.icon}</div>
            <h3 className="gs-card-title">{f.title}</h3>
            <p className="gs-card-desc">{f.desc}</p>
          </article>
        ))}
      </section>

      <section className="gs-why">
        <h2 className="gs-why-title">Why Choose Techapti</h2>

        <div className="gs-why-grid">
          <div className="gs-why-col">
            <h3 className="gs-why-sub">For Students</h3>
            <ul>
              <li>Prepare for aptitude tests and technical interviews</li>
              <li>Practice coding problems with instant feedback</li>
              <li>Access curated study materials anytime, anywhere</li>
            </ul>
          </div>

          <div className="gs-why-col">
            <h3 className="gs-why-sub">Platform Features</h3>
            <ul>
              <li>Comprehensive quiz system with multiple categories</li>
              <li>Detailed performance analytics and insights</li>
              <li>Personalized learning recommendations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="gs-cta-block">
        <h3 className="gs-cta-title">Ready to Begin Your Journey?</h3>
        <p className="gs-cta-sub">Join thousands of learners improving their skills every day.</p>
        <div className="gs-cta-actions">
          <button className="gs-cta-primary" onClick={() => navigate("/login")}>Sign In to Get Started</button>
          <button className="gs-cta-secondary" onClick={() => navigate("/materials")}>Explore Study Materials</button>
        </div>
      </section>
    </main>
  );
}
