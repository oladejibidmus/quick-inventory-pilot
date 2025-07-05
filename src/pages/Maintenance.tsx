
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Calendar as CalendarIcon, Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, differenceInDays } from "date-fns";

interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  category: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceInterval: number; // days
  status: "good" | "due" | "overdue";
  warrantyExpiry: string;
}

interface MaintenanceLog {
  id: string;
  assetId: string;
  date: string;
  description: string;
  technician: string;
  cost: number;
  type: "preventive" | "repair" | "inspection";
}

const Maintenance = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "Forklift Unit A1",
      serialNumber: "FK-2023-001",
      location: "Warehouse A",
      category: "Heavy Equipment",
      lastMaintenanceDate: "2024-01-01",
      nextMaintenanceDate: "2024-02-01",
      maintenanceInterval: 30,
      status: "overdue",
      warrantyExpiry: "2025-12-01"
    },
    {
      id: "2", 
      name: "Conveyor Belt System",
      serialNumber: "CB-2022-015",
      location: "Production Floor",
      category: "Machinery",
      lastMaintenanceDate: "2024-01-10",
      nextMaintenanceDate: "2024-01-25",
      maintenanceInterval: 15,
      status: "due",
      warrantyExpiry: "2024-06-15"
    },
    {
      id: "3",
      name: "Air Compressor",
      serialNumber: "AC-2023-008",
      location: "Workshop",
      category: "Tools",
      lastMaintenanceDate: "2024-01-15",
      nextMaintenanceDate: "2024-02-15",
      maintenanceInterval: 30,
      status: "good",
      warrantyExpiry: "2026-03-20"
    }
  ]);

  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([
    {
      id: "1",
      assetId: "1",
      date: "2024-01-01",
      description: "Routine hydraulic fluid change and filter replacement",
      technician: "John Smith",
      cost: 150.00,
      type: "preventive"
    },
    {
      id: "2",
      assetId: "2",
      date: "2024-01-10", 
      description: "Belt tension adjustment and lubrication",
      technician: "Mike Johnson",
      cost: 75.00,
      type: "preventive"
    }
  ]);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: "",
    serialNumber: "",
    location: "",
    category: "",
    maintenanceInterval: 30
  });
  const [newMaintenance, setNewMaintenance] = useState({
    description: "",
    technician: "",
    cost: 0,
    type: "preventive" as "preventive" | "repair" | "inspection",
    date: new Date()
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-100 text-green-800";
      case "due": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4" />;
      case "due": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysUntilMaintenance = (nextDate: string) => {
    return differenceInDays(new Date(nextDate), new Date());
  };

  const handleCreateAsset = () => {
    if (!newAsset.name || !newAsset.serialNumber || !newAsset.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const nextMaintenance = addDays(new Date(), newAsset.maintenanceInterval || 30);

    const asset: Asset = {
      id: (assets.length + 1).toString(),
      name: newAsset.name!,
      serialNumber: newAsset.serialNumber!,
      location: newAsset.location!,
      category: newAsset.category || "General",
      lastMaintenanceDate: today,
      nextMaintenanceDate: nextMaintenance.toISOString().split('T')[0],
      maintenanceInterval: newAsset.maintenanceInterval || 30,
      status: "good",
      warrantyExpiry: addDays(new Date(), 365).toISOString().split('T')[0]
    };

    setAssets([...assets, asset]);
    setNewAsset({ name: "", serialNumber: "", location: "", category: "", maintenanceInterval: 30 });
    setShowCreateModal(false);
    
    toast({
      title: "Asset Added",
      description: `${asset.name} has been added to your assets`
    });
  };

  const handleLogMaintenance = () => {
    if (!selectedAsset || !newMaintenance.description || !newMaintenance.technician) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const maintenanceDate = format(newMaintenance.date, "yyyy-MM-dd");
    const nextMaintenanceDate = addDays(newMaintenance.date, selectedAsset.maintenanceInterval).toISOString().split('T')[0];

    // Add maintenance log
    const log: MaintenanceLog = {
      id: (maintenanceLogs.length + 1).toString(),
      assetId: selectedAsset.id,
      date: maintenanceDate,
      description: newMaintenance.description,
      technician: newMaintenance.technician,
      cost: newMaintenance.cost,
      type: newMaintenance.type
    };

    setMaintenanceLogs([...maintenanceLogs, log]);

    // Update asset
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === selectedAsset.id 
          ? {
              ...asset,
              lastMaintenanceDate: maintenanceDate,
              nextMaintenanceDate,
              status: "good" as const
            }
          : asset
      )
    );

    // Reset form
    setNewMaintenance({
      description: "",
      technician: "",
      cost: 0,
      type: "preventive",
      date: new Date()
    });
    setShowMaintenanceModal(false);
    setSelectedAsset(null);

    toast({
      title: "Maintenance Logged",
      description: "Asset maintenance has been recorded and next due date updated"
    });
  };

  const overdueAssets = assets.filter(asset => asset.status === "overdue");
  const dueAssets = assets.filter(asset => asset.status === "due");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Asset Maintenance</h1>
          <p className="text-slate-600 mt-1">Track and schedule equipment maintenance</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset-name">Asset Name *</Label>
                <Input
                  id="asset-name"
                  value={newAsset.name || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g., Forklift Unit B2"
                />
              </div>
              <div>
                <Label htmlFor="serial-number">Serial Number *</Label>
                <Input
                  id="serial-number"
                  value={newAsset.serialNumber || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                  placeholder="e.g., FK-2024-002"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newAsset.location || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                  placeholder="e.g., Warehouse B"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newAsset.category || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  placeholder="e.g., Heavy Equipment"
                />
              </div>
              <div>
                <Label htmlFor="interval">Maintenance Interval (days)</Label>
                <Input
                  id="interval"
                  type="number"
                  value={newAsset.maintenanceInterval || 30}
                  onChange={(e) => setNewAsset({ ...newAsset, maintenanceInterval: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAsset} className="flex-1">Add Asset</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Cards */}
      {(overdueAssets.length > 0 || dueAssets.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overdueAssets.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-800 text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Overdue Maintenance ({overdueAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {overdueAssets.slice(0, 3).map(asset => (
                    <div key={asset.id} className="text-sm">
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-red-700 ml-2">
                        {Math.abs(getDaysUntilMaintenance(asset.nextMaintenanceDate))} days overdue
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {dueAssets.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Due Soon ({dueAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {dueAssets.slice(0, 3).map(asset => (
                    <div key={asset.id} className="text-sm">
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-yellow-700 ml-2">
                        Due in {getDaysUntilMaintenance(asset.nextMaintenanceDate)} days
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Assets Grid */}
      <div className="grid gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{asset.name}</h3>
                    <p className="text-slate-600">Serial: {asset.serialNumber}</p>
                  </div>
                  <Badge className={getStatusColor(asset.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(asset.status)}
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </Badge>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowMaintenanceModal(true);
                  }}
                >
                  <Wrench className="w-4 h-4 mr-1" />
                  Log Maintenance
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Location:</span>
                  <p className="font-medium">{asset.location}</p>
                </div>
                <div>
                  <span className="text-slate-500">Category:</span>
                  <p className="font-medium">{asset.category}</p>
                </div>
                <div>
                  <span className="text-slate-500">Last Maintenance:</span>
                  <p className="font-medium">{new Date(asset.lastMaintenanceDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500">Next Due:</span>
                  <p className="font-medium">{new Date(asset.nextMaintenanceDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log Maintenance Modal */}
      <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Maintenance - {selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="maintenance-date">Maintenance Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newMaintenance.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newMaintenance.date}
                    onSelect={(date) => date && setNewMaintenance({...newMaintenance, date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="maintenance-description">Description *</Label>
              <Input
                id="maintenance-description"
                value={newMaintenance.description}
                onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                placeholder="Describe the maintenance performed"
              />
            </div>

            <div>
              <Label htmlFor="technician">Technician *</Label>
              <Input
                id="technician"
                value={newMaintenance.technician}
                onChange={(e) => setNewMaintenance({...newMaintenance, technician: e.target.value})}
                placeholder="Technician name"
              />
            </div>

            <div>
              <Label htmlFor="maintenance-cost">Cost ($)</Label>
              <Input
                id="maintenance-cost"
                type="number"
                step="0.01"
                value={newMaintenance.cost}
                onChange={(e) => setNewMaintenance({...newMaintenance, cost: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleLogMaintenance} className="flex-1">
                Log Maintenance
              </Button>
              <Button variant="outline" onClick={() => setShowMaintenanceModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Maintenance;
