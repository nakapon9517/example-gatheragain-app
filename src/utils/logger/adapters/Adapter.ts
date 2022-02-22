import { User } from 'firebase/auth';

export interface Adapter {
  set: (user?: User) => void;
  screen: (name: string) => void;
  action: (name: string, id?: string) => void;
  error: (error: Error) => void;
}
