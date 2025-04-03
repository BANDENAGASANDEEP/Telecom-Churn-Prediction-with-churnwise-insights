
# ChurnWise Insights Project

This project consists of a FastAPI backend and a React frontend for telecom customer churn prediction and analysis.

## Project Structure

```
ChurnWise-Insights/
│
├── backend/              # Backend FastAPI code
│   ├── main.py           # Main API file
│   ├── .gitignore        # Backend gitignore
│   └── README.md         # Backend setup instructions
│
├── churnwise-insights-main/  # Required data files - MUST CREATE THIS FOLDER
│   ├── users.csv             # User data (created automatically)
│   ├── Telco-Customer-Churn.csv  # REQUIRED: Telecom customer data
│   ├── random_forest_best_model.pkl  # REQUIRED: ML model
│   └── customer_churn_store.json  # REQUIRED: Chatbot document store
│
├── src/                 # Frontend React code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── ...              # Other frontend files
│
└── ... (other project files)
```

## Required Data Files

Before running the application, you MUST have the following files in place:

1. **Telco-Customer-Churn.csv**: Dataset with telecom customer information
2. **random_forest_best_model.pkl**: Pre-trained machine learning model for churn prediction
3. **customer_churn_store.json**: Document store for the AI chatbot

These files need to be placed in the `churnwise-insights-main` folder at the root of the project.

## Setup Instructions

### 1. Backend Setup

1. Create the required data folder:
```bash
mkdir -p churnwise-insights-main
```

2. Place the required data files in the `churnwise-insights-main` folder:
   - Telco-Customer-Churn.csv
   - random_forest_best_model.pkl
   - customer_churn_store.json

3. Set up Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

4. Install Python dependencies:
```bash
pip install fastapi uvicorn pandas scikit-learn farm-haystack passlib python-multipart
```

5. Start the backend server:
```bash
python main.py
```

The backend API will be running at: http://localhost:8000

### 2. Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Use the login page to sign in (register if needed)
3. Explore the dashboard with churn prediction and analytics features

## API Documentation

- API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/health
