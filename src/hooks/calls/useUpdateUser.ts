import { useCallable } from '@/utils';

type Request = {
  expoToken: string;
};

const useUpdateUser = () => useCallable<Request, void>('onUpdateUser');

export { useUpdateUser };
