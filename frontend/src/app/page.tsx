"use client";
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Error connecting to backend. Make sure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-8">
      <div className="max-w-2xl w-full space-y-6 mt-12">
        <h1 className="text-3xl font-bold text-blue-400">Local RTX 4050 AI Tutor</h1>
        <p className="text-slate-400">Full-Stack Next.js + FastAPI + Ollama running 100% locally.</p>

        <form onSubmit={handleAsk} className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a computer science question..."
            className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {answer && (
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        )}
      </div>
    </main>
  );
}