
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Download } from "lucide-react";

const PurchaseOrders = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-600 mt-1">Manage purchase orders and supplier relationships</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Purchase Orders Coming Soon</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Create and manage purchase orders, track deliveries, and maintain supplier relationships. 
          This feature will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default PurchaseOrders;
