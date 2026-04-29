/**
 * controllers/reviewController.js
 * ─────────────────────────────────
 * Handles POST /api/predict and GET /api/stats
 */

const Review = require('../models/Review');
const { runPython } = require('../utils/pythonRunner');

// ─── POST /api/predict ────────────────────────────────────────────────────────
exports.predict = async (req, res) => {
  try {
    const { text, model = 'lr' } = req.body;
    
    // Validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Review text is required.' });
    }
    const trimmed = text.trim();
    if (trimmed.length < 5) {
      return res.status(400).json({ error: 'Review is too short. Please enter at least 5 characters.' });
    }
    if (trimmed.length > 5000) {
      return res.status(400).json({ error: 'Review is too long. Maximum 5000 characters allowed.' });
    }
    if (!['lr', 'nb'].includes(model)) {
      return res.status(400).json({ error: 'Invalid model. Use "lr" or "nb".' });
    }
    
    // Call Python ML script
    console.log(`🔍 Predicting review (model: ${model}): "${trimmed.substring(0, 60)}..."`);
    const pyResult = await runPython('predict.py', { text: trimmed, model });
    
    // Save to MongoDB
    const review = new Review({
      original_text: trimmed,
      processed_text: pyResult.processed_text || '',
      model_used: model,
      prediction: pyResult.prediction,
      label: pyResult.label,
      confidence: pyResult.confidence,
      fake_probability: pyResult.fake_probability,
      genuine_probability: pyResult.genuine_probability,
      explanation: pyResult.explanation
    });
    
    await review.save();
    console.log(`✅ Saved prediction: ${pyResult.label} (${pyResult.confidence}%)`);
    
    return res.status(200).json({
      success: true,
      data: {
        id: review._id,
        label: pyResult.label,
        prediction: pyResult.prediction,
        confidence: pyResult.confidence,
        fake_probability: pyResult.fake_probability,
        genuine_probability: pyResult.genuine_probability,
        model_used: pyResult.model_used,
        explanation: pyResult.explanation,
        timestamp: review.createdAt
      }
    });
    
  } catch (err) {
    console.error('❌ Prediction error:', err.message);
    
    if (err.message.includes('Python')) {
      return res.status(500).json({
        error: 'ML model unavailable. Please ensure Python and the trained model are set up correctly.',
        detail: err.message
      });
    }
    
    return res.status(500).json({ error: 'Internal server error.', detail: err.message });
  }
};

// ─── GET /api/stats ────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    // Get model performance stats from Python
    const modelStats = await runPython('get_stats.py', {});
    
    // Get database stats
    const totalReviews = await Review.countDocuments();
    const fakeCount = await Review.countDocuments({ label: 'FAKE' });
    const genuineCount = await Review.countDocuments({ label: 'GENUINE' });
    
    // Recent predictions (last 10)
    const recentPredictions = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('label confidence original_text createdAt model_used -_id');
    
    // Daily counts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Review.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            label: "$label"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        model_performance: {
          logistic_regression: {
            accuracy: modelStats.lr_accuracy,
            precision: modelStats.lr_precision,
            recall: modelStats.lr_recall,
            f1: modelStats.lr_f1,
            auc: modelStats.auc_lr,
            confusion_matrix: modelStats.lr_confusion_matrix
          },
          naive_bayes: {
            accuracy: modelStats.nb_accuracy,
            precision: modelStats.nb_precision,
            recall: modelStats.nb_recall,
            f1: modelStats.nb_f1,
            auc: modelStats.auc_nb,
            confusion_matrix: modelStats.nb_confusion_matrix
          }
        },
        dataset: {
          total: modelStats.total_samples,
          genuine: modelStats.genuine_count,
          fake: modelStats.fake_count
        },
        fake_indicators: modelStats.fake_indicators?.slice(0, 10) || [],
        genuine_indicators: modelStats.genuine_indicators?.slice(0, 10) || [],
        live_stats: {
          total_analyzed: totalReviews,
          fake_detected: fakeCount,
          genuine_detected: genuineCount
        },
        recent_predictions: recentPredictions,
        daily_stats: dailyStats
      }
    });
    
  } catch (err) {
    console.error('❌ Stats error:', err.message);
    return res.status(500).json({ error: 'Could not fetch stats.', detail: err.message });
  }
};

// ─── GET /api/history ─────────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('label confidence original_text createdAt model_used');
    
    const total = await Review.countDocuments();
    
    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Could not fetch history.' });
  }
};
