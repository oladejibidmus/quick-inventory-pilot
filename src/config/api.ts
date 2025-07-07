
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
  
  ENDPOINTS: {
    // Items
    ITEMS: '/items',
    ITEMS_SEARCH: '/items/search',
    ITEMS_LOW_STOCK: '/items/low-stock',
    
    // Transactions
    TRANSACTIONS: '/transactions',
    TRANSACTIONS_BY_TYPE: '/transactions/type',
    TRANSACTIONS_BY_DATE: '/transactions/date-range',
    
    // Purchase Orders
    PURCHASE_ORDERS: '/purchase-orders',
    PURCHASE_ORDERS_BY_STATUS: '/purchase-orders/status',
    PURCHASE_ORDERS_RECEIVE: '/purchase-orders/:id/receive',
    
    // Authentication (for future use)
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_REFRESH: '/auth/refresh',
    
    // Settings
    SETTINGS: '/settings',
    
    // Health check
    HEALTH: '/health',
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
