
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Plus,
  ArrowRight,
  QrCode,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const kpis = {
    totalItems: 847,
    totalValue: 245680,
    lowStockItems: 23,
    monthlyTurnover: 4.2
  };

  const lowStockItems = [
    { sku: "TOOL-001", name: "Cordless Drill", current: 2, minimum: 5, location: "Main Warehouse" },
    { sku: "PART-034", name: "Brake Pads", current: 1, minimum: 10, location: "Service Bay" },
    { sku: "SUPP-112", name: "Motor Oil 5W-30", current: 3, minimum: 8, location: "Storage Room" },
  ];

  const recentTransactions = [
    { id: 1, type: "Stock In", item: "Air Filter", qty: 20, time: "2 hours ago" },
    { id: 2, type: "Stock Out", item: "Spark Plugs", qty: -4, time: "3 hours ago" },
    { id: 3, type: "Adjustment", item: "Tire Pressure Gauge", qty: -1, time: "5 hours ago" },
  ];

  const upcomingMaintenance = [
    { asset: "Forklift #001", type: "Oil Change", due: "Tomorrow" },
    { asset: "Compressor Unit", type: "Filter Replacement", due: "3 days" },
    { asset: "Loading Dock #2", type: "Safety Inspection", due: "1 week" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your inventory overview.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/scanner">
              <QrCode className="w-4 h-4 mr-2" />
              Quick Scan
            </Link>
          </Button>
          <Button asChild>
            <Link to="/items">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Items</CardTitle>
            <Package className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{kpis.totalItems.toLocaleString()}</div>
            <p className="text-xs text-slate-600 mt-1">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ${kpis.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">+2.4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{kpis.lowStockItems}</div>
            <p className="text-xs text-slate-600 mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Turnover</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{kpis.monthlyTurnover}x</div>
            <p className="text-xs text-green-600 mt-1">+0.3x from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Low Stock Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/items?filter=low-stock">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-600">SKU: {item.sku} • {item.location}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="bg-orange-600">
                      {item.current}/{item.minimum}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/transactions">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={txn.type === "Stock In" ? "default" : txn.type === "Stock Out" ? "secondary" : "outline"}
                      className={
                        txn.type === "Stock In" ? "bg-green-100 text-green-800" :
                        txn.type === "Stock Out" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {txn.type}
                    </Badge>
                    <div>
                      <div className="font-medium text-slate-900">{txn.item}</div>
                      <div className="text-sm text-slate-600">Qty: {txn.qty > 0 ? '+' : ''}{txn.qty}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">{txn.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Asset Maintenance
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/maintenance">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMaintenance.map((item, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-medium text-slate-900">{item.asset}</div>
                <div className="text-sm text-slate-600 mt-1">{item.type}</div>
                <Badge variant="outline" className="mt-2 text-blue-700 border-blue-300">
                  Due {item.due}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
