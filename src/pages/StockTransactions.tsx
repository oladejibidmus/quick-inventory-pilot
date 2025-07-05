
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Download,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from "lucide-react";

const StockTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      type: "stock-in",
      item: "Cordless Drill 18V",
      sku: "TOOL-001",
      quantity: 20,
      location: "Main Warehouse",
      reason: "Purchase Order #PO-001",
      user: "John Doe",
      timestamp: "2024-01-15 10:30 AM",
      reference: "PO-001"
    },
    {
      id: 2,
      type: "stock-out",
      item: "Brake Pads Premium",
      sku: "PART-034",
      quantity: -4,
      location: "Service Bay",
      reason: "Sale #INV-2301",
      user: "Jane Smith",
      timestamp: "2024-01-15 09:15 AM",
      reference: "INV-2301"
    },
    {
      id: 3,
      type: "adjustment",
      item: "Motor Oil 5W-30",
      sku: "SUPP-112",
      quantity: -2,
      location: "Storage Room",
      reason: "Damaged goods",
      user: "Mike Johnson",
      timestamp: "2024-01-15 08:45 AM",
      reference: "ADJ-001"
    },
    {
      id: 4,
      type: "transfer",
      item: "LED Work Light",
      sku: "ELEC-089",
      quantity: 5,
      location: "Service Bay",
      reason: "Transfer from Main Warehouse",
      user: "Sarah Wilson",
      timestamp: "2024-01-14 04:20 PM",
      reference: "TRF-001"
    },
    {
      id: 5,
      type: "stock-in",
      item: "Tire Pressure Gauge",
      sku: "TOOL-045",
      quantity: 15,
      location: "Main Warehouse",
      reason: "Purchase Order #PO-002",
      user: "John Doe",
      timestamp: "2024-01-14 02:10 PM",
      reference: "PO-002"
    }
  ];

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && txn.type === filterType;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "stock-in":
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "stock-out":
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "adjustment":
        return <RotateCcw className="h-4 w-4 text-orange-600" />;
      case "transfer":
        return <ArrowUp className="h-4 w-4 text-blue-600" />;
      default:
        return <ArrowUp className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    const configs = {
      "stock-in": { variant: "default", className: "bg-green-100 text-green-800", label: "Stock In" },
      "stock-out": { variant: "secondary", className: "bg-red-100 text-red-800", label: "Stock Out" },
      "adjustment": { variant: "outline", className: "bg-orange-100 text-orange-800", label: "Adjustment" },
      "transfer": { variant: "outline", className: "bg-blue-100 text-blue-800", label: "Transfer" }
    };
    
    const config = configs[type] || configs["stock-in"];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getQuantityDisplay = (quantity: number, type: string) => {
    const isPositive = quantity > 0;
    const displayQty = Math.abs(quantity);
    
    return (
      <span className={`font-semibold ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? '+' : '-'}{displayQty}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stock Transactions</h1>
          <p className="text-slate-600 mt-1">Track all inventory movements and adjustments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {transactions.filter(t => t.type === "stock-in").length}
                </div>
                <div className="text-sm text-slate-600">Stock In</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowDown className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {transactions.filter(t => t.type === "stock-out").length}
                </div>
                <div className="text-sm text-slate-600">Stock Out</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {transactions.filter(t => t.type === "adjustment").length}
                </div>
                <div className="text-sm text-slate-600">Adjustments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {transactions.filter(t => t.type === "transfer").length}
                </div>
                <div className="text-sm text-slate-600">Transfers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === "stock-in" ? "default" : "outline"}
                onClick={() => setFilterType("stock-in")}
                size="sm"
              >
                Stock In
              </Button>
              <Button
                variant={filterType === "stock-out" ? "default" : "outline"}
                onClick={() => setFilterType("stock-out")}
                size="sm"
              >
                Stock Out
              </Button>
              <Button
                variant={filterType === "adjustment" ? "default" : "outline"}
                onClick={() => setFilterType("adjustment")}
                size="sm"
              >
                Adjustments
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(txn.type)}
                        {getTransactionBadge(txn.type)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{txn.item}</div>
                      <div className="text-sm font-mono text-slate-600">{txn.sku}</div>
                    </td>
                    <td className="py-4 px-4">
                      {getQuantityDisplay(txn.quantity, txn.type)}
                    </td>
                    <td className="py-4 px-4 text-slate-700">{txn.location}</td>
                    <td className="py-4 px-4 text-slate-700">{txn.reason}</td>
                    <td className="py-4 px-4 text-slate-700">{txn.user}</td>
                    <td className="py-4 px-4 text-slate-700">{txn.timestamp}</td>
                    <td className="py-4 px-4">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-800">
                        {txn.reference}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockTransactions;
