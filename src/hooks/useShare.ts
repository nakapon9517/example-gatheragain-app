import { useEffect, useState } from 'react';
import { db } from '@/utils/Firebase';
import { Share } from '@/entities';
import { doc, getDoc } from 'firebase/firestore';
import { logger } from '@/utils';

export const useShare = (shareId: string) => {
  const [loading, setLoading] = useState(true);
  const [share, setShare] = useState<Share>();

  useEffect(() => {
    getShare(shareId)
      .then((result) => setShare(result as Share))
      .finally(() => setLoading(false));
  }, [shareId]);

  const getShare = async (shareId: string): Promise<Share | undefined> => {
    try {
      const snapshot = await getDoc(doc(db, `shares/${shareId}`));
      if (snapshot.exists()) {
        return snapshot.data() as Share;
      } else {
        return undefined;
      }
    } catch (err) {
      logger.error(err as Error);
      return undefined;
    }
  };

  return { share, loading, getShare };
};
