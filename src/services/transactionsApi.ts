
import { apiClient } from './api';

export interface Transaction {
  id: number;
  type: "stock-in" | "stock-out" | "adjustment";
  item: string;
  sku: string;
  quantity: number;
  location: string;
  reason: string;
  user: string;
  timestamp: string;
}

export interface CreateTransactionRequest {
  type: "stock-in" | "stock-out" | "adjustment";
  item: string;
  sku: string;
  quantity: number;
  location: string;
  reason?: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: number;
}

export const transactionsApi = {
  // Get all transactions
  getTransactions: async (): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>('/transactions');
  },

  // Get transaction by ID
  getTransaction: async (id: number): Promise<Transaction> => {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  },

  // Create new transaction
  createTransaction: async (transaction: CreateTransactionRequest): Promise<Transaction> => {
    return apiClient.post<Transaction>('/transactions', transaction);
  },

  // Update transaction
  updateTransaction: async (transaction: UpdateTransactionRequest): Promise<Transaction> => {
    return apiClient.put<Transaction>(`/transactions/${transaction.id}`, transaction);
  },

  // Delete transaction
  deleteTransaction: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/transactions/${id}`);
  },

  // Get transactions by type
  getTransactionsByType: async (type: "stock-in" | "stock-out" | "adjustment"): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>(`/transactions/type/${type}`);
  },

  // Get transactions by date range
  getTransactionsByDateRange: async (startDate: string, endDate: string): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>(`/transactions/date-range?start=${startDate}&end=${endDate}`);
  },
};
