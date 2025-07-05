
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Download, Calendar, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  status: "draft" | "sent" | "received" | "closed";
  totalAmount: number;
  orderDate: string;
  expectedDate: string;
  items: POItem[];
}

interface POItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  receivedQty: number;
}

const PurchaseOrders = () => {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "1",
      poNumber: "PO-2024-001",
      supplier: "Tech Supplies Inc",
      status: "sent",
      totalAmount: 2500.00,
      orderDate: "2024-01-15",
      expectedDate: "2024-01-25",
      items: [
        { id: "1", itemName: "Laptop Battery", quantity: 10, unitPrice: 85.00, receivedQty: 0 },
        { id: "2", itemName: "USB Cable", quantity: 50, unitPrice: 12.50, receivedQty: 0 }
      ]
    },
    {
      id: "2",
      poNumber: "PO-2024-002",
      supplier: "Office Depot",
      status: "draft",
      totalAmount: 850.00,
      orderDate: "2024-01-16",
      expectedDate: "2024-01-28",
      items: [
        { id: "3", itemName: "Printer Paper", quantity: 20, unitPrice: 15.00, receivedQty: 0 },
        { id: "4", itemName: "Ink Cartridge", quantity: 25, unitPrice: 22.00, receivedQty: 0 }
      ]
    }
  ]);

  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [newPO, setNewPO] = useState<Partial<PurchaseOrder>>({
    supplier: "",
    expectedDate: "",
    items: []
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "received": return "bg-green-100 text-green-800";
      case "closed": return "bg-slate-100 text-slate-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreatePO = () => {
    if (!newPO.supplier || !newPO.expectedDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const po: PurchaseOrder = {
      id: (purchaseOrders.length + 1).toString(),
      poNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplier: newPO.supplier!,
      status: "draft",
      totalAmount: 0,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: newPO.expectedDate!,
      items: []
    };

    setPurchaseOrders([...purchaseOrders, po]);
    setNewPO({ supplier: "", expectedDate: "", items: [] });
    setShowCreateModal(false);
    
    toast({
      title: "Success",
      description: "Purchase order created successfully"
    });
  };

  const handleSendPO = (poId: string) => {
    setPurchaseOrders(orders => 
      orders.map(po => 
        po.id === poId ? { ...po, status: "sent" as const } : po
      )
    );
    
    toast({
      title: "Purchase Order Sent",
      description: "PO has been sent to supplier"
    });
  };

  const handleReceiveItems = (poId: string, receivedItems: { [key: string]: number }) => {
    setPurchaseOrders(orders => 
      orders.map(po => {
        if (po.id === poId) {
          const updatedItems = po.items.map(item => ({
            ...item,
            receivedQty: receivedItems[item.id] || item.receivedQty
          }));
          
          const allReceived = updatedItems.every(item => item.receivedQty >= item.quantity);
          
          return {
            ...po,
            items: updatedItems,
            status: allReceived ? "received" as const : "sent"
          };
        }
        return po;
      })
    );

    setShowReceiveModal(false);
    toast({
      title: "Items Received",
      description: "Stock quantities have been updated"
    });
  };

  const downloadPDF = (po: PurchaseOrder) => {
    toast({
      title: "PDF Downloaded",
      description: `Purchase Order ${po.poNumber} downloaded`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-600 mt-1">Manage purchase orders and supplier relationships</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={newPO.supplier || ""}
                  onChange={(e) => setNewPO({ ...newPO, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <Label htmlFor="expectedDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={newPO.expectedDate || ""}
                  onChange={(e) => setNewPO({ ...newPO, expectedDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreatePO} className="flex-1">Create PO</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {purchaseOrders.map((po) => (
          <Card key={po.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{po.poNumber}</h3>
                    <p className="text-slate-600">{po.supplier}</p>
                  </div>
                  <Badge className={getStatusColor(po.status)}>
                    {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadPDF(po)}>
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  {po.status === "draft" && (
                    <Button size="sm" onClick={() => handleSendPO(po.id)}>
                      Send PO
                    </Button>
                  )}
                  {po.status === "sent" && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedPO(po);
                        setShowReceiveModal(true);
                      }}
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Receive
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Order Date:</span>
                  <p className="font-medium">{new Date(po.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500">Expected:</span>
                  <p className="font-medium">{new Date(po.expectedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500">Total:</span>
                  <p className="font-medium">${po.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Receive Items Modal */}
      <Dialog open={showReceiveModal} onOpenChange={setShowReceiveModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receive Items - {selectedPO?.poNumber}</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <ReceiveItemsForm 
              po={selectedPO} 
              onReceive={handleReceiveItems}
              onCancel={() => setShowReceiveModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReceiveItemsFormProps {
  po: PurchaseOrder;
  onReceive: (poId: string, receivedItems: { [key: string]: number }) => void;
  onCancel: () => void;
}

const ReceiveItemsForm = ({ po, onReceive, onCancel }: ReceiveItemsFormProps) => {
  const [receivedQuantities, setReceivedQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setReceivedQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  const handleSubmit = () => {
    onReceive(po.id, receivedQuantities);
  };

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-3">
        {po.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium">{item.itemName}</h4>
              <p className="text-sm text-slate-600">
                Ordered: {item.quantity} | Already Received: {item.receivedQty}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`qty-${item.id}`} className="text-sm">Receive:</Label>
              <Input
                id={`qty-${item.id}`}
                type="number"
                className="w-20"
                min="0"
                max={item.quantity - item.receivedQty}
                value={receivedQuantities[item.id] || 0}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          Update Stock
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PurchaseOrders;
