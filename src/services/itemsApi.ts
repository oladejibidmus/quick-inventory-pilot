
import { apiClient } from './api';

export interface Item {
  id: number;
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  unitPrice: number;
  supplier?: string;
  lastUpdated: string;
}

export interface CreateItemRequest {
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: string;
  minStock: number;
  maxStock: number;
  location: string;
  unitPrice: number;
  supplier?: string;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  id: number;
}

export const itemsApi = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    return apiClient.get<Item[]>('/items');
  },

  // Get item by ID
  getItem: async (id: number): Promise<Item> => {
    return apiClient.get<Item>(`/items/${id}`);
  },

  // Create new item
  createItem: async (item: CreateItemRequest): Promise<Item> => {
    return apiClient.post<Item>('/items', item);
  },

  // Update item
  updateItem: async (item: UpdateItemRequest): Promise<Item> => {
    return apiClient.put<Item>(`/items/${item.id}`, item);
  },

  // Delete item
  deleteItem: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/items/${id}`);
  },

  // Search items
  searchItems: async (query: string): Promise<Item[]> => {
    return apiClient.get<Item[]>(`/items/search?q=${encodeURIComponent(query)}`);
  },

  // Get low stock items
  getLowStockItems: async (): Promise<Item[]> => {
    return apiClient.get<Item[]>('/items/low-stock');
  },
};
