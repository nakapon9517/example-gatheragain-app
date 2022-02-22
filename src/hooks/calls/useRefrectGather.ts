import { useCallable } from '@/utils';

type Request = {
  shareId: string;
};

const useRefrectGather = () => useCallable<Request, void>('onRefrectGather');

export { useRefrectGather };
