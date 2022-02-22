import { Platform } from 'react-native';
import { User } from '@/entities';
import { db } from '@/utils/Firebase';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { doc, getDoc } from 'firebase/firestore';
import { Color } from '@/constants';

export const useUser = () => {
  const getUser = async (userId: string) => {
    const snapshot = await getDoc(doc(db, `users/${userId}`));
    if (snapshot.exists()) {
      return snapshot.data() as Omit<User, 'gathers'>;
    } else {
      return undefined;
    }
  };

  return { getUser, registerForPushNotifications };
};

const isPermissionPushNotification = async (): Promise<boolean> => {
  let finalStatus = '';
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  }
  return finalStatus == 'granted';
};

const registerForPushNotifications = async (): Promise<string | undefined> => {
  if (await isPermissionPushNotification()) {
    return (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: null,
      lightColor: Color.pink30,
    });
  }
};
