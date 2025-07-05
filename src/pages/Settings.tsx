
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings as SettingsIcon, Building, Users, Bell, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  type: "warehouse" | "store" | "truck";
  address: string;
  isActive: boolean;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface AlertSettings {
  lowStockThreshold: number;
  emailNotifications: boolean;
  slackWebhook: string;
  discordWebhook: string;
  smsNotifications: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  
  const [locations, setLocations] = useState<Location[]>([
    { id: "1", name: "Main Warehouse", type: "warehouse", address: "123 Industrial Blvd", isActive: true },
    { id: "2", name: "Store Front", type: "store", address: "456 Main Street", isActive: true },
    { id: "3", name: "Delivery Truck A", type: "truck", address: "Mobile Unit", isActive: true }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: "1", name: "Tech Supplies Inc", email: "orders@techsupplies.com", phone: "+1-555-0123", address: "789 Tech Park Dr", isActive: true },
    { id: "2", name: "Office Depot", email: "business@officedepot.com", phone: "+1-555-0456", address: "321 Commerce Ave", isActive: true }
  ]);

  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    lowStockThreshold: 10,
    emailNotifications: true,
    slackWebhook: "",
    discordWebhook: "",
    smsNotifications: false
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    type: "warehouse",
    address: "",
    isActive: true
  });

  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: true
  });

  // Location Management
  const handleSaveLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingLocation) {
      setLocations(prev => prev.map(loc => 
        loc.id === editingLocation.id 
          ? { ...editingLocation, ...newLocation }
          : loc
      ));
      toast({
        title: "Location Updated",
        description: `${newLocation.name} has been updated`
      });
    } else {
      const location: Location = {
        id: (locations.length + 1).toString(),
        name: newLocation.name!,
        type: newLocation.type || "warehouse",
        address: newLocation.address!,
        isActive: newLocation.isActive || true
      };
      setLocations(prev => [...prev, location]);
      toast({
        title: "Location Added",
        description: `${location.name} has been added`
      });
    }

    setNewLocation({ name: "", type: "warehouse", address: "", isActive: true });
    setEditingLocation(null);
    setShowLocationModal(false);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setNewLocation(location);
    setShowLocationModal(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    toast({
      title: "Location Deleted",
      description: "Location has been removed"
    });
  };

  // Supplier Management
  const handleSaveSupplier = () => {
    if (!newSupplier.name || !newSupplier.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive"
      });
      return;
    }

    if (editingSupplier) {
      setSuppliers(prev => prev.map(sup => 
        sup.id === editingSupplier.id 
          ? { ...editingSupplier, ...newSupplier }
          : sup
      ));
      toast({
        title: "Supplier Updated",
        description: `${newSupplier.name} has been updated`
      });
    } else {
      const supplier: Supplier = {
        id: (suppliers.length + 1).toString(),
        name: newSupplier.name!,
        email: newSupplier.email!,
        phone: newSupplier.phone || "",
        address: newSupplier.address || "",
        isActive: newSupplier.isActive || true
      };
      setSuppliers(prev => [...prev, supplier]);
      toast({
        title: "Supplier Added",
        description: `${supplier.name} has been added`
      });
    }

    setNewSupplier({ name: "", email: "", phone: "", address: "", isActive: true });
    setEditingSupplier(null);
    setShowSupplierModal(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(sup => sup.id !== supplierId));
    toast({
      title: "Supplier Deleted",
      description: "Supplier has been removed"
    });
  };

  // Alert Settings
  const handleSaveAlertSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Alert settings have been updated"
    });
    setShowAlertModal(false);
  };

  const testWebhook = (type: 'slack' | 'discord') => {
    const webhook = type === 'slack' ? alertSettings.slackWebhook : alertSettings.discordWebhook;
    if (!webhook) {
      toast({
        title: "No Webhook URL",
        description: `Please enter a ${type} webhook URL first`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Test Sent",
      description: `Test message sent to ${type.charAt(0).toUpperCase() + type.slice(1)}`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your inventory system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Locations ({locations.length})
              </span>
              <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => {
                    setEditingLocation(null);
                    setNewLocation({ name: "", type: "warehouse", address: "", isActive: true });
                  }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLocation ? "Edit Location" : "Add Location"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location-name">Name *</Label>
                      <Input
                        id="location-name"
                        value={newLocation.name || ""}
                        onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                        placeholder="e.g., Main Warehouse"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location-type">Type</Label>
                      <select
                        id="location-type"
                        value={newLocation.type || "warehouse"}
                        onChange={(e) => setNewLocation({...newLocation, type: e.target.value as "warehouse" | "store" | "truck"})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="warehouse">Warehouse</option>
                        <option value="store">Store</option>
                        <option value="truck">Truck/Mobile</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="location-address">Address *</Label>
                      <Input
                        id="location-address"
                        value={newLocation.address || ""}
                        onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveLocation} className="flex-1">
                        {editingLocation ? "Update" : "Add"} Location
                      </Button>
                      <Button variant="outline" onClick={() => setShowLocationModal(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs text-slate-600">{location.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditLocation(location)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteLocation(location.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Suppliers ({suppliers.length})
              </span>
              <Dialog open={showSupplierModal} onOpenChange={setShowSupplierModal}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => {
                    setEditingSupplier(null);
                    setNewSupplier({ name: "", email: "", phone: "", address: "", isActive: true });
                  }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSupplier ? "Edit Supplier" : "Add Supplier"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="supplier-name">Name *</Label>
                      <Input
                        id="supplier-name"
                        value={newSupplier.name || ""}
                        onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                        placeholder="e.g., ABC Supplies"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier-email">Email *</Label>
                      <Input
                        id="supplier-email"
                        type="email"
                        value={newSupplier.email || ""}
                        onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                        placeholder="supplier@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier-phone">Phone</Label>
                      <Input
                        id="supplier-phone"
                        value={newSupplier.phone || ""}
                        onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                        placeholder="+1-555-0123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier-address">Address</Label>
                      <Input
                        id="supplier-address"
                        value={newSupplier.address || ""}
                        onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveSupplier} className="flex-1">
                        {editingSupplier ? "Update" : "Add"} Supplier
                      </Button>
                      <Button variant="outline" onClick={() => setShowSupplierModal(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{supplier.name}</p>
                    <p className="text-xs text-slate-600">{supplier.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditSupplier(supplier)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteSupplier(supplier.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Configure low-stock alerts and email notifications.</p>
            <Dialog open={showAlertModal} onOpenChange={setShowAlertModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Setup Alerts</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Alert Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="threshold">Low Stock Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={alertSettings.lowStockThreshold}
                      onChange={(e) => setAlertSettings({...alertSettings, lowStockThreshold: parseInt(e.target.value) || 10})}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={alertSettings.emailNotifications}
                        onChange={(e) => setAlertSettings({...alertSettings, emailNotifications: e.target.checked})}
                      />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="slack-webhook"
                          value={alertSettings.slackWebhook}
                          onChange={(e) => setAlertSettings({...alertSettings, slackWebhook: e.target.value})}
                          placeholder="https://hooks.slack.com/..."
                        />
                        <Button size="sm" variant="outline" onClick={() => testWebhook('slack')}>
                          Test
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="discord-webhook"
                          value={alertSettings.discordWebhook}
                          onChange={(e) => setAlertSettings({...alertSettings, discordWebhook: e.target.value})}
                          placeholder="https://discord.com/api/webhooks/..."
                        />
                        <Button size="sm" variant="outline" onClick={() => testWebhook('discord')}>
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveAlertSettings} className="flex-1">
                      Save Settings
                    </Button>
                    <Button variant="outline" onClick={() => setShowAlertModal(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Info */}
      <div className="text-center py-8">
        <SettingsIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">More Settings Coming Soon</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Additional configuration options including user management, integrations, and system preferences 
          will be available in future updates.
        </p>
      </div>
    </div>
  );
};

export default Settings;
