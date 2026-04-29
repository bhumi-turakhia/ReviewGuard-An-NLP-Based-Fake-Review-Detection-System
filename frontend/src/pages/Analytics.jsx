import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getStats } from "../utils/api";

const COLORS = ['#C4704A', '#7C8C6E'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then(data => {
        setStats(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Backend or model not ready. Train model & start backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-espresso mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analytics Dashboard
          </h1>
          <div className="card p-12 text-center animate-pulse-soft">
            <div className="w-16 h-16 bg-sand rounded-full mx-auto mb-4 animate-spin-custom"></div>
            <h3 className="text-umber font-sans font-semibold">Loading dataset & model stats...</h3>
            <p className="text-muted text-sm mt-2">40K+ reviews analyzed</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-cream pt-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-espresso mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analytics Dashboard
          </h1>
          <div className="card-warm p-12 text-center">
            <div className="w-20 h-20 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-espresso font-sans font-semibold text-xl mb-2">{error}</h3>
            <p className="text-muted mb-6">Run <code className="bg-sand px-2 py-1 rounded text-xs font-mono">cd ml-model && python3 train_model.py</code><br/>
            and <code className="bg-sand px-2 py-1 rounded text-xs font-mono">cd backend && npm start</code></p>
            <div className="flex gap-3 justify-center">
              <button className="btn-primary px-6" onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dataset pie data
  const datasetData = [
    { name: 'Fake Reviews', value: stats.dataset?.fake || stats.fake_count || 0, fill: COLORS[0] },
    { name: 'Genuine Reviews', value: stats.dataset?.genuine || stats.genuine_count || 0, fill: COLORS[1] }
  ];

  // Model metrics bar data
  const modelDataLR = [
    { metric: 'Accuracy', value: stats.model_performance?.logistic_regression?.accuracy * 100 || stats.lr_accuracy * 100 },
    { metric: 'Precision', value: stats.model_performance?.logistic_regression?.precision * 100 || stats.lr_precision * 100 },
    { metric: 'Recall', value: stats.model_performance?.logistic_regression?.recall * 100 || stats.lr_recall * 100 },
    { metric: 'F1', value: stats.model_performance?.logistic_regression?.f1 * 100 || stats.lr_f1 * 100 }
  ];

  // Confusion matrix
  const cm = stats.model_performance?.logistic_regression?.confusion_matrix || stats.lr_confusion_matrix || [[0,0],[0,0]];
  const totalPred = cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1];

  return (
    <div className="min-h-screen bg-cream pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold text-espresso mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analytics Dashboard
          </h1>
          <p className="text-xl text-muted font-sans">Model performance and dataset insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Dataset Distribution */}
          <div className="card p-8">
            <h3 className="font-display text-xl font-semibold text-espresso mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Dataset Distribution
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={datasetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {datasetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-display text-2xl font-bold text-terracotta" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {datasetData[0].value}
                </div>
                <div className="text-sm text-muted font-sans">Fake</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-sage" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {datasetData[1].value}
                </div>
                <div className="text-sm text-muted font-sans">Genuine</div>
              </div>
            </div>
          </div>

          {/* Model Metrics */}
          <div className="card p-8">
            <h3 className="font-display text-xl font-semibold text-espresso mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Logistic Regression Metrics
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={modelDataLR}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="metric" />
                  <YAxis tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={v => [`${v}%`]} />
                  <Legend />
                  <Bar dataKey="value" fill="#2C1810" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          {/* Confusion Matrix */}
          <div className="card p-8">
            <h3 className="font-display text-xl font-semibold text-espresso mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Confusion Matrix
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
              <div className="bg-sage/10 p-4 rounded-xl">
                <div className="text-2xl font-bold text-sage">{cm[0][0]}</div>
                <div className="text-xs text-muted uppercase font-mono">TN</div>
              </div>
              <div className="bg-terracotta/10 p-4 rounded-xl">
                <div className="text-2xl font-bold text-terracotta">{cm[0][1]}</div>
                <div className="text-xs text-muted uppercase font-mono">FP</div>
              </div>
              <div className="bg-sage/10 p-4 rounded-xl">
                <div className="text-2xl font-bold text-sage">{cm[1][0]}</div>
                <div className="text-xs text-muted uppercase font-mono">FN</div>
              </div>
              <div className="bg-terracotta/10 p-4 rounded-xl">
                <div className="text-2xl font-bold text-terracotta">{cm[1][1]}</div>
                <div className="text-xs text-muted uppercase font-mono">TP</div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-sm text-muted mb-1">Accuracy: {(totalPred > 0 ? (cm[0][0] + cm[1][1]) / totalPred * 100 : 0).toFixed(1)}%</div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="card p-8">
            <h3 className="font-display text-xl font-semibold text-espresso mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
              Live Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-parchment rounded-xl">
                <div className="font-display text-3xl font-bold text-espresso" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stats.live_stats?.total_analyzed || 0}
                </div>
                <div className="text-xs text-muted uppercase font-sans tracking-wider">Total Analyzed</div>
              </div>
              <div className="text-center p-4 bg-parchment rounded-xl">
                <div className="font-display text-3xl font-bold text-terracotta" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stats.live_stats?.fake_detected || 0}
                </div>
                <div className="text-xs text-muted uppercase font-sans tracking-wider">Fake Detected</div>
              </div>
              <div className="text-center p-4 bg-parchment rounded-xl">
                <div className="font-display text-3xl font-bold text-sage" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stats.live_stats?.genuine_detected || 0}
                </div>
                <div className="text-xs text-muted uppercase font-sans tracking-wider">Genuine</div>
              </div>
              <div className="text-center p-4 bg-parchment rounded-xl">
                <div className="text-lg font-bold text-umber">{stats.model_performance?.logistic_regression?.auc * 100 || stats.auc_lr * 100 || 0 | 0}%</div>
                <div className="text-xs text-muted uppercase font-sans tracking-wider">AUC Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div>
            <h4 className="font-display text-lg font-semibold text-espresso mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Top Fake Indicators
            </h4>
            <div className="bg-orange-50/50 border border-terracotta/20 rounded-xl p-6 max-h-48 overflow-y-auto">
              <ul className="space-y-1">
                {(stats.fake_indicators || []).slice(0,8).map((word, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate">
                    <span className="w-5 h-5 bg-terracotta/20 rounded-full flex items-center justify-center text-xs font-bold text-terracotta">{i+1}</span>
                    <span>"{word}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-espresso mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Top Genuine Indicators
            </h4>
            <div className="bg-green-50/50 border border-sage/20 rounded-xl p-6 max-h-48 overflow-y-auto">
              <ul className="space-y-1">
                {(stats.genuine_indicators || []).slice(0,8).map((word, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate">
                    <span className="w-5 h-5 bg-sage/20 rounded-full flex items-center justify-center text-xs font-bold text-sage">{i+1}</span>
                    <span>"{word}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

