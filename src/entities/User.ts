import { Gather } from './';

export type User = {
  id: string;
  expoToken: string | null;
  gathers: Gather[];
};
