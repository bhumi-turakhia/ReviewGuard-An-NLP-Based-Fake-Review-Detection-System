/**
 * pages/Home.jsx
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_REVIEWS = [
  {
    text: "WOW!!! ABSOLUTELY INCREDIBLE!!! BEST PRODUCT EVER!!! BUY NOW YOU WON'T REGRET IT!!!",
    label: 'FAKE',
    note: 'Excessive punctuation & hyperbole'
  },
  {
    text: "I've been using this for about three weeks now. It works well for the most part, though the instructions could be clearer. Decent value for the price.",
    label: 'GENUINE',
    note: 'Balanced, specific, measured tone'
  },
  {
    text: "Changed my life overnight!! Cannot believe nobody told me about this sooner! Bought 5 for all my friends!",
    label: 'FAKE',
    note: 'Unrealistic claims & urgency'
  }
];

const FEATURES = [
  {
    icon: '🔍',
    title: 'NLP Preprocessing',
    desc: 'Tokenization, stopword removal, and text normalization pipeline for clean feature extraction.'
  },
  {
    icon: '📐',
    title: 'TF-IDF Vectorization',
    desc: 'Converts raw text into weighted numerical features capturing word importance across documents.'
  },
  {
    icon: '🧠',
    title: 'Logistic Regression',
    desc: '87% accuracy classifier trained on 40,000+ labeled reviews with robust generalization.'
  },
  {
    icon: '📊',
    title: 'Explainability',
    desc: 'Detailed reasoning behind every prediction — not just a label, but why and how.'
  }
];

const STATS = [
  { value: '87%', label: 'Model Accuracy' },
  { value: '0.94', label: 'AUC Score' },
  { value: '40K+', label: 'Training Reviews' },
  { value: '2', label: 'ML Models' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-parchment border border-sand rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse-soft" />
            <span className="text-xs font-sans font-medium text-umber tracking-wide uppercase">
              AI · NLP · Machine Learning
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl font-bold text-espresso leading-tight mb-6 animate-fade-up"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Detect Fake Reviews
            <br />
            <span className="italic text-terracotta">with Confidence</span>
          </h1>

          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up delay-100 opacity-0-init">
            An AI-powered system using Natural Language Processing and Machine Learning
            to distinguish authentic customer reviews from deceptive ones — instantly
            and with full transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200 opacity-0-init">
            <button
              onClick={() => navigate('/checker')}
              className="btn-primary text-base w-full sm:w-auto"
            >
              Analyze a Review →
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="btn-secondary text-base w-full sm:w-auto"
            >
              View Analytics
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-warm rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <div key={i} className="text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div
                    className="font-display text-4xl font-bold text-espresso"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs font-sans text-muted mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="font-display text-3xl font-bold text-espresso"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How It Works
            </h2>
            <p className="text-muted font-sans mt-2">The end-to-end ML pipeline</p>
          </div>

          {/* Pipeline steps */}
          <div className="flex flex-col sm:flex-row items-start justify-center gap-0 sm:gap-0 mb-16">
            {[
              { icon: '✍️', step: '01', title: 'Input', desc: 'User enters review text' },
              { icon: '⚙️', step: '02', title: 'Preprocess', desc: 'Clean & tokenize text' },
              { icon: '📐', step: '03', title: 'Vectorize', desc: 'TF-IDF feature extraction' },
              { icon: '🧠', step: '04', title: 'Classify', desc: 'ML model prediction' },
              { icon: '📋', step: '05', title: 'Explain', desc: 'Result + reasoning' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex-1 flex flex-col items-center text-center px-4 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-14 h-14 rounded-2xl bg-parchment border border-sand flex items-center justify-center text-2xl mb-3 shadow-warm">
                    {s.icon}
                  </div>
                  <div className="text-xs font-mono text-taupe mb-1">{s.step}</div>
                  <div className="font-sans font-semibold text-espresso text-sm">{s.title}</div>
                  <div className="text-xs text-muted mt-1">{s.desc}</div>
                </div>
                {i < 4 && (
                  <div className="hidden sm:flex items-center text-taupe text-xl mt-5 flex-shrink-0">→</div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card p-6 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3
                  className="font-display text-lg font-semibold text-espresso mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm font-sans text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Reviews ── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="font-display text-3xl font-bold text-espresso"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Real Examples
            </h2>
            <p className="text-muted font-sans mt-2">Reviews the model correctly classifies</p>
          </div>

          <div className="space-y-4">
            {SAMPLE_REVIEWS.map((r, i) => (
              <div key={i} className="card p-5 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <p className="font-body text-sm text-slate leading-relaxed flex-1 italic">
                    "{r.text}"
                  </p>
                  <div className="flex-shrink-0">
                    <span className={r.label === 'FAKE' ? 'badge-fake' : 'badge-genuine'}>
                      {r.label === 'FAKE' ? '❌ Fake' : '✅ Genuine'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted font-sans mt-3">
                  <span className="font-semibold">Signal:</span> {r.note}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/checker')}
              className="btn-primary"
            >
              Try with Your Own Review →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
