import { useCallable } from '@/utils';

type Request = {
  category: {
    title: string;
    icon: string | null;
    stationNames: string[];
  };
  colors: string[];
  title: string;
  userRoute: {
    userName: string;
    visible: boolean;
    routeName: string;
  };
  visible: boolean;
};

type Response = {
  id: string;
};

const useCreateGather = () => useCallable<Request, Response>('onCreateGather');

export { useCreateGather };
