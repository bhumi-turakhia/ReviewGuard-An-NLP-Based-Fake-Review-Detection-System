/**
 * server.js
 * Main Express server entry point
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5010;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api', reviewRoutes);

// Health check (optional but useful)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    detail: err.message
  });
});

// ─── Database + Server Start ──────────────────────────────────
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected:', process.env.MONGO_URI);
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed:', err.message);
    console.warn('Server will run without DB');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`API:     http://localhost:${PORT}/api/health`);
    console.log(`Predict: http://localhost:${PORT}/api/predict`);
    console.log(`Stats:   http://localhost:${PORT}/api/stats\n`);
  });
}

startServer();