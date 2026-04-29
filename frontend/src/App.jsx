/**
 * App.jsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Test from './test-render';
import Checker from './pages/Checker';

import Analytics from './pages/Analytics';
import ResultCard from './components/ResultCard';

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
<Route path="/" element={<Home />} />
        <Route path="/checker" element={<Checker />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-center px-6 pt-24">
            <div>
              <div className="font-display text-8xl font-bold text-sand mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>404</div>
              <h2 className="font-display text-2xl text-espresso mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Page not found</h2>
              <a href="/" className="text-umber underline font-sans text-sm">← Back to Home</a>
            </div>
          </div>
        } />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-sand bg-parchment py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-espresso flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#FAF7F2" strokeWidth="1.5"/>
                <path d="M6 9l2 2 4-4" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display text-sm font-semibold text-espresso" style={{ fontFamily: "'Playfair Display', serif" }}>
              ReviewGuard
            </span>
          </div>
          <p className="text-xs text-muted font-sans text-center">
            AI-Based Fake Review Detection · Computer Engineering, Shah & Anchor Kutchhi Engineering College · 2025–26
          </p>
          <p className="text-xs text-muted font-sans">
            Logistic Regression · TF-IDF · NLP
          </p>
        </div>
      </footer>
    </div>
  );
}
