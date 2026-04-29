# ReviewGuard — AI-Based Fake Review Detection System

> Academic project for Artificial Intelligence and Neural Network  
> Computer Engineering, Shah & Anchor Kutchhi Engineering College, 2025–26  
> Team: Shaunak Menon (TY09-04), Harsh Solanki (TY09-12), Bhumi Turakhia (TY09-15)

---

## 📁 Project Structure

```
fake-review-detector/
├── frontend/                    # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Checker.jsx
│   │   │   └── Analytics.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # Node.js + Express
│   ├── controllers/
│   │   └── reviewController.js
│   ├── models/
│   │   └── Review.js
│   ├── routes/
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   └── pythonRunner.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── ml-model/                    # Python ML scripts
    ├── train_model.py           # Run ONCE to train & save models
    ├── predict.py               # Called by backend for predictions
    ├── get_stats.py             # Called by backend for stats
    └── requirements.txt
```

---

## ⚙️ Prerequisites

| Tool        | Version  | Download |
|-------------|----------|----------|
| Node.js     | ≥ 18.x   | https://nodejs.org |
| Python      | ≥ 3.9    | https://python.org |
| MongoDB     | ≥ 6.x    | https://mongodb.com/try/download/community |

---

## 🚀 Setup Instructions (VS Code)

### Step 1 — Open the project in VS Code

```
File → Open Folder → select fake-review-detector/
```

Open an **integrated terminal** with: `` Ctrl + ` ``

---

### Step 2 — Set up the Python ML Model

Open a terminal and run:

```bash
cd ml-model

# Create a virtual environment (recommended)
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (generates .pkl files — run ONCE)
python train_model.py
```

You should see output like:
```
✅ MongoDB connected / Generating synthetic training data...
📊 Dataset: 8000 reviews | Genuine: 4000 | Fake: 4000
🎯 Final Results:
   Logistic Regression Accuracy: 87.34%
   Naive Bayes Accuracy: 79.12%
✅ All models saved successfully!
```

---

### Step 3 — Set up the Backend

Open a **new terminal tab** (click `+` in VS Code terminal):

```bash
cd backend

# Install Node.js dependencies
npm install

# Configure environment (edit .env if needed)
# Default MONGO_URI: mongodb://localhost:27017/fake_review_detector
# Default PYTHON_PATH: python3  (use 'python' on Windows)
```

Edit `backend/.env` if needed:
- **Windows users**: change `PYTHON_PATH=python3` to `PYTHON_PATH=python`
- **MongoDB Atlas**: replace `MONGO_URI` with your Atlas connection string

---

### Step 4 — Set up the Frontend

Open a **new terminal tab**:

```bash
cd frontend

# Install Node.js dependencies
npm install
```

---

## ▶️ Running the Application

### Full Stack (React + Node + ML)
You need **3 terminals** running simultaneously.

### Terminal 1 — Start MongoDB (skip if using Atlas)
```bash
# Windows (if MongoDB is installed as a service, it may already be running)
mongod

# Mac (if installed via Homebrew)
brew services start mongodb-community
```

### Terminal 2 — Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected: mongodb://localhost:27017/fake_review_detector
🚀 Server running on http://localhost:5010
```

### Terminal 3 — Start Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x  ready in xxx ms
  ➜  Local: http://localhost:5173/
```

**Full stack URL:** http://localhost:5173

---

### Streamlit ML-Only Version (One Command)
```bash
cd streamlit
python3 -m venv venv
source venv/bin/activate  # venv\\Scripts\\activate on Windows
pip install -r requirements.txt
streamlit run app.py
```

**Streamlit URL:** http://localhost:8501

Open in browser to test fake review detection directly with ML models. 🎉

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `python3: command not found` | Change `PYTHON_PATH=python3` to `PYTHON_PATH=python` in `.env` |
| `MongoDB connection failed` | The server still works — predictions work without DB (no history saved) |
| `Model not trained yet` | Run `python train_model.py` in `ml-model/` folder first |
| `Port 5000 in use` | Change `PORT=5001` in `backend/.env` and update `vite.config.js` proxy target |
| `npm install` fails | Make sure Node.js ≥ 18 is installed |
| CORS errors | Make sure backend is running on port 5000 |

---

## 📡 API Reference

### `POST /api/predict`
Analyze a review text.

**Request:**
```json
{
  "text": "This product is absolutely amazing!!!",
  "model": "lr"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "label": "FAKE",
    "prediction": 1,
    "confidence": 91.4,
    "fake_probability": 91.4,
    "genuine_probability": 8.6,
    "model_used": "Logistic Regression",
    "explanation": {
      "flags": [...],
      "reasons": [...],
      "text_stats": {...}
    }
  }
}
```

### `GET /api/stats`
Get model performance statistics and dataset info.

### `GET /api/history`
Get history of past predictions from the database.

---

## 🎓 Team

| Name | Roll No |
|------|---------|
| Shaunak Menon | TY09-04 |
| Harsh Solanki | TY09-12 |
| Bhumi Turakhia | TY09-15 |
