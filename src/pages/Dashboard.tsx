import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
];

const quickStats = [
  { label: "Total Sales", value: "R$ 45,231" },
  { label: "Products", value: "124" },
  { label: "Customers", value: "48" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;