import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  AppState,
  ColorSchemeName,
  ImageProps,
  LogBox,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
  StatusBar as DefaultStatusBar,
} from 'react-native';
import { Color } from '@/constants';
import { useUpdateUser, useUser } from '@/hooks';
import { auth } from '@/utils/Firebase';
import Navigation from '@/navigation';
import AppContext from '@/contexts/AppContext';
import { Category, Settings } from '@/entities';
import { logger, Storage, StorageName } from '@/utils';
import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AppLoading from 'expo-app-loading';
import * as Admob from 'expo-ads-admob';
import * as Linking from 'expo-linking';
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInAnonymously } from 'firebase/auth';
import { enableScreens } from 'react-native-screens';

LogBox.ignoreAllLogs();

enableScreens();

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export default function App() {
  const updateUser = useUpdateUser();
  const [userAuth, loading] = useAuthState(auth);
  const defaultTheme = useColorScheme() as NonNullable<ColorSchemeName>;
  const [theme, setTheme] = useState<'light' | 'dark'>();
  const [categories, setCategories] = useState<Category[]>();
  const [userInfo, setUserInfo] = useState<Settings>({ visibleStation: true, isDefaultTheme: true });
  const [gathersReload, setGathersReload] = useState(false);
  const [isIntfoductionDone, setIntfoductionDone] = useState(false);
  const { getUser, registerForPushNotifications } = useUser();

  useEffect(() => {
    if (!isIntfoductionDone) {
      Admob.requestPermissionsAsync().then((res) => logger.action('req_permission_admob', res.status));
      Notifications.requestPermissionsAsync().then((res) => logger.action('req_permission_notification', res.status));
    }
  }, [isIntfoductionDone]);

  const handleUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert('アップデートがあります', 'アプリを再起動します', [
          { text: 'OK', onPress: () => Updates.reloadAsync() },
        ]);
      }
    } catch (error: any) {
      logger.error(error);
    }
  };

  useEffect(() => {
    const storage = new Storage();
    storage.get(StorageName.Introduction).then((val: boolean) => setIntfoductionDone(val));
    storage.get(StorageName.THEME).then((val: 'light' | 'dark') => setTheme(val));
    storage.get(StorageName.USER).then((val: Settings) => setUserInfo(val));
    storage
      .get(StorageName.CAGEGORY)
      .then((vals: Category[]) => setCategories(vals?.length ? vals : [defaultCategory]));
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleUpdate);
    Linking.addEventListener('url', (event) => {
      logger.screen(Linking.parse(event.url).path ?? '');
    });
    return () => {
      AppState.removeEventListener('change', handleUpdate);
      Linking.addEventListener('url', () => {});
    };
  }, []);

  useEffect(() => {
    const responseReceivedListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const content = response.notification.request.content;
      const shareId = content.data.shareId ? String(content.data.shareId) : undefined;
      if (shareId) {
        logger.action('tap_push', shareId);
        Linking.openURL(Linking.createURL('share/preview', { queryParams: { shareId } }));
      }
    });
    const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
      const content = notification.request.content;
      const shareId = content.data.shareId ? String(content.data.shareId) : undefined;
      if (shareId) {
        logger.action('tap_push', shareId);
        Linking.openURL(Linking.createURL('share/preview', { queryParams: { shareId } }));
      }
    });
    const pushTokenListener = Notifications.addPushTokenListener(
      () => userAuth?.uid && registerDevicePushTokenAsync(userAuth.uid),
    );

    return () => {
      Notifications.removeNotificationSubscription(responseReceivedListener);
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removePushTokenSubscription(pushTokenListener);
    };
  }, []);

  const registerDevicePushTokenAsync = (userId: string) => {
    registerForPushNotifications().then((expoToken) => {
      getUser(userId).then((user) => {
        if (expoToken && (!user || user.expoToken != expoToken)) {
          logger.action('expoToken', expoToken);
          updateUser.call({ expoToken });
          setUserInfo({ ...userInfo, canExpoToken: true });
        }
      });
    });
  };

  useEffect(() => {
    if (loading) return;
    if (userAuth && userAuth.uid) {
      logger.set(userAuth);
      registerDevicePushTokenAsync(userAuth.uid);
    } else {
      signInAnonymously(auth)
        .then((res) => {
          const uid = res.user?.uid;
          logger.action('signIn', uid);
          registerDevicePushTokenAsync(uid);
        })
        .catch(logger.error);
    }
  }, [userAuth, loading]);

  return (
    <AnimatedAppLoader image={require('@/assets/splash.png')}>
      <SafeAreaProvider style={{ flex: 1, paddingTop: Platform.OS == 'android' ? DefaultStatusBar.currentHeight : 0 }}>
        <AppContext.Provider
          value={{
            theme,
            setTheme,
            categories,
            setCategories,
            userInfo,
            setUserInfo,
            gathersReload,
            setGathersReload,
            isIntfoductionDone,
            setIntfoductionDone,
          }}
        >
          <Navigation colorScheme={userInfo?.isDefaultTheme ? defaultTheme : theme ?? defaultTheme} />
        </AppContext.Provider>
        <StatusBar
          style={(userInfo?.isDefaultTheme ? defaultTheme : theme ?? defaultTheme) === 'dark' ? 'light' : 'dark'}
        />
      </SafeAreaProvider>
    </AnimatedAppLoader>
  );
}

const AnimatedAppLoader = ({ children, image }: { children: React.ReactNode; image: string }) => {
  const [isSplashReady, setSplashReady] = useState(false);

  const startAsync = useCallback(async () => {
    Asset.fromModule(require('@/assets/splash.png'));

    Asset.fromModule(require('@/assets/images/intros/5inchs/regist-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/regist-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/create-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/create-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/create-3-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/update-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/update-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/5inchs/update-3-min.png'));

    Asset.fromModule(require('@/assets/images/intros/6inchs/regist-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/regist-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/create-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/create-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/create-3-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/update-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/update-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/6inchs/update-3-min.png'));

    Asset.fromModule(require('@/assets/images/intros/12inchs/regist-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/regist-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/create-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/create-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/create-3-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/update-1-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/update-2-min.png'));
    Asset.fromModule(require('@/assets/images/intros/12inchs/update-3-min.png'));
  }, [image]);

  const onFinish = useCallback(() => setSplashReady(true), []);

  return isSplashReady ? (
    <AnimatedSplashScreen image={require('@/assets/splash.png')}>{children}</AnimatedSplashScreen>
  ) : (
    <AppLoading autoHideSplash={false} startAsync={startAsync} onError={logger.error} onFinish={onFinish} />
  );
};

const AnimatedSplashScreen = ({ children, image }: { children: React.ReactNode; image: ImageProps }) => {
  const fadeOut = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      logger.error(e as Error);
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: fadeOut }]}>
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            locations={[0.4, 0.8]}
            colors={Color.brandGradation}
          >
            <Animated.Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: Constants.manifest?.splash?.resizeMode || 'contain',
                opacity: fadeOut,
              }}
              source={image}
              onLoadEnd={onImageLoaded}
              fadeDuration={0}
            />
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const defaultCategory = {
  id: 'default_category_id',
  sortIndex: 0,
  title: 'オシャレに飲みたい',
  icon: '🍺',
  stations: [
    {
      companyName: '東京地下鉄',
      latitude: 35.63177,
      longitude: 139.7159,
      routeName: '南北線',
      stationName: '目黒',
      transfers: [
        { companyName: '東京都交通局', routeName: '三田線' },
        { companyName: '東急電鉄', routeName: '東急目黒線' },
        { companyName: '東日本旅客鉄道', routeName: '山手線' },
      ],
    },
    {
      companyName: '東京地下鉄',
      latitude: 35.65408,
      longitude: 139.73694,
      routeName: '南北線',
      stationName: '麻布十番',
      transfers: [{ companyName: '東京都交通局', routeName: '大江戸線' }],
    },
    {
      companyName: '東京地下鉄',
      latitude: 35.67205,
      longitude: 139.76391,
      routeName: '日比谷線',
      stationName: '銀座',
      transfers: [
        { companyName: '東京地下鉄', routeName: '銀座線' },
        { companyName: '東京地下鉄', routeName: '丸ノ内線' },
      ],
    },
    {
      companyName: '東京地下鉄',
      latitude: 35.66325,
      longitude: 139.73206,
      routeName: '日比谷線',
      stationName: '六本木',
      transfers: [{ companyName: '東京都交通局', routeName: '大江戸線' }],
    },
    {
      companyName: '東京地下鉄',
      latitude: 35.6469,
      longitude: 139.70864,
      routeName: '日比谷線',
      stationName: '恵比寿',
      transfers: [{ companyName: '東日本旅客鉄道', routeName: '山手線' }],
    },
  ],
} as Category;
