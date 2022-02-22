import { useContext, useEffect, useState } from 'react';
import { Gather } from '@/entities';
import { getRandomColor, getRandomNumber, logger } from '@/utils';
import { db, auth } from '@/utils/Firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import AppContext from '@/contexts/AppContext';
import { Timestamp } from 'firebase/firestore';

export const useUserGather = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const { gathersReload, setGathersReload } = useContext(AppContext);
  const [gathers, setGathers] = useState<Gather[]>(
    Array(getRandomNumber(20, 10))
      .fill(null)
      .map((_, i) => generateGather(i))
      .sort((a, b) => b.updatedTime.seconds - a.updatedTime.seconds),
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    // getGathers()
    //   .then((result) => setGathers(result as Gather[]))
    //   .finally(() => setLoading(false));
  }, []);

  const getGather = async (gatherId: string): Promise<Gather | undefined> => {
    try {
      if (!user?.uid) return undefined;
      const snapshot = await getDoc(doc(db, `users/${user.uid}/gathers/${gatherId}`));
      if (snapshot.exists()) {
        return snapshot.data() as Gather;
      } else {
        return undefined;
      }
    } catch (err) {
      logger.error(err as Error);
      return undefined;
    }
  };
  const getGathers = async (): Promise<Gather[]> => {
    try {
      if (!user?.uid) return [];
      const citySnapshot = await getDocs(collection(db, `users/${user.uid}/gathers`));
      const gathers = citySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Gather, 'id'>),
      }));
      return gathers.sort((a, b) => b.updatedTime.seconds - a.updatedTime.seconds);
    } catch (err) {
      logger.error(err as Error);
      return [];
    }
  };

  const onRefresh = async () => {
    // await getGathers().then((result) => setGathers(result as Gather[]));
  };

  return {
    gathers,
    loading,
    gathersReload,
    setGathers,
    getGather,
    getGathers,
    onRefresh,
    setGathersReload,
  };
};

export const mockUserGather = [
  {
    id: 'mock_user_gather',
    ownerId: 'mock_owner',
    shareId: 'mock_shareId',
    userId: 'user_id',
    category: {
      id: 'category_id',
      title: 'オシャレに飲みたい',
      icon: '🍺',
      stationNames: ['目黒', '麻布十番', '銀座', '六本木'],
      sortIndex: -1,
    },
    colors: [
      'rgba(158,236,54,1)',
      'rgba(20,190,91,1)',
      'rgba(135,53,58,1)',
      'rgba(204,39,230,1)',
      'rgba(68,157,195,1)',
      'rgba(6,3,177,1)',
    ],
    title: '一緒に飲みに行きましょう',
    userRoutes: [
      {
        routes: [
          {
            rideTime: 20,
            stationFrom: '東京',
            stationTo: '目黒',
            transferCount: 0,
          },
          {
            rideTime: 23,
            stationFrom: '東京',
            stationTo: '麻布十番',
            transferCount: 1,
          },
          {
            rideTime: 2,
            stationFrom: '東京',
            stationTo: '銀座',
            transferCount: 0,
          },
          {
            rideTime: 17,
            stationFrom: '東京',
            stationTo: '六本木',
            transferCount: 1,
          },
        ],
        userId: 'nakapon',
        userName: 'なかぽん',
        visible: true,
      },
      {
        routes: [
          {
            rideTime: 20,
            stationFrom: '池袋',
            stationTo: '目黒',
            transferCount: 0,
          },
          {
            rideTime: 26,
            stationFrom: '池袋',
            stationTo: '麻布十番',
            transferCount: 1,
          },
          {
            rideTime: 19,
            stationFrom: '池袋',
            stationTo: '銀座',
            transferCount: 0,
          },
          {
            rideTime: 27,
            stationFrom: '池袋',
            stationTo: '六本木',
            transferCount: 1,
          },
        ],
        userId: 'nakapon2',
        userName: 'なかぽん2',
        visible: false,
      },
    ],
    visible: true,
    updatedTime: Timestamp.fromDate(new Date(2022, 1, 7)),
    createdTime: Timestamp.fromDate(new Date(2022, 1, 7)),
  },
] as Gather[];

export const generateGather = (index: number) => {
  const date = new Date(2022, getRandomNumber(11, 1), getRandomNumber(28, 1));
  return {
    id: `example_${index}`,
    ownerId: 'mock_owner',
    shareId: `share_${index}`,
    userId: `user_id_${index}`,
    category: {
      id: `category_id_${index}`,
      title: 'オシャレに飲みたい',
      icon: '🍺',
      stationNames: ['目黒', '麻布十番', '銀座', '六本木'],
      sortIndex: index,
    },
    colors: Array(getRandomNumber(8, 1)).fill(null).map(getRandomColor),
    title: `一緒に飲みに行きましょう_${index}`,
    userRoutes: [
      {
        routes: [
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '目黒',
            transferCount: getRandomNumber(4),
          },
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '麻布十番',
            transferCount: getRandomNumber(4),
          },
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '銀座',
            transferCount: getRandomNumber(4),
          },
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '六本木',
            transferCount: getRandomNumber(4),
          },
        ],
        userId: `user_id_${index}`,
        userName: 'なかぽん',
        visible: true,
      },
      {
        routes: [
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '目黒',
            transferCount: getRandomNumber(4),
          },
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '麻布十番',
            transferCount: getRandomNumber(4),
          },
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '銀座',
            transferCount: getRandomNumber(4),
          },
          {
            rideTime: getRandomNumber(60),
            stationFrom: '東京',
            stationTo: '六本木',
            transferCount: getRandomNumber(4),
          },
        ],
        userId: `user_id_${index}_2`,
        userName: 'なかぽん2',
        visible: false,
      },
    ],
    visible: true,
    updatedTime: Timestamp.fromDate(date),
    createdTime: Timestamp.fromDate(date),
  } as Gather;
};
