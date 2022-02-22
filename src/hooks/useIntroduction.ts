import { useContext } from 'react';
import { Storage, StorageName } from '@/utils';
import AppContext from '@/contexts/AppContext';

export const useIntroduction = () => {
  const { isIntfoductionDone, setIntfoductionDone } = useContext(AppContext);
  const storage = new Storage<boolean>();

  const saveIntroductionDone = (done: boolean) => {
    storage.save(StorageName.Introduction, done);
    setIntfoductionDone(done);
  };

  return {
    isIntfoductionDone,
    saveIntroductionDone,
  };
};
