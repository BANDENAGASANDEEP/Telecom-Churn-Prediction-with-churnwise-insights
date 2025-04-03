
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [navigate]);

  // Don't render anything if not authenticated (will redirect)
  if (!authService.isAuthenticated()) {
    return null;
  }

  return <DashboardLayout />;
}
