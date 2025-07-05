
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Camera, Plus, Minus, Package, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScannedItem {
  id: string;
  barcode: string;
  name: string;
  currentStock: number;
  location: string;
}

const Scanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock database of items
  const [mockItems, setMockItems] = useState<ScannedItem[]>([
    { id: "1", barcode: "123456789012", name: "Laptop Battery", currentStock: 25, location: "Warehouse A" },
    { id: "2", barcode: "123456789013", name: "USB Cable", currentStock: 150, location: "Warehouse A" },
    { id: "3", barcode: "123456789014", name: "Wireless Mouse", currentStock: 45, location: "Store Front" },
    { id: "4", barcode: "123456789015", name: "Keyboard", currentStock: 30, location: "Warehouse B" }
  ]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        toast({
          title: "Camera Started",
          description: "Point camera at barcode to scan"
        });
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateBarcodeDetection = () => {
    // Simulate barcode detection for demo purposes
    const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
    handleBarcodeDetected(randomItem.barcode);
  };

  const handleBarcodeDetected = (barcode: string) => {
    const item = mockItems.find(item => item.barcode === barcode);
    
    if (item) {
      setSelectedItem(item);
      setShowAdjustModal(true);
      stopScanning();
      
      toast({
        title: "Item Found",
        description: `Scanned: ${item.name}`
      });
    } else {
      toast({
        title: "Item Not Found",
        description: `No item found for barcode: ${barcode}`,
        variant: "destructive"
      });
    }
  };

  const handleManualLookup = () => {
    if (manualBarcode) {
      handleBarcodeDetected(manualBarcode);
      setManualBarcode("");
    }
  };

  const handleStockAdjustment = (type: 'in' | 'out') => {
    if (!selectedItem) return;

    const adjustment = type === 'in' ? adjustmentQty : -adjustmentQty;
    const newStock = selectedItem.currentStock + adjustment;

    if (newStock < 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Stock cannot be negative",
        variant: "destructive"
      });
      return;
    }

    // Update the item in our mock data
    const updatedItem = { ...selectedItem, currentStock: newStock };
    setMockItems(prev => prev.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    ));
    
    // Add to scanned items history
    setScannedItems(prev => [
      {
        ...updatedItem,
        id: `scan-${Date.now()}`,
      },
      ...prev.slice(0, 9) // Keep last 10 scans
    ]);

    toast({
      title: "Stock Updated",
      description: `${selectedItem.name}: ${selectedItem.currentStock} → ${newStock}`,
    });

    // Reset form
    setShowAdjustModal(false);
    setSelectedItem(null);
    setAdjustmentQty(0);
    setAdjustmentReason("");
  };

  const clearScannedItems = () => {
    setScannedItems([]);
    toast({
      title: "History Cleared",
      description: "Scanned items history has been cleared"
    });
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Barcode Scanner</h1>
        <p className="text-slate-600 mt-1">Scan barcodes to quickly update inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-slate-100 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-4 border-red-500 border-dashed animate-pulse" />
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Scanning...
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Camera preview will appear here</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <>
                  <Button onClick={stopScanning} variant="outline" className="flex-1">
                    Stop Camera
                  </Button>
                  <Button onClick={simulateBarcodeDetection} className="flex-1">
                    Simulate Scan
                  </Button>
                </>
              )}
            </div>

            {/* Manual Barcode Entry */}
            <div className="border-t pt-4">
              <Label htmlFor="manual-barcode">Manual Barcode Entry</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="manual-barcode"
                  placeholder="Enter barcode manually"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLookup()}
                />
                <Button onClick={handleManualLookup} disabled={!manualBarcode}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Recent Scans
              </CardTitle>
              {scannedItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearScannedItems}>
                  Clear History
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {scannedItems.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent scans</p>
                <p className="text-sm mt-1">Scan items to see them here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scannedItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-slate-600">
                        Stock: {item.currentStock} | {item.location}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {item.barcode}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 text-right">
                      <div>{new Date().toLocaleTimeString()}</div>
                      <Badge variant="outline" className="mt-1">
                        Updated
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Items for Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Available Items for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-slate-600">Stock: {item.currentStock}</p>
                <p className="text-xs text-slate-500 font-mono">{item.barcode}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => handleBarcodeDetected(item.barcode)}
                >
                  Quick Scan
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment Modal */}
      <Dialog open={showAdjustModal} onOpenChange={setShowAdjustModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold">{selectedItem.name}</h3>
                <p className="text-sm text-slate-600">Current Stock: {selectedItem.currentStock}</p>
                <p className="text-sm text-slate-600">Location: {selectedItem.location}</p>
                <p className="text-xs text-slate-500 font-mono">Barcode: {selectedItem.barcode}</p>
              </div>

              <div>
                <Label htmlFor="adjustment-qty">Adjustment Quantity</Label>
                <Input
                  id="adjustment-qty"
                  type="number"
                  min="1"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <Label htmlFor="adjustment-reason">Reason (Optional)</Label>
                <Input
                  id="adjustment-reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g., Cycle count, Damage, Sale"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleStockAdjustment('in')} 
                  className="flex-1"
                  disabled={adjustmentQty <= 0}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Stock (+{adjustmentQty})
                </Button>
                <Button 
                  onClick={() => handleStockAdjustment('out')} 
                  variant="outline" 
                  className="flex-1"
                  disabled={adjustmentQty <= 0}
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Remove Stock (-{adjustmentQty})
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedItem(null);
                  setAdjustmentQty(0);
                  setAdjustmentReason("");
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Scanner;
