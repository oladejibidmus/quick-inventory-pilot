import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  PackagePlus, 
  PackageMinus, 
  PackageX, 
  Package,
  Plus,
  Edit,
  Trash2,
  Save
} from "lucide-react";

interface Transaction {
  id: number;
  type: "stock-in" | "stock-out" | "adjustment";
  item: string;
  sku: string;
  quantity: number;
  location: string;
  reason: string;
  user: string;
  timestamp: string;
}

const StockTransactions = () => {
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "stock-in",
      item: "Widget A",
      sku: "WA-001",
      quantity: 100,
      location: "Warehouse A",
      reason: "Initial stock",
      user: "John Doe",
      timestamp: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      type: "stock-out",
      item: "Widget A",
      sku: "WA-001",
      quantity: 10,
      location: "Store Front",
      reason: "Customer order",
      user: "Jane Smith",
      timestamp: "2024-01-21T09:15:00Z"
    },
    {
      id: 3,
      type: "adjustment",
      item: "Widget B",
      sku: "WB-002",
      quantity: 5,
      location: "Warehouse A",
      reason: "Inventory correction",
      user: "John Doe",
      timestamp: "2024-01-22T16:45:00Z"
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    type: "stock-in",
    item: "",
    sku: "",
    quantity: 0,
    location: "",
    reason: ""
  });

  const handleSubmit = () => {
    if (!newTransaction.item || !newTransaction.sku || !newTransaction.quantity || !newTransaction.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    let quantity = newTransaction.quantity;
    
    // Apply negative quantity for stock-out and adjustment transactions
    if (newTransaction.type === "stock-out" || newTransaction.type === "adjustment") {
      quantity = -Math.abs(quantity); // Ensure it's negative
    } else {
      quantity = Math.abs(quantity); // Ensure it's positive for stock-in
    }

    const transaction: Transaction = {
      id: transactions.length + 1,
      type: newTransaction.type,
      item: newTransaction.item,
      sku: newTransaction.sku,
      quantity: quantity,
      location: newTransaction.location,
      reason: newTransaction.reason || `${newTransaction.type.charAt(0).toUpperCase() + newTransaction.type.slice(1)} transaction`,
      user: "Current User",
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [transaction, ...prev]);
    
    toast({
      title: "Transaction Added",
      description: `${newTransaction.type} transaction for ${newTransaction.item} has been recorded`
    });

    // Reset form
    setNewTransaction({
      type: "stock-in",
      item: "",
      sku: "",
      quantity: 0,
      location: "",
      reason: ""
    });
    setShowModal(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      type: transaction.type,
      item: transaction.item,
      sku: transaction.sku,
      quantity: Math.abs(transaction.quantity), // Display as positive in form
      location: transaction.location,
      reason: transaction.reason || ""
    });
    setShowModal(true);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been removed"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Stock Transactions</h1>
        <p className="text-slate-600 mt-1">Record and manage stock movements</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Transactions
            </CardTitle>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{transaction.item}</h4>
                  <p className="text-sm text-slate-600">
                    {transaction.type} • {transaction.quantity} • {transaction.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditTransaction(transaction)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteTransaction(transaction.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transaction-type">Type</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock-in">Stock In</SelectItem>
                  <SelectItem value="stock-out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={newTransaction.item}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, item: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="item-sku">SKU</Label>
              <Input
                id="item-sku"
                value={newTransaction.sku}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <Label htmlFor="item-quantity">Quantity</Label>
              <Input
                id="item-quantity"
                type="number"
                value={newTransaction.quantity}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="item-location">Location</Label>
              <Input
                id="item-location"
                value={newTransaction.location}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="item-reason">Reason</Label>
              <Textarea
                id="item-reason"
                value={newTransaction.reason}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                {editingTransaction ? 'Update' : 'Add'} Transaction
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockTransactions;
