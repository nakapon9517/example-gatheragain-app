import { useContext } from 'react';
import { Settings } from '@/entities';
import { Storage, StorageName } from '@/utils';
import AppContext from '@/contexts/AppContext';

export const useUserInfo = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);
  const storage = new Storage<Settings>();

  const saveUserInfo = (user: Settings) => {
    storage.save(StorageName.USER, user);
    setUserInfo(user);
  };

  return {
    userInfo: userInfo ?? initialUser,
    saveUserInfo,
  };
};

const initialUser = {
  name: undefined,
  nearestStation: undefined,
  visibleStation: true,
  isDefaultTheme: true,
};
