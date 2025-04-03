from fastapi import FastAPI, HTTPException, Query, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
import pandas as pd
import joblib
import json
import os
import logging
from sklearn.ensemble import RandomForestClassifier
from haystack.document_stores import InMemoryDocumentStore
from haystack.nodes import BM25Retriever
from haystack.schema import Document
from pydantic import BaseModel
from typing import Dict
import uvicorn

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Initialize FastAPI app
app = FastAPI(title="ChurnWise Insights API", description="API for telecom customer churn prediction and chatbot")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..")

users_csv_path = os.path.join(DATA_DIR, "users.csv")
churn_csv_path = os.path.join(DATA_DIR, "Telco-Customer-Churn.csv")
rf_model_path = os.path.join(DATA_DIR, "random_forest_best_model.joblib")
churn_store_path = os.path.join(DATA_DIR, "customer_churn_store.json")

# --- Data Loading Functions ---
def load_users():
    try:
        if os.path.exists(users_csv_path):
            logging.info(f"Loaded users data from {users_csv_path}")
            return pd.read_csv(users_csv_path)
        df = pd.DataFrame(columns=["email", "password"])
        df.to_csv(users_csv_path, index=False)
        return df
    except Exception as e:
        logging.error(f"Error loading users file: {str(e)}", exc_info=True)
        return pd.DataFrame(columns=["email", "password"])

def load_churn_data():
    try:
        if os.path.exists(churn_csv_path):
            churn_data = pd.read_csv(churn_csv_path)
            logging.info(f"Loaded telecom churn data from {churn_csv_path}")

            # Check for missing values and handle them
            if churn_data.isnull().any().any():
                logging.warning("Missing values found in churn data. Handling them.")
                churn_data = churn_data.dropna()  # or use another strategy like fillna() if needed

            return churn_data
        else:
            raise FileNotFoundError(f"Required file not found: {churn_csv_path}. Please place it in the churnwise-insights-main folder.")
    except Exception as e:
        logging.error(f"Error loading churn data: {str(e)}", exc_info=True)
        raise FileNotFoundError("Error loading churn data.")

def load_model():
    try:
        if os.path.exists(rf_model_path):
            model = joblib.load(rf_model_path)
            if isinstance(model, RandomForestClassifier):
                logging.info(f"Loaded RandomForest model from {rf_model_path}")
                return model, list(model.feature_names_in_)
    except Exception as e:
        logging.error(f"Error loading model: {str(e)}", exc_info=True)
    return None, None

def load_chatbot_data():
    try:
        if os.path.exists(churn_store_path):
            with open(churn_store_path, "r") as f:
                logging.info(f"Loaded chatbot data from {churn_store_path}")
                return [Document.from_dict(doc) for doc in json.load(f)]
    except Exception as e:
        logging.error(f"Error loading chatbot data: {str(e)}", exc_info=True)
    return []


# --- Initialize Data ---
churn_data = load_churn_data()
rf_model, model_features = load_model()
docs = load_chatbot_data()

# Initialize document store and retriever
document_store = InMemoryDocumentStore(use_bm25=True)
document_store.write_documents(docs)
retriever = BM25Retriever(document_store=document_store, top_k=1)  # Get only the best match

# Security Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Pydantic Models ---
class User(BaseModel):
    email: str
    password: str

class ChurnInput(BaseModel):
    features: Dict[str, float]

# Request model
class ChatQuery(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

# --- API Endpoints ---
@app.post("/register")
async def register(user: User):
    try:
        users_df = load_users()
        if user.email in users_df["email"].values:
            raise HTTPException(status_code=400, detail="Email already exists")

        new_user = pd.DataFrame({
            "email": [user.email],
            "password": [pwd_context.hash(user.password)]
        })
        new_user.to_csv(users_csv_path, mode="a", header=False, index=False)
        return {"message": "User registered successfully"}
    except Exception as e:
        logging.error(f"Error in registration: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        users_df = load_users()
        user_row = users_df[users_df["email"] == form_data.username]

        if user_row.empty or not pwd_context.verify(form_data.password, user_row.iloc[0]["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"access_token": form_data.username, "token_type": "bearer"}
    except Exception as e:
        logging.error(f"Error during login: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/predict")
async def predict_churn(input_data: ChurnInput, token: str = Depends(oauth2_scheme)):
    logging.info(f"Prediction request received")
    try:
        if not rf_model:
            raise HTTPException(status_code=500, detail="Model not loaded")

        # Log received features for debugging
        logging.info(f"Received features: {input_data.features}")

        # Ensure all expected features are present, defaulting to 0 if missing
        input_dict = {feature: input_data.features.get(feature, 0) for feature in model_features}

        # Log the processed input dictionary
        logging.info(f"Processed input dictionary: {input_dict}")

        input_df = pd.DataFrame([input_dict], columns=model_features)

        # Log the DataFrame used for prediction
        logging.info(f"DataFrame for prediction:\n{input_df.to_dict(orient='records')}")

        prediction = rf_model.predict(input_df)[0]
        logging.info(f"Raw prediction: {prediction}")
        return {"churn_prediction": int(prediction)}
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Prediction error") 

 # Customer Profile API
@app.get("/customer-profile")
def get_customer_profile(customer_id: str):
    try:
        customer = churn_data[churn_data["customerID"] == customer_id]
        if customer.empty:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer.to_dict(orient="records")[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving customer profile: {str(e)}")

@app.get("/chat", response_model=ChatResponse)
async def chat(request: Request, query: str = Query(..., title="User Query")):
    try:
        query = query.strip()

        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")

        logging.info(f"Received chat query (GET): {query}")

        if retriever is None:
            logging.warning("Retriever not initialized.")
            return ChatResponse(response="Chat functionality is currently unavailable.")

        results = retriever.retrieve(query)

        if not results:
            return ChatResponse(response="I couldn't find relevant information about that.")

        # Access content using the .content attribute of the Document object
        return ChatResponse(response=results[0].content)

    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Chat error (GET): {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
        
# New Endpoint for Dashboard Data
@app.get("/dashboard-data")
async def get_dashboard_data():
    try:
        churn_data = load_churn_data()

        # Ensure 'Churn' column exists and process it
        if "Churn" not in churn_data.columns:
            logging.error("Missing 'Churn' column in dataset.")
            raise HTTPException(status_code=500, detail="Missing 'Churn' column in dataset.")

        churn_data["Churn"] = churn_data["Churn"].map({"Yes": 1, "No": 0}).fillna(0)

        # Explicitly check for required columns
        if "tenure" not in churn_data.columns:
            logging.error("Missing 'tenure' column in dataset.")
            raise HTTPException(status_code=500, detail="Missing 'tenure' column in dataset.")

        if "MonthlyCharges" not in churn_data.columns:
            logging.error("Missing 'MonthlyCharges' column in dataset.")
            raise HTTPException(status_code=500, detail="Missing 'MonthlyCharges' column in dataset.")

        # Handle missing values

        churn_data["tenure"] = pd.to_numeric(churn_data["tenure"], errors='coerce').fillna(0)
        churn_data["MonthlyCharges"] = pd.to_numeric(churn_data["MonthlyCharges"], errors='coerce').fillna(0)

        # Calculating churn distribution
        churn_counts = churn_data["Churn"].value_counts()
        churned_count = churn_counts.get(1, 0)
        retained_count = churn_counts.get(0, 0)

        # Calculating dashboard values
        dashboard_data = {
            "total_customers": int(len(churn_data)),  # Convert to int
            "churn_rate": churn_data["Churn"].mean(),
            "avg_tenure": churn_data["tenure"].mean(),
            "avg_monthly_charge": churn_data["MonthlyCharges"].mean(),
            "active_customers": int(retained_count),  # Convert to int
            "churn_distribution": {
                "Yes": int(churned_count),  # Convert to int
                "No": int(retained_count),   # Convert to int
            }
        }

        if not dashboard_data["total_customers"]:
            raise HTTPException(status_code=500, detail="No valid customers found in the data.")

        return dashboard_data

    except HTTPException as http_exc:
        return {"status": "error", "message": http_exc.detail}
    except Exception as e:
        logging.error(f"Error fetching dashboard data: {str(e)}", exc_info=True)
        return {"status": "error", "message": "Error fetching dashboard data. Please try again later."}


@app.get("/health")
async def health_check():
    if rf_model is None:
        return {"status": "down", "reason": "Model is not loaded"}
    return {"status": "up"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
