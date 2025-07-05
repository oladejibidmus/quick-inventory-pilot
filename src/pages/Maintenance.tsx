
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Wrench } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Asset Maintenance</h1>
          <p className="text-slate-600 mt-1">Track and schedule equipment maintenance</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <div className="text-center py-12">
        <Wrench className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Asset Maintenance Coming Soon</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Schedule maintenance tasks, track service history, and manage equipment warranties. 
          This feature will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
