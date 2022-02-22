import { functions } from '@/utils/Firebase';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';

export type Callable<Request, Response> = {
  loading: boolean;
  error: Error | undefined;
  call: (params: Request) => Promise<Response>;
};

export const useCallable = <Request, Response>(name: string): Callable<Request, Response> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const call = async (params: Request) => {
    setLoading(true);
    try {
      const result = await httpsCallable(functions, name)(params);
      return Promise.resolve(result.data as Response);
    } catch (err) {
      setError(err as Error);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    call,
  };
};
