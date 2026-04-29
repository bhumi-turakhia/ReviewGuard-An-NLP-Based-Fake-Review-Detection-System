/**
 * models/Review.js
 * ─────────────────
 * Mongoose schema for storing review predictions.
 */

const mongoose = require('mongoose');

const FlagSchema = new mongoose.Schema({
  type: { type: String, enum: ['warning', 'success'] },
  label: String,
  detail: String
}, { _id: false });

const ExplanationSchema = new mongoose.Schema({
  flags: [FlagSchema],
  reasons: [String],
  confidence_label: String,
  text_stats: {
    word_count: Number,
    exclamation_marks: Number,
    caps_percentage: Number,
    extreme_words: Number,
    avg_word_length: Number
  }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  // Input
  original_text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  processed_text: {
    type: String,
    default: ''
  },
  model_used: {
    type: String,
    enum: ['lr', 'nb'],
    default: 'lr'
  },
  
  // Prediction
  prediction: {
    type: Number,    // 0 = Genuine, 1 = Fake
    required: true,
    enum: [0, 1]
  },
  label: {
    type: String,
    enum: ['FAKE', 'GENUINE'],
    required: true
  },
  confidence: {
    type: Number,    // percentage (0–100)
    required: true
  },
  fake_probability: Number,
  genuine_probability: Number,
  
  // Explanation
  explanation: ExplanationSchema,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast queries
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ label: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
