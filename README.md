

# 📊 Telecom Churn Prediction - ChurnWise Insights

This project consists of a **FastAPI backend** and a **React frontend** for telecom customer churn prediction, AI-powered insights, and chatbot-based customer retention strategies.

---

## 🧱 Project Structure

```
Telecom-Churn-Prediction-with-churnwise-insights/
│
├── backend/                       # Backend FastAPI code
│   ├── main.py                    # Main API file
│   ├── .gitignore                 # Backend .gitignore
│   └── README.md                  # Backend setup instructions
│
├── churnwise-insights-main/      # Required data folder - MUST CREATE THIS
│   ├── users.csv                      # User data (auto-generated)
│   ├── Telco-Customer-Churn.csv      # REQUIRED: Customer data
│   ├── random_forest_best_model.pkl  # REQUIRED: ML model
│   └── customer_churn_store.json     # REQUIRED: Chatbot data
│
├── src/                          # Frontend React code
│   ├── components/               # Reusable UI components
│   ├── pages/                    # React route pages
│   ├── services/                 # API integration services
│   └── ...                       # Other frontend files
│
└── ... (other project files)
```

---

## 📁 Required Data Files

Place these files inside the `churnwise-insights-main/` folder in your project root:

- ✅ `Telco-Customer-Churn.csv`: Telecom customer dataset  
- ✅ `random_forest_best_model.pkl`: Pre-trained ML model for churn prediction  
- ✅ `customer_churn_store.json`: AI chatbot knowledge base  

---

## 🛠️ Setup Instructions

### 🔹 1. Backend Setup

```bash
# Navigate to backend folder
cd C:\Users\Sanjana\Downloads\churnwise-insights\churnwise-insights-main\backend

# Activate Python virtual environment
venv\Scripts\activate

# Install dependencies (only if not already installed)
pip install fastapi uvicorn pandas scikit-learn farm-haystack passlib python-multipart

# Run the backend server
uvicorn main:app
```

📌 The backend will be live at: **http://localhost:8000**

---

### 🔹 2. Frontend Setup

```bash
# Navigate to project root where package.json is located
cd C:\Users\Sanjana\Downloads\Telecom-Churn-Prediction-with-churnwise-insights

# Install Node.js dependencies
curl -fsSL https://bun.sh/install | bash

# Start the frontend development server
bunx vite
```

📌 The frontend will be live at: **http://localhost:8080**



## 🔗 Live Deployment

Your project is live at:

**🌍 [https://telecom-churn-prediction-with-ch-production-b5f3.up.railway.app](https://telecom-churn-prediction-with-ch-production-b5f3.up.railway.app)**

---

## 📘 API Documentation

- Swagger UI → [http://localhost:8000/docs](http://localhost:8000/docs)  
- Redoc Docs → [http://localhost:8000/redoc](http://localhost:8000/redoc)  
- Health Check → [http://localhost:8000/health](http://localhost:8000/health)

---

## 🚀 Deployment Guide (Railway)

To deploy on [Railway](https://railway.app):

1. Push the project to GitHub  
2. Create a new Railway project  
3. Add a service for:
   - Backend (FastAPI)
   - Frontend (React Vite)  
4. Set proper root folders for each service  
5. Deploy → Railway will provide a live URL like:

🔗 **[https://telecom-churn-prediction-with-ch-production-b5f3.up.railway.app](https://telecom-churn-prediction-with-ch-production-b5f3.up.railway.app)**

---

## ✅ Summary

| Part        | URL                                 |
|-------------|--------------------------------------|
| Backend API | http://localhost:8000                |
| Frontend    | http://localhost:8080                |
| Live App    | https://telecom-churn-prediction-with-ch-production-b5f3.up.railway.app |
| Swagger UI  | http://localhost:8000/docs           |

---

💡 Make sure all required files are present in `churnwise-insights-main/` before running the app.
```