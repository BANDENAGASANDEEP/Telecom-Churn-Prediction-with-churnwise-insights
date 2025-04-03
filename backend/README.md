
# ChurnWise Insights Backend

This is the backend API for the ChurnWise Insights application. It provides endpoints for user authentication, churn prediction, business analytics, and an AI chatbot.

## Required Data Files

Before running the backend, you MUST place the following files in the `churnwise-insights-main` folder (at the root of the project, not inside the backend folder):

1. **Telco-Customer-Churn.csv**: Dataset with telecom customer information
2. **random_forest_best_model.pkl**: Pre-trained machine learning model for churn prediction
3. **customer_churn_store.json**: Document store for the AI chatbot

Without these files, the application will not start.

## Setup Instructions

### 1. Create the required data folder
```bash
mkdir -p churnwise-insights-main
```

### 2. Place the required data files in the churnwise-insights-main folder
- Telco-Customer-Churn.csv
- random_forest_best_model.pkl
- customer_churn_store.json

### 3. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

### 4. Install dependencies
```bash
pip install fastapi uvicorn pandas scikit-learn farm-haystack passlib python-multipart
```

### 5. Start the backend server
```bash
python main.py
```

The API will be available at http://localhost:8000

## API Documentation
- API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

## API Endpoints

### Authentication
- POST `/register` - Register a new user
- POST `/token` - Login and get access token

### Churn Prediction
- POST `/predict` - Predict churn for given customer features

### Business Analytics
- GET `/dashboard-data` - Get summary statistics and churn distribution

### Customer Profiles
- GET `/customer-profile?customer_id=<id>` - Get detailed customer information

### AI Chatbot
- GET `/chat?query=<text>` - Get AI responses to customer service queries
