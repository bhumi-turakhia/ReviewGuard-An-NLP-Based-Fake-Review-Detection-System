/**
 * components/Navbar.jsx
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-sand shadow-warm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-espresso flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="#FAF7F2" strokeWidth="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            className="font-display text-lg font-semibold text-espresso tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ReviewGuard
          </span>
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive && location.pathname === '/' ? 'active' : ''}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/checker"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Analyze Review
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Analytics
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
