import { Category, Settings } from '@/entities';
import { createContext } from 'react';

type ContextProps = {
  theme?: 'light' | 'dark';
  setTheme: (_?: 'light' | 'dark') => void;
  categories?: Category[];
  setCategories: (_?: Category[]) => void;
  userInfo?: Settings;
  setUserInfo: (_: Settings) => void;
  gathersReload: boolean;
  setGathersReload: (_: boolean) => void;
  isIntfoductionDone: boolean;
  setIntfoductionDone: (_: boolean) => void;
};

export default createContext<ContextProps>({
  setTheme: () => {},
  setCategories: () => {},
  setUserInfo: () => {},
  gathersReload: false,
  setGathersReload: () => {},
  isIntfoductionDone: true,
  setIntfoductionDone: () => {},
});
