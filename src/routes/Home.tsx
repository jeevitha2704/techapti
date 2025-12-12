import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Welcome to TechApti</h1>
      <p className="text-gray-600 mb-6">
        Your comprehensive learning and assessment platform for aptitude, technical skills, and interview preparation.
      </p>
      <Link to="/login" className="inline-block px-4 py-2 rounded bg-blue-600 text-white">Get Started</Link>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Feature title="Interactive Quizzes" desc="Test your knowledge with comprehensive quizzes across multiple topics" />
        <Feature title="Study Materials" desc="Access curated learning resources organized by category and difficulty" />
        <Feature title="Track Progress" desc="Monitor your performance and see your improvement over time" />
        <Feature title="Get Certified" desc="Earn certificates and badges as you complete learning milestones" />
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-white border rounded">
      <div className="font-medium">{title}</div>
      <div className="text-gray-600 text-sm mt-1">{desc}</div>
    </div>
  );
}
