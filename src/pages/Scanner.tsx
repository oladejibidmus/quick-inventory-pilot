
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera } from "lucide-react";

const Scanner = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Barcode Scanner</h1>
        <p className="text-slate-600 mt-1">Scan barcodes to quickly update inventory</p>
      </div>

      <div className="text-center py-12">
        <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Barcode Scanner Coming Soon</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Use your device's camera to scan barcodes and QR codes for quick inventory updates. 
          This feature will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default Scanner;
