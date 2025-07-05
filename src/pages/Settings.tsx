
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Users, 
  Building, 
  Bell,
  Plus,
  Edit,
  Trash2,
  Save
} from "lucide-react";

interface Location {
  id: number;
  name: string;
  type: "warehouse" | "store" | "truck" | "other";
  address: string;
}

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  active: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  
  // Location Management
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: "Main Warehouse", type: "warehouse", address: "123 Industrial Blvd" },
    { id: 2, name: "Store Front", type: "store", address: "456 Main Street" },
    { id: 3, name: "Service Bay", type: "warehouse", address: "789 Workshop Ave" }
  ]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationForm, setLocationForm] = useState({
    name: "",
    type: "warehouse" as "warehouse" | "store" | "truck" | "other",
    address: ""
  });

  // Supplier Management
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: "ABC Supply Co.", email: "orders@abcsupply.com", phone: "(555) 123-4567", address: "100 Supply St" },
    { id: 2, name: "Industrial Parts Ltd", email: "sales@indparts.com", phone: "(555) 987-6543", address: "200 Parts Ave" }
  ]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // User Management
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@company.com", role: "admin", active: true },
    { id: 2, name: "Jane Smith", email: "jane@company.com", role: "manager", active: true },
    { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "staff", active: false }
  ]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "staff" as "admin" | "manager" | "staff",
    active: true
  });

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "StockFlow Pro",
    currency: "USD",
    timezone: "UTC",
    lowStockThreshold: 10,
    emailNotifications: true,
    pushNotifications: false,
    autoReorder: false
  });

  // Location Functions
  const handleLocationSubmit = () => {
    if (!locationForm.name || !locationForm.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingLocation) {
      setLocations(prev => prev.map(loc => 
        loc.id === editingLocation.id 
          ? { ...loc, ...locationForm }
          : loc
      ));
      toast({
        title: "Location Updated",
        description: `${locationForm.name} has been updated`
      });
    } else {
      const newLocation: Location = {
        id: locations.length + 1,
        ...locationForm
      };
      setLocations(prev => [...prev, newLocation]);
      toast({
        title: "Location Added",
        description: `${locationForm.name} has been added`
      });
    }

    setShowLocationModal(false);
    setEditingLocation(null);
    setLocationForm({ name: "", type: "warehouse", address: "" });
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationForm({
      name: location.name,
      type: location.type,
      address: location.address
    });
    setShowLocationModal(true);
  };

  const handleDeleteLocation = (id: number) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    toast({
      title: "Location Deleted",
      description: "Location has been removed"
    });
  };

  // Supplier Functions
  const handleSupplierSubmit = () => {
    if (!supplierForm.name || !supplierForm.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingSupplier) {
      setSuppliers(prev => prev.map(sup => 
        sup.id === editingSupplier.id 
          ? { ...sup, ...supplierForm }
          : sup
      ));
      toast({
        title: "Supplier Updated",
        description: `${supplierForm.name} has been updated`
      });
    } else {
      const newSupplier: Supplier = {
        id: suppliers.length + 1,
        ...supplierForm
      };
      setSuppliers(prev => [...prev, newSupplier]);
      toast({
        title: "Supplier Added",
        description: `${supplierForm.name} has been added`
      });
    }

    setShowSupplierModal(false);
    setEditingSupplier(null);
    setSupplierForm({ name: "", email: "", phone: "", address: "" });
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(prev => prev.filter(sup => sup.id !== id));
    toast({
      title: "Supplier Deleted",
      description: "Supplier has been removed"
    });
  };

  // User Functions
  const handleUserSubmit = () => {
    if (!userForm.name || !userForm.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userForm }
          : user
      ));
      toast({
        title: "User Updated",
        description: `${userForm.name} has been updated`
      });
    } else {
      const newUser: User = {
        id: users.length + 1,
        ...userForm
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "User Added",
        description: `${userForm.name} has been added`
      });
    }

    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "staff", active: true });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been removed"
    });
  };

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your system configuration and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={generalSettings.companyName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={generalSettings.currency}
                onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={generalSettings.timezone}
                onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
              <Input
                id="low-stock-threshold"
                type="number"
                value={generalSettings.lowStockThreshold}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600">Receive alerts and updates via email</p>
              </div>
              <Switch
                checked={generalSettings.emailNotifications}
                onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-slate-600">Receive browser notifications</p>
              </div>
              <Switch
                checked={generalSettings.pushNotifications}
                onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Reorder</Label>
                <p className="text-sm text-slate-600">Automatically create purchase orders for low stock items</p>
              </div>
              <Switch
                checked={generalSettings.autoReorder}
                onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, autoReorder: checked }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveGeneralSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locations
            </CardTitle>
            <Button onClick={() => setShowLocationModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-slate-600">{location.type} • {location.address}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditLocation(location)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteLocation(location.id)}>
                    <Trash2 className="w-4 h-4" />
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Suppliers
            </CardTitle>
            <Button onClick={() => setShowSupplierModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{supplier.name}</h4>
                  <p className="text-sm text-slate-600">{supplier.email} • {supplier.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditSupplier(supplier)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteSupplier(supplier.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users
            </CardTitle>
            <Button onClick={() => setShowUserModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-slate-600">{user.email} • {user.role}</p>
                  </div>
                  <Badge variant={user.active ? "default" : "secondary"}>
                    {user.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location-name">Name *</Label>
              <Input
                id="location-name"
                value={locationForm.name}
                onChange={(e) => setLocationForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter location name"
              />
            </div>
            <div>
              <Label htmlFor="location-type">Type</Label>
              <Select
                value={locationForm.type}
                onValueChange={(value) => setLocationForm(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location-address">Address *</Label>
              <Textarea
                id="location-address"
                value={locationForm.address}
                onChange={(e) => setLocationForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleLocationSubmit} className="flex-1">
                {editingLocation ? 'Update' : 'Add'} Location
              </Button>
              <Button variant="outline" onClick={() => setShowLocationModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Supplier Modal */}
      <Dialog open={showSupplierModal} onOpenChange={setShowSupplierModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-name">Name *</Label>
              <Input
                id="supplier-name"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <Label htmlFor="supplier-email">Email *</Label>
              <Input
                id="supplier-email"
                type="email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="supplier-phone">Phone</Label>
              <Input
                id="supplier-phone"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="supplier-address">Address</Label>
              <Textarea
                id="supplier-address"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSupplierSubmit} className="flex-1">
                {editingSupplier ? 'Update' : 'Add'} Supplier
              </Button>
              <Button variant="outline" onClick={() => setShowSupplierModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-name">Name *</Label>
              <Input
                id="user-name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active User</Label>
              <Switch
                checked={userForm.active}
                onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, active: checked }))}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUserSubmit} className="flex-1">
                {editingUser ? 'Update' : 'Add'} User
              </Button>
              <Button variant="outline" onClick={() => setShowUserModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
