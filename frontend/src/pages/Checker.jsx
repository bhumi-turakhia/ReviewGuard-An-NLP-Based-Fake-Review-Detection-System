import React, { useState } from "react";
import { predictReview } from "../utils/api";
import ResultCard from '../components/ResultCard';

export default function Checker() {
  const [text, setText] = useState("");
  const [model, setModel] = useState("lr");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();

    if (!trimmed) {
      setError("Please enter a review.");
      return;
    }

    if (trimmed.length < 5) {
      setError("Review too short.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await predictReview(trimmed, model);

      // ✅ Important: interceptor already returns data
      setResult(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-espresso mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analyze Review
          </h1>
          <p className="text-xl text-muted font-sans">Choose model and enter review text</p>
        </div>

      {/* Model Selector */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setModel("lr")}
          className={`px-6 py-2 rounded-lg font-sans font-medium text-sm transition-all ${
            model === 'lr' ? 'btn-primary shadow-warm' : 'btn-secondary hover:bg-parchment'
          }`}
        >
          Logistic Regression
        </button>
        <button 
          onClick={() => setModel("nb")}
          className={`px-6 py-2 rounded-lg font-sans font-medium text-sm transition-all ${
            model === 'nb' ? 'btn-primary shadow-warm' : 'btn-secondary hover:bg-parchment'
          }`}
        >
          Naive Bayes
        </button>
      </div>

      {/* Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="review-input resize-vertical min-h-[160px] mb-6"
        placeholder="Paste the review text here to analyze if it's genuine or fake..."
      />

      {/* Submit */}
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className="w-full btn-primary text-lg py-4 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="animate-spin-custom inline-block mr-2 w-5 h-5 border-2 border-cream border-t-transparent rounded-full"></span>
            Analyzing...
          </>
        ) : (
          'Analyze Review →'
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          <ResultCard result={result.data || result} />
        </div>
      )}
      </div>
    </div>
  );
}
