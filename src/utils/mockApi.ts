
// Mock API utilities for development when backend is not available
export const createMockDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const createMockResponse = async <T>(data: T, delay: number = 500): Promise<T> => {
  await createMockDelay(delay);
  return data;
};

export const createMockError = async (message: string, delay: number = 500): Promise<never> => {
  await createMockDelay(delay);
  throw new Error(message);
};

// Environment check utility
export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
