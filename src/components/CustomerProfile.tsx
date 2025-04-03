
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCustomerProfile } from "@/components/DashboardService";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Search, User, Phone, Wifi } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: boolean;
  icon: React.ReactNode;
}

export function CustomerProfile() {
  const [customerId, setCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!customerId.trim()) {
      toast({
        variant: "destructive",
        title: "Missing customer ID",
        description: "Please enter a customer ID to search",
      });
      return;
    }

    setIsLoading(true);

    try {
      const customerData = await getCustomerProfile(customerId);
      setCustomer(customerData);
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast({
        variant: "destructive",
        title: "Customer not found",
        description: "No customer record found with that ID",
      });
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Get service status data from customer
  const getServiceStatuses = (): ServiceStatus[] => {
    if (!customer) return [];

    return [
      {
        name: "Phone Service",
        status: customer.PhoneService === "Yes",
        icon: <Phone className="h-4 w-4" />,
      },
      {
        name: "Multiple Lines",
        status: customer.MultipleLines === "Yes",
        icon: <Phone className="h-4 w-4" />,
      },
      {
        name: "Internet Service",
        status: customer.InternetService !== "No",
        icon: <Wifi className="h-4 w-4" />,
      },
      {
        name: "Online Security",
        status: customer.OnlineSecurity === "Yes",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        name: "Online Backup",
        status: customer.OnlineBackup === "Yes",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        name: "Device Protection",
        status: customer.DeviceProtection === "Yes",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        name: "Tech Support",
        status: customer.TechSupport === "Yes",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        name: "Streaming TV",
        status: customer.StreamingTV === "Yes",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        name: "Streaming Movies",
        status: customer.StreamingMovies === "Yes",
        icon: <CheckCircle className="h-4 w-4" />,
      }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-2 mb-6">
          <div className="flex-1 space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              placeholder="Enter customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : <Search className="mr-2 h-4 w-4" />}
            {isLoading ? "" : "Search"}
          </Button>
        </div>

        {customer ? (
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <User className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Customer ID</div>
                    <div className="font-medium">{customer.customerID}</div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Gender</div>
                    <div className="font-medium">{customer.gender}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Tenure</div>
                    <div className="font-medium">{customer.tenure} months</div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Contract</div>
                    <div className="font-medium">{customer.Contract}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Monthly Charges</div>
                    <div className="font-medium">${customer.MonthlyCharges}</div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Total Charges</div>
                    <div className="font-medium">${customer.TotalCharges}</div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="text-sm text-muted-foreground">Churn Status</div>
                  <div className="flex items-center mt-1">
                    {customer.Churn === "Yes" ? (
                      <>
                        <div className="flex items-center mr-2 text-red-500">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">Churned</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Customer has left the service
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mr-2 text-green-500">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">Active</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Customer is currently subscribed
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getServiceStatuses().map((service, index) => (
                  <div key={index} className="flex items-center border p-3 rounded-md">
                    <div className="mr-3">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{service.name}</div>
                    </div>
                    <div>
                      {service.status ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium mb-1">No customer selected</h3>
            <p className="text-sm">Enter a customer ID and click search to view their profile</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
