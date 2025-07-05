
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Package,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Items = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - in real app this would come from API
  const items = [
    {
      id: 1,
      sku: "TOOL-001",
      name: "Cordless Drill 18V",
      barcode: "1234567890123",
      category: "Power Tools",
      quantity: 15,
      minStock: 5,
      maxStock: 50,
      location: "Main Warehouse",
      cost: 89.99,
      retailPrice: 149.99,
      supplier: "Tool Supply Co",
      status: "in-stock"
    },
    {
      id: 2,
      sku: "PART-034",
      name: "Brake Pads Premium",
      barcode: "2345678901234",
      category: "Auto Parts",
      quantity: 1,
      minStock: 10,
      maxStock: 100,
      location: "Service Bay",
      cost: 45.50,
      retailPrice: 89.99,
      supplier: "Auto Parts Plus",
      status: "low-stock"
    },
    {
      id: 3,
      sku: "SUPP-112",
      name: "Motor Oil 5W-30",
      barcode: "3456789012345",
      category: "Supplies",
      quantity: 24,
      minStock: 8,
      maxStock: 60,
      location: "Storage Room",
      cost: 12.99,
      retailPrice: 24.99,
      supplier: "Oil Depot",
      status: "in-stock"
    },
    {
      id: 4,
      sku: "ELEC-089",
      name: "LED Work Light",
      barcode: "4567890123456",
      category: "Lighting",
      quantity: 0,
      minStock: 3,
      maxStock: 25,
      location: "Main Warehouse",
      cost: 25.00,
      retailPrice: 45.99,
      supplier: "Electric Supply",
      status: "out-of-stock"
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const getStatusBadge = (status: string, quantity: number, minStock: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= minStock) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Low Stock</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "out-of-stock":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "low-stock":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Items</h1>
          <p className="text-slate-600 mt-1">Manage your inventory catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{items.length}</div>
                <div className="text-sm text-slate-600">Total Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {items.filter(i => i.status === "in-stock").length}
                </div>
                <div className="text-sm text-slate-600">In Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {items.filter(i => i.status === "low-stock").length}
                </div>
                <div className="text-sm text-slate-600">Low Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {items.filter(i => i.status === "out-of-stock").length}
                </div>
                <div className="text-sm text-slate-600">Out of Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search items by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All Items
              </Button>
              <Button
                variant={filterStatus === "low-stock" ? "default" : "outline"}
                onClick={() => setFilterStatus("low-stock")}
                size="sm"
              >
                Low Stock
              </Button>
              <Button
                variant={filterStatus === "out-of-stock" ? "default" : "outline"}
                onClick={() => setFilterStatus("out-of-stock")}
                size="sm"
              >
                Out of Stock
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Retail</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <div className="text-sm text-slate-600">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-sm text-slate-900">{item.sku}</div>
                      <div className="text-xs text-slate-500">{item.barcode}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{item.location}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{item.quantity}</div>
                      <div className="text-xs text-slate-500">Min: {item.minStock}</div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(item.status, item.quantity, item.minStock)}
                    </td>
                    <td className="py-4 px-4 text-slate-700">${item.cost}</td>
                    <td className="py-4 px-4 text-slate-700">${item.retailPrice}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
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

export default Items;
