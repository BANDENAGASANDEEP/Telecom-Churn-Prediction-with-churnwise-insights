import { churnService, chatbotService } from '@/services/api';

// Dashboard data interface
export interface DashboardData {
  total_customers: number;
  churn_rate: {
    Yes: number;
    No: number;
  };
  churn_distribution: {
    Yes: number;
    No: number;
  };
  churn_trend: Array<{ month: string; churnRate: number }>;
  churn_reasons: Array<{ reason: string; percentage: number }>;
  summary: {
    tenure: { mean: number };
    MonthlyCharges: { mean: number };
  };
}

// Customer profile interface
export interface CustomerProfile {
  customerID: string;
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: string;
}

// Churn prediction interface
export interface ChurnPrediction {
  churn_prediction: number;
}

// Chat response interface
export interface ChatResponse {
  response: string[];
}

// Get dashboard data
export const getDashboardData = async (): Promise<DashboardData | null> => {
  try {
    const response = await churnService.getDashboardData();
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};

// Get customer profile
export const getCustomerProfile = async (customerId: string): Promise<CustomerProfile | null> => {
  try {
    const response = await churnService.getCustomerProfile(customerId);
    console.log(`Customer ${customerId} Profile:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return null;
  }
};

// Predict churn
export const predictChurn = async (features: number[]): Promise<ChurnPrediction | null> => {
  try {
    const response = await churnService.predictChurn(features);
    console.log("Churn Prediction Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error predicting churn:', error);
    return null;
  }
};

// Send chat message
export const sendChatMessage = async (query: string): Promise<ChatResponse | null> => {
  try {
    const response = await chatbotService.sendMessage(query);
    console.log("Chatbot Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    return null;
  }
};
