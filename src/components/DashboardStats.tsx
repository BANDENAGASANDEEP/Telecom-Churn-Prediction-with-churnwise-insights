import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/components/DashboardService";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, UserMinus, TrendingUp, DollarSign } from "lucide-react";

// Type definitions for better type safety
interface DashboardData {
  total_customers?: number;
  churn_rate?: number | { Yes: number; No: number };
  avg_tenure?: number;
  avg_monthly_charge?: number;
  churn_distribution?: { Yes?: number; No?: number };
  churn_trend?: Array<{ month: string; churnRate: number }>;
  churn_reasons?: Array<{ reason: string; percentage: number }>;
}

// Helper component for consistent data display
const DisplayData = ({
  value,
  format = 'default',
  unit = '',
  loading = false
}: {
  value?: number | null;
  format?: 'percent' | 'decimal' | 'round' | 'currency' | 'default';
  unit?: string;
  loading?: boolean;
}) => {
  if (loading) return <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>;
  if (value === undefined || value === null) return <span>Data not available</span>;

  let displayValue = value;
  if (format === 'percent') displayValue = Number((value * 100).toFixed(1));
  if (format === 'decimal') displayValue = Number(value.toFixed(2));
  if (format === 'round') displayValue = Math.round(value);

  return (
    <span>
      {format === 'currency' && '$'}
      {displayValue}
      {unit && ` ${unit}`}
    </span>
  );
};

// Isolated Churn Distribution Chart Component
function ChurnDistributionChart({ dashboardData, isLoading }: { dashboardData: DashboardData | null; isLoading: boolean }) {
  // Prepare data for churn distribution chart
  const prepareChurnDistribution = () => {
    if (!dashboardData?.churn_distribution) return [];

    return [
      { name: "Retained", value: dashboardData.churn_distribution["No"] || 0 },
      { name: "Churned", value: dashboardData.churn_distribution["Yes"] || 0 },
    ];
  };

  // Colors for pie chart
  const COLORS = ["#0088FE", "#FF8042"];
  const preparedData = prepareChurnDistribution();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="h-16 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          {preparedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={preparedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {preparedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <span>Data not available</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        console.log("Dashboard Data:", data); // Inspect the fetched data
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err as Error);
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: "Please check your connection and try again",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Determine churn rate value based on data structure
  const churnRateValue = () => {
    if (dashboardData?.churn_rate) {
      if (typeof dashboardData.churn_rate === 'number') {
        return dashboardData.churn_rate;
      } else if (typeof dashboardData.churn_rate === 'object' && dashboardData.churn_rate.Yes !== undefined && dashboardData.churn_rate.No !== undefined) {
        return dashboardData.churn_rate.Yes / (dashboardData.churn_rate.Yes + dashboardData.churn_rate.No);
      }
    }
    return null;
  };

  // Monthly churn trend data (fetched from API or server)
  const churnTrendData = dashboardData?.churn_trend || [
    { month: "Jan", churnRate: 5.2 },
    { month: "Feb", churnRate: 5.8 },
    { month: "Mar", churnRate: 5.4 },
    { month: "Apr", churnRate: 5.9 },
    { month: "May", churnRate: 5.7 },
    { month: "Jun", churnRate: 6.1 },
    { month: "Jul", churnRate: 5.6 },
    { month: "Aug", churnRate: 5.3 },
    { month: "Sep", churnRate: 4.9 },
    { month: "Oct", churnRate: 4.8 },
    { month: "Nov", churnRate: 4.6 },
    { month: "Dec", churnRate: 4.5 },
  ];

  // Churn reasons data (fetched from API or server)
  const churnReasonsData = dashboardData?.churn_reasons || [
    { reason: "Price", percentage: 38 },
    { reason: "Competitor", percentage: 25 },
    { reason: "Service Quality", percentage: 15 },
    { reason: "Coverage", percentage: 12 },
    { reason: "Moving", percentage: 7 },
    { reason: "Other", percentage: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h3 className="text-2xl font-bold mt-1">
                  <DisplayData
                    value={dashboardData?.total_customers}
                    format="round"
                    loading={isLoading}
                  />
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                <h3 className="text-2xl font-bold mt-1">
                  <DisplayData
                    value={churnRateValue()}
                    format="percent"
                    unit="%"
                    loading={isLoading}
                  />
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <UserMinus className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Tenure</p>
                <h3 className="text-2xl font-bold mt-1">
                  <DisplayData
                    value={dashboardData?.avg_tenure}
                    format="round"
                    unit="mo"
                    loading={isLoading}
                  />
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Monthly Charge</p>
                <h3 className="text-2xl font-bold mt-1">
                  <DisplayData
                    value={dashboardData?.avg_monthly_charge}
                    format="currency"
                    loading={isLoading}
                  />
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Churn Distribution */}
        <ChurnDistributionChart dashboardData={dashboardData} isLoading={isLoading} />

        {/* Churn Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Churn Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[4, 7]}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Churn Rate"]} />
                  <Line
                    type="monotone"
                    dataKey="churnRate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Churn Reasons */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Churn Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnReasonsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="reason" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Bar
                    dataKey="percentage"
                    fill="#8884d8"
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  >
                    {(churnReasonsData || []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#ef4444"
                            : index === 1
                              ? "#f97316"
                              : index === 2
                                ? "#eab308"
                                : index === 3
                                  ? "#10b981"
                                  : index === 4
                                    ? "#3b82f6"
                                    : "#8b5cf6"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}