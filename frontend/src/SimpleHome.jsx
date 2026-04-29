import React from 'react';

export default function SimpleHome() {
  return (
    <div style={{
      padding: '40px',
      background: '#FAF7F2',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      color: '#2C1810'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
        ReviewGuard Frontend Works!
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        Vite + React + Tailwind - all loaded OK.
      </p>
      <ul style={{ lineHeight: '1.6' }}>
        <li>✅ App.jsx routes</li>
        <li>✅ main.jsx root</li>
        <li>✅ Tailwind config</li>
        <li>✅ CSS custom classes safelisted</li>
        <li>✅ Backend API at localhost:5010 (logs predictions)</li>
      </ul>
      <p style={{ marginTop: '30px' }}>
        <a href="/checker" style={{ color: '#C4704A', textDecoration: 'underline' }}>Go to Checker →</a>
      </p>
    </div>
  );
}

