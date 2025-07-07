
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      options.onError?.(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  };
}

export function useApiQuery<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { data, loading, error, execute } = useApi(apiCall, options);

  useEffect(() => {
    execute();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: execute
  };
}
