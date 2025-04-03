
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/DashboardStats";
import { CustomerProfile } from "@/components/CustomerProfile";
import { ChurnPrediction } from "@/components/ChurnPrediction";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";

export function DashboardLayout() {
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <span className="text-xl font-bold">ChurnWise Insights</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-6">
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="customers">Customer Profiles</TabsTrigger>
              <TabsTrigger value="prediction">Churn Prediction</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of customer churn analytics and key metrics.
              </p>
              <DashboardStats />
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Customer Profiles</h2>
              <p className="text-muted-foreground">
                Search and view detailed customer information.
              </p>
              <CustomerProfile />
            </TabsContent>
            
            <TabsContent value="prediction" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Churn Prediction</h2>
              <p className="text-muted-foreground">
                Predict customer churn risk based on key factors.
              </p>
              <ChurnPrediction />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col gap-2 sm:flex-row items-center justify-between text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; 2023 ChurnWise Insights. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by FastAPI and React
          </p>
        </div>
      </footer>

      {/* Floating Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-96 z-50 shadow-xl">
          <div className="bg-background border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-medium">Customer Support Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowChatbot(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-96">
              <Chatbot />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
