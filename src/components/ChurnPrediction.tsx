import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { predictChurn } from "@/components/DashboardService";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function ChurnPrediction() {
  const [formData, setFormData] = useState({
    SeniorCitizen: "",
    Partner: "",
    Dependents: "",
    tenure: "",
    InternetService: "",
    OnlineSecurity: "",
    OnlineBackup: "",
    DeviceProtection: "",
    TechSupport: "",
    StreamingTV: "",
    StreamingMovies: "",
    Contract: "",
    PaperlessBilling: "",
    PaymentMethod: "",
    MonthlyCharges: "",
    TotalCharges: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [churnRisk, setChurnRisk] = useState<number | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      SeniorCitizen,
      Partner,
      Dependents,
      tenure,
      InternetService,
      OnlineSecurity,
      OnlineBackup,
      DeviceProtection,
      TechSupport,
      StreamingTV,
      StreamingMovies,
      Contract,
      PaperlessBilling,
      PaymentMethod,
      MonthlyCharges,
      TotalCharges,
    } = formData;

    if (
      !SeniorCitizen ||
      !Partner ||
      !Dependents ||
      !tenure ||
      !InternetService ||
      !OnlineSecurity ||
      !OnlineBackup ||
      !DeviceProtection ||
      !TechSupport ||
      !StreamingTV ||
      !StreamingMovies ||
      !Contract ||
      !PaperlessBilling ||
      !PaymentMethod ||
      !MonthlyCharges ||
      !TotalCharges
    ) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields to predict churn risk",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formattedData = {
        SeniorCitizen_No: SeniorCitizen === "No" ? 1 : 0,
        SeniorCitizen_Yes: SeniorCitizen === "Yes" ? 1 : 0,
        Partner_No: Partner === "No" ? 1 : 0,
        Partner_Yes: Partner === "Yes" ? 1 : 0,
        Dependents_No: Dependents === "No" ? 1 : 0,
        Dependents_Yes: Dependents === "Yes" ? 1 : 0,
        InternetService_DSL: InternetService === "DSL" ? 1 : 0,
        InternetService_Fiber: InternetService === "Fiber optic" ? 1 : 0,
        InternetService_No: InternetService === "No" ? 1 : 0,
        OnlineSecurity_No: OnlineSecurity === "No" ? 1 : 0,
        OnlineSecurity_NoInternetService: InternetService === "No" ? 1 : 0,
        OnlineSecurity_Yes: OnlineSecurity === "Yes" ? 1 : 0,
        OnlineBackup_No: OnlineBackup === "No" ? 1 : 0,
        OnlineBackup_NoInternetService: InternetService === "No" ? 1 : 0,
        OnlineBackup_Yes: OnlineBackup === "Yes" ? 1 : 0,
        DeviceProtection_No: DeviceProtection === "No" ? 1 : 0,
        DeviceProtection_NoInternetService: InternetService === "No" ? 1 : 0,
        DeviceProtection_Yes: DeviceProtection === "Yes" ? 1 : 0,
        TechSupport_No: TechSupport === "No" ? 1 : 0,
        TechSupport_NoInternetService: InternetService === "No" ? 1 : 0,
        TechSupport_Yes: TechSupport === "Yes" ? 1 : 0,
        StreamingTV_No: StreamingTV === "No" ? 1 : 0,
        StreamingTV_NoInternetService: InternetService === "No" ? 1 : 0,
        StreamingTV_Yes: StreamingTV === "Yes" ? 1 : 0,
        StreamingMovies_No: StreamingMovies === "No" ? 1 : 0,
        StreamingMovies_NoInternetService: InternetService === "No" ? 1 : 0,
        StreamingMovies_Yes: StreamingMovies === "Yes" ? 1 : 0,
        Contract_MonthToMonth: Contract === "Month-to-month" ? 1 : 0,
        Contract_OneYear: Contract === "One year" ? 1 : 0,
        Contract_TwoYear: Contract === "Two year" ? 1 : 0,
        PaperlessBilling_No: PaperlessBilling === "No" ? 1 : 0,
        PaperlessBilling_Yes: PaperlessBilling === "Yes" ? 1 : 0,
        PaymentMethod_BankTransfer: PaymentMethod === "Bank transfer (automatic)" ? 1 : 0,
        PaymentMethod_CreditCard: PaymentMethod === "Credit card (automatic)" ? 1 : 0,
        PaymentMethod_ElectronicCheck: PaymentMethod === "Electronic check" ? 1 : 0,
        PaymentMethod_MailedCheck: PaymentMethod === "Mailed check" ? 1 : 0,
        tenure: Number(tenure),
        MonthlyCharges: Number(MonthlyCharges),
        TotalCharges: Number(TotalCharges),
      };

      const result = await predictChurn(formattedData);
      setPrediction(result.churn_prediction);
      setChurnRisk(result.churn_probability);
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: "Unable to predict churn risk. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Churn Risk Prediction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="SeniorCitizen">Senior Citizen</Label>
              <Select id="SeniorCitizen" onValueChange={(value) => setFormData({ ...formData, SeniorCitizen: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="Partner">Partner</Label>
              <Select id="Partner" onValueChange={(value) => setFormData({ ...formData, Partner: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="Dependents">Dependents</Label>
              <Select id="Dependents" onValueChange={(value) => setFormData({ ...formData, Dependents: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tenure">Tenure (months)</Label>
              <Input type="number" id="tenure" value={formData.tenure} onChange={handleChange} placeholder="Number of months the customer has stayed" />
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="InternetService">Internet Service</Label>
              <Select id="InternetService" onValueChange={(value) => setFormData({ ...formData, InternetService: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DSL">DSL</SelectItem>
                  <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="OnlineSecurity">Online Security</Label>
              <Select id="OnlineSecurity" onValueChange={(value) => setFormData({ ...formData, OnlineSecurity: value })} disabled={formData.InternetService === "No"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="OnlineBackup">Online Backup</Label>
              <Select id="OnlineBackup" onValueChange={(value) => setFormData({ ...formData, OnlineBackup: value })} disabled={formData.InternetService === "No"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="DeviceProtection">Device Protection</Label>
              <Select id="DeviceProtection" onValueChange={(value) => setFormData({ ...formData, DeviceProtection: value })} disabled={formData.InternetService === "No"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="TechSupport">Tech Support</Label>
              <Select id="TechSupport" onValueChange={(value) => setFormData({ ...formData, TechSupport: value })} disabled={formData.InternetService === "No"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="StreamingTV">Streaming TV</Label>
              <Select id="StreamingTV" onValueChange={(value) => setFormData({ ...formData, StreamingTV: value })} disabled={formData.InternetService === "No"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="StreamingMovies">Streaming Movies</Label>
              <Select id="StreamingMovies" onValueChange={(value) => setFormData({ ...formData, StreamingMovies: value })} disabled={formData.InternetService === "No"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Contract">Contract Type</Label>
              <Select id="Contract" onValueChange={(value) => setFormData({ ...formData, Contract: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                  <SelectItem value="One year">One year</SelectItem>
                  <SelectItem value="Two year">Two year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="PaperlessBilling">Paperless Billing</Label>
              <Select id="PaperlessBilling" onValueChange={(value) => setFormData({ ...formData, PaperlessBilling: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="PaymentMethod">Payment Method</Label>
              <Select id="PaymentMethod" onValueChange={(value) => setFormData({ ...formData, PaymentMethod: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank transfer (automatic)">Bank transfer (automatic)</SelectItem>
                  <SelectItem value="Credit card (automatic)">Credit card (automatic)</SelectItem>
                  <SelectItem value="Electronic check">Electronic check</SelectItem>
                  <SelectItem value="Mailed check">Mailed check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="MonthlyCharges">Monthly Charges</Label>
              <Input type="number" id="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} placeholder="Amount charged monthly" />
            </div>
            <div>
              <Label htmlFor="TotalCharges">Total Charges</Label>
              <Input type="number" id="TotalCharges" value={formData.TotalCharges} onChange={handleChange} placeholder="Total amount charged to the customer" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Calculating..." : "Predict Churn Risk"}
          </Button>
        </form>

        {prediction !== null && (
          <div className="mt-6">
            <div className="rounded-lg p-4 flex items-center justify-between border mb-4">
              <div className="font-semibold">Churn Prediction</div>
              <div
                className={`px-3 py-1 rounded-full font-medium flex items-center ${
                  prediction === 1 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                }`}
              >
                {prediction === 1 ? (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                )}
                {prediction === 1 ? "Yes (Churn)" : "No (No Churn)"}
              </div>
              {churnRisk !== null && (
                <div className="text-sm text-gray-500 ml-4">
                  Probability: {churnRisk}%
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}