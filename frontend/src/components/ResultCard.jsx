/**
 * components/ResultCard.jsx
 * ──────────────────────────
 * Shows the prediction result, confidence, flags, and explanation charts.
 */

import React, { useState, useEffect } from 'react';
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ─── Confidence Gauge ─────────────────────────────────────────────────────────
function ConfidenceGauge({ value, isFake }) {
  const color = isFake ? '#C4704A' : '#7C8C6E';
  const data = [{ value, fill: color }];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <RadialBarChart
          width={144} height={144}
          cx={72} cy={72}
          innerRadius={50} outerRadius={68}
          startAngle={90} endAngle={-270}
          data={data}
          barSize={14}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#E8DCC8' }}
            dataKey="value"
            cornerRadius={7}
            angleAxisId={0}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold" style={{ color, fontFamily: "'Playfair Display', serif" }}>
            {value}%
          </span>
          <span className="text-xs text-muted font-sans mt-0.5">confidence</span>
        </div>
      </div>
      <span className="text-xs text-muted mt-1 font-sans">{
        value > 85 ? 'Very High' : value > 70 ? 'High' : value > 55 ? 'Moderate' : 'Low'
      }</span>
    </div>
  );
}

// ─── Probability Bar ─────────────────────────────────────────────────────────
function ProbabilityBars({ fakeProb, genuineProb }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-sans font-medium text-red-700">Fake Probability</span>
          <span className="font-mono text-red-700 font-semibold">{fakeProb}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: animated ? `${fakeProb}%` : '0%',
              background: 'linear-gradient(90deg, #C4704A, #E8967A)'
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-sans font-medium text-green-700">Genuine Probability</span>
          <span className="font-mono text-green-700 font-semibold">{genuineProb}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: animated ? `${genuineProb}%` : '0%',
              background: 'linear-gradient(90deg, #7C8C6E, #A8B89A)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Text Stats Chart ─────────────────────────────────────────────────────────
function TextStatsChart({ stats }) {
  const data = [
    { name: 'Word Count', value: Math.min(stats.word_count, 100), max: 100, unit: 'words' },
    { name: 'Exclamations', value: Math.min(stats.exclamation_marks * 10, 100), max: 100, raw: stats.exclamation_marks, unit: '' },
    { name: 'Caps %', value: Math.min(stats.caps_percentage * 2, 100), max: 100, raw: `${stats.caps_percentage}%`, unit: '' },
    { name: 'Extreme Words', value: Math.min(stats.extreme_words * 15, 100), max: 100, raw: stats.extreme_words, unit: '' },
  ];

  const COLORS = ['#8B7355', '#C4704A', '#C4704A', '#C4704A'];

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#8B7355' }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} hide />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #E8DCC8',
            borderRadius: 8,
            fontFamily: 'DM Sans',
            fontSize: 12,
            boxShadow: '0 4px 16px rgba(139,115,85,0.1)'
          }}
          formatter={(value, name, props) => {
            const item = data.find(d => d.name === props.payload.name);
            return [item?.raw !== undefined ? item.raw : `${props.payload.value}`, props.payload.name];
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main ResultCard ──────────────────────────────────────────────────────────
export default function ResultCard({ result }) {
  const isFake = result.label === 'FAKE';
  const { explanation } = result;

  return (
    <div className="animate-scale-in space-y-4">
      {/* ── Main Verdict ── */}
      <div
        className={`card p-6 border-2 ${
          isFake ? 'border-terracotta/30 bg-orange-50/30' : 'border-sage/30 bg-green-50/30'
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isFake ? 'bg-red-100' : 'bg-green-100'
                }`}
              >
                {isFake ? '⚠️' : '✅'}
              </div>
              <div>
                <p className="text-xs font-sans text-muted uppercase tracking-widest mb-0.5">
                  Verdict
                </p>
                <h2
                  className={`font-display text-3xl font-bold ${
                    isFake ? 'text-red-700' : 'text-green-700'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {isFake ? 'Fake Review' : 'Genuine Review'}
                </h2>
              </div>
            </div>
            <p className="text-sm text-muted font-sans mb-4">
              Analyzed using <span className="font-semibold text-umber">{result.model_used}</span>
            </p>
            <ProbabilityBars fakeProb={result.fake_probability} genuineProb={result.genuine_probability} />
          </div>
          <ConfidenceGauge value={result.confidence} isFake={isFake} />
        </div>
      </div>

      {/* ── Flags / Indicators ── */}
      {explanation?.flags?.length > 0 && (
        <div className="card p-6">
          <h3
            className="font-display text-lg font-semibold text-espresso mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Detection Signals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explanation.flags.map((flag, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border ${
                  flag.type === 'warning'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{flag.type === 'warning' ? '🚩' : '✔️'}</span>
                  <span
                    className={`text-sm font-semibold font-sans ${
                      flag.type === 'warning' ? 'text-red-700' : 'text-green-700'
                    }`}
                  >
                    {flag.label}
                  </span>
                </div>
                <p className="text-xs text-slate font-sans leading-relaxed">{flag.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Why We Think This ── */}
      {explanation?.reasons?.length > 0 && (
        <div className="card-warm p-6">
          <h3
            className="font-display text-lg font-semibold text-espresso mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why {isFake ? 'This Looks Fake' : 'This Looks Genuine'}
          </h3>
          <ul className="space-y-2">
            {explanation.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isFake ? 'bg-terracotta/20 text-terracotta' : 'bg-sage/20 text-sage'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-body text-slate leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Text Analysis Chart ── */}
      {explanation?.text_stats && (
        <div className="card p-6">
          <h3
            className="font-display text-lg font-semibold text-espresso mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Text Characteristics
          </h3>
          <p className="text-xs text-muted font-sans mb-4">
            Visual breakdown of linguistic signals detected in your review
          </p>
          <TextStatsChart stats={explanation.text_stats} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Words', value: explanation.text_stats.word_count },
              { label: 'Exclamations', value: explanation.text_stats.exclamation_marks },
              { label: 'Caps %', value: `${explanation.text_stats.caps_percentage}%` },
              { label: 'Extreme Words', value: explanation.text_stats.extreme_words },
            ].map((stat, i) => (
              <div key={i} className="card-warm rounded-xl p-3 text-center">
                <div className="font-display text-xl font-bold text-espresso" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted font-sans mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
