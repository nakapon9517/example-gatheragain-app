import { Gather } from '@/entities';
import { useCallable } from '@/utils';

type Request = {
  shareId: string;
  title?: string;
  userRoute: {
    userName: string;
    visible: boolean;
    routeName: string;
  };
  visible: boolean;
};

type Response = {
  gather: Gather;
};

const useUpdateGather = () => useCallable<Request, Response>('onUpdateGather');

export { useUpdateGather };
