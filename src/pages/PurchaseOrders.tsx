
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Download,
  Eye,
  Mail,
  Truck,
  Package,
  CheckCircle
} from "lucide-react";

interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplier: string;
  status: "draft" | "sent" | "partial" | "received" | "closed";
  totalAmount: number;
  currency: string;
  orderDate: string;
  expectedDate: string;
  items: POItem[];
}

interface POItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  received: number;
}

const PurchaseOrders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [showPODetailModal, setShowPODetailModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [newPO, setNewPO] = useState({
    supplier: "",
    expectedDate: "",
    items: [
      { name: "", sku: "", quantity: 0, unitPrice: 0 }
    ]
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 1,
      poNumber: "PO-001",
      supplier: "ABC Supply Co.",
      status: "sent",
      totalAmount: 2450.00,
      currency: "USD",
      orderDate: "2024-01-15",
      expectedDate: "2024-01-22",
      items: [
        { id: 1, name: "Cordless Drill 18V", sku: "TOOL-001", quantity: 10, unitPrice: 150.00, received: 0 },
        { id: 2, name: "Drill Bits Set", sku: "TOOL-002", quantity: 20, unitPrice: 35.00, received: 0 }
      ]
    },
    {
      id: 2,
      poNumber: "PO-002",
      supplier: "Industrial Parts Ltd",
      status: "partial",
      totalAmount: 1850.00,
      currency: "USD",
      orderDate: "2024-01-14",
      expectedDate: "2024-01-21",
      items: [
        { id: 3, name: "Brake Pads Premium", sku: "PART-034", quantity: 25, unitPrice: 45.00, received: 15 },
        { id: 4, name: "Motor Oil 5W-30", sku: "SUPP-112", quantity: 30, unitPrice: 25.00, received: 30 }
      ]
    },
    {
      id: 3,
      poNumber: "PO-003",
      supplier: "Tech Equipment Pro",
      status: "draft",
      totalAmount: 3200.00,
      currency: "USD",
      orderDate: "2024-01-15",
      expectedDate: "2024-01-25",
      items: [
        { id: 5, name: "LED Work Light", sku: "ELEC-089", quantity: 15, unitPrice: 120.00, received: 0 },
        { id: 6, name: "Extension Cord 50ft", sku: "ELEC-045", quantity: 8, unitPrice: 85.00, received: 0 }
      ]
    }
  ]);

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && po.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      draft: { variant: "outline" as const, className: "bg-slate-100 text-slate-800", label: "Draft" },
      sent: { variant: "default" as const, className: "bg-blue-100 text-blue-800", label: "Sent" },
      partial: { variant: "secondary" as const, className: "bg-orange-100 text-orange-800", label: "Partial" },
      received: { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Received" },
      closed: { variant: "outline" as const, className: "bg-slate-100 text-slate-800", label: "Closed" }
    };
    
    const config = configs[status as keyof typeof configs] || configs.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleExport = () => {
    const csv = [
      ["PO Number", "Supplier", "Status", "Total Amount", "Order Date", "Expected Date"],
      ...filteredPOs.map(po => [
        po.poNumber,
        po.supplier,
        po.status,
        po.totalAmount.toString(),
        po.orderDate,
        po.expectedDate
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase-orders.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Purchase orders exported to CSV"
    });
  };

  const handleCreatePO = () => {
    if (!newPO.supplier || !newPO.expectedDate || newPO.items.some(item => !item.name || !item.sku || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = newPO.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    const purchaseOrder: PurchaseOrder = {
      id: purchaseOrders.length + 1,
      poNumber: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplier: newPO.supplier,
      status: "draft",
      totalAmount,
      currency: "USD",
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: newPO.expectedDate,
      items: newPO.items.map((item, index) => ({
        id: Date.now() + index,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        received: 0
      }))
    };

    setPurchaseOrders(prev => [purchaseOrder, ...prev]);
    setShowNewPOModal(false);
    setNewPO({
      supplier: "",
      expectedDate: "",
      items: [{ name: "", sku: "", quantity: 0, unitPrice: 0 }]
    });

    toast({
      title: "Purchase Order Created",
      description: `PO ${purchaseOrder.poNumber} has been created successfully`
    });
  };

  const handleStatusChange = (poId: number, newStatus: PurchaseOrder['status']) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === poId ? { ...po, status: newStatus } : po
    ));

    toast({
      title: "Status Updated",
      description: `Purchase order status changed to ${newStatus}`
    });
  };

  const handleSendPO = (po: PurchaseOrder) => {
    handleStatusChange(po.id, "sent");
    toast({
      title: "PO Sent",
      description: `Purchase order ${po.poNumber} has been sent to ${po.supplier}`
    });
  };

  const addPOItem = () => {
    setNewPO(prev => ({
      ...prev,
      items: [...prev.items, { name: "", sku: "", quantity: 0, unitPrice: 0 }]
    }));
  };

  const removePOItem = (index: number) => {
    setNewPO(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updatePOItem = (index: number, field: string, value: any) => {
    setNewPO(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-600 mt-1">Manage purchase orders and supplier relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowNewPOModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New PO
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
                <div className="text-2xl font-bold text-slate-900">
                  {purchaseOrders.filter(po => po.status === 'draft').length}
                </div>
                <div className="text-sm text-slate-600">Draft</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {purchaseOrders.filter(po => po.status === 'sent').length}
                </div>
                <div className="text-sm text-slate-600">Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {purchaseOrders.filter(po => po.status === 'partial').length}
                </div>
                <div className="text-sm text-slate-600">Partial</div>
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
                  {purchaseOrders.filter(po => po.status === 'received').length}
                </div>
                <div className="text-sm text-slate-600">Received</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => setStatusFilter("draft")}
                size="sm"
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "sent" ? "default" : "outline"}
                onClick={() => setStatusFilter("sent")}
                size="sm"
              >
                Sent
              </Button>
              <Button
                variant={statusFilter === "partial" ? "default" : "outline"}
                onClick={() => setStatusFilter("partial")}
                size="sm"
              >
                Partial
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">PO Number</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Order Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Expected</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{po.poNumber}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{po.supplier}</td>
                    <td className="py-4 px-4">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      ${po.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-slate-700">{po.orderDate}</td>
                    <td className="py-4 px-4 text-slate-700">{po.expectedDate}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPO(po);
                            setShowPODetailModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {po.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendPO(po)}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        )}
                        {po.status === 'sent' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(po.id, 'partial')}
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New PO Modal */}
      <Dialog open={showNewPOModal} onOpenChange={setShowNewPOModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select
                  value={newPO.supplier}
                  onValueChange={(value) => setNewPO(prev => ({ ...prev, supplier: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABC Supply Co.">ABC Supply Co.</SelectItem>
                    <SelectItem value="Industrial Parts Ltd">Industrial Parts Ltd</SelectItem>
                    <SelectItem value="Tech Equipment Pro">Tech Equipment Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expected-date">Expected Date *</Label>
                <Input
                  id="expected-date"
                  type="date"
                  value={newPO.expectedDate}
                  onChange={(e) => setNewPO(prev => ({ ...prev, expectedDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Items</Label>
                <Button size="sm" variant="outline" onClick={addPOItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-3">
                {newPO.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 p-3 border rounded-lg">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updatePOItem(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="SKU"
                      value={item.sku}
                      onChange={(e) => updatePOItem(index, 'sku', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updatePOItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => updatePOItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removePOItem(index)}
                      disabled={newPO.items.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreatePO} className="flex-1">
                Create Purchase Order
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewPOModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PO Detail Modal */}
      <Dialog open={showPODetailModal} onOpenChange={setShowPODetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>PO Number</Label>
                  <div className="font-medium">{selectedPO.poNumber}</div>
                </div>
                <div>
                  <Label>Supplier</Label>
                  <div className="font-medium">{selectedPO.supplier}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedPO.status)}</div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="font-medium">${selectedPO.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium">Item</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Qty</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Price</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-2 px-3">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-slate-600">{item.sku}</div>
                          </td>
                          <td className="py-2 px-3">{item.quantity}</td>
                          <td className="py-2 px-3">${item.unitPrice.toFixed(2)}</td>
                          <td className="py-2 px-3">{item.received}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPODetailModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;
