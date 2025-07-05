
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Building, Users, Bell } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your inventory system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Manage warehouses, stores, and storage locations.</p>
            <Button variant="outline" className="w-full">Configure Locations</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Add and manage your supplier relationships.</p>
            <Button variant="outline" className="w-full">Manage Suppliers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Configure low-stock alerts and email notifications.</p>
            <Button variant="outline" className="w-full">Setup Alerts</Button>
          </CardContent>
        </Card>
      </div>

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
