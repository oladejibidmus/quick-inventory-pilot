
import { apiClient } from './api';

export interface POItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  received: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplier: string;
  status: "draft" | "sent" | "partial" | "received" | "closed";
  totalAmount: number;
  currency: string;
  orderDate: string;
  expectedDate: string;
  items: POItem[];
}

export interface CreatePurchaseOrderRequest {
  supplier: string;
  expectedDate: string;
  items: Omit<POItem, 'id' | 'received'>[];
}

export interface UpdatePurchaseOrderRequest extends Partial<CreatePurchaseOrderRequest> {
  id: number;
  status?: "draft" | "sent" | "partial" | "received" | "closed";
}

export const purchaseOrdersApi = {
  // Get all purchase orders
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    return apiClient.get<PurchaseOrder[]>('/purchase-orders');
  },

  // Get purchase order by ID
  getPurchaseOrder: async (id: number): Promise<PurchaseOrder> => {
    return apiClient.get<PurchaseOrder>(`/purchase-orders/${id}`);
  },

  // Create new purchase order
  createPurchaseOrder: async (po: CreatePurchaseOrderRequest): Promise<PurchaseOrder> => {
    return apiClient.post<PurchaseOrder>('/purchase-orders', po);
  },

  // Update purchase order
  updatePurchaseOrder: async (po: UpdatePurchaseOrderRequest): Promise<PurchaseOrder> => {
    return apiClient.put<PurchaseOrder>(`/purchase-orders/${po.id}`, po);
  },

  // Delete purchase order
  deletePurchaseOrder: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/purchase-orders/${id}`);
  },

  // Update purchase order status
  updatePurchaseOrderStatus: async (id: number, status: PurchaseOrder['status']): Promise<PurchaseOrder> => {
    return apiClient.put<PurchaseOrder>(`/purchase-orders/${id}/status`, { status });
  },

  // Get purchase orders by status
  getPurchaseOrdersByStatus: async (status: PurchaseOrder['status']): Promise<PurchaseOrder[]> => {
    return apiClient.get<PurchaseOrder[]>(`/purchase-orders/status/${status}`);
  },

  // Receive items for purchase order
  receiveItems: async (poId: number, receivedItems: { itemId: number; receivedQuantity: number }[]): Promise<PurchaseOrder> => {
    return apiClient.post<PurchaseOrder>(`/purchase-orders/${poId}/receive`, { receivedItems });
  },
};
