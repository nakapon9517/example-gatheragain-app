import React, { useRef } from 'react';
import { ColorSchemeName, View } from 'react-native';
import { Color, Colors, Layout } from '@/constants';
import { useTheme } from '@/hooks';
import { logger } from '@/utils';
import {
  CategoryRegisterScreen,
  HomeScreen,
  IntroductionScreen,
  NotFoundScreen,
  SettingsScreen,
  GatherScreen,
  GatherEditerScreen,
  GatherPreviewScreen,
  GatherRegisterScreen,
  SharePreviewScreen,
  StationPreviewScreen,
  StationSelectorScreen,
  WebViewScreen,
} from '@/screens';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '@/entities';
import { AppTouchableOpacity, AppView } from '@/appComponents';
import LinkingConfiguration from './LinkingConfiguration';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  const navigationRef = useRef<any>();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => (routeNameRef.current = navigationRef.current.getCurrentRoute().name)}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if (previousRouteName !== currentRouteName) logger.screen(currentRouteName);
        routeNameRef.current = currentRouteName;
      }}
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};
export default Navigation;

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Introduction"
        component={IntroductionScreen}
        initialParams={{ isCategory: false }}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: '設定',
          headerStyle: { backgroundColor: Colors[theme].background },
          headerBackTitle: '戻る',
          headerBackTitleStyle: { fontSize: 16 },
        }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="CategoryRegister"
          component={CategoryRegisterScreen}
          options={{
            headerShown: false,
            contentStyle: { marginTop: 8, backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="GatherEditer"
          component={GatherEditerScreen}
          options={{
            headerShown: false,
            contentStyle: { marginTop: 12, backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="GatherPreview"
          component={GatherPreviewScreen}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="GatherRegister"
          component={GatherRegisterScreen}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: 'transparent',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        />
        <Stack.Screen
          name="SharePreview"
          component={SharePreviewScreen}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="StationPreview"
          component={StationPreviewScreen}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="StationSelector"
          component={StationSelectorScreen}
          options={{
            headerShown: false,
            contentStyle: { marginTop: 12, backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen name="WebView" component={WebViewScreen} options={{ headerShown: false }} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const HEADER_ICON_SIZE = Layout.isLargeDevice ? 36 : 32;
const BOTTOM_ICON_SIZE = Layout.isLargeDevice ? 40 : 32;
const BottomTab = createBottomTabNavigator<RootTabParamList>();
const BottomTabNavigator = () => {
  const { theme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const HeaderBackground = (
    <AppView
      style={{
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
      }}
    />
  );
  const FooterBackground = (
    <AppView
      style={{
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: Colors[theme].border,
      }}
    />
  );

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { height: (Layout.isLargeDevice ? 48 : 40) + top },
        tabBarStyle: { height: (Layout.isLargeDevice ? 60 : 56) + bottom },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: Colors[theme].inactiveTint,
        tabBarInactiveBackgroundColor: Colors[theme].background,
        tabBarActiveTintColor: Colors[theme].icon,
        tabBarActiveBackgroundColor: Colors[theme].background,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ id: '' }}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'ホーム',
          headerBackground: () => HeaderBackground,
          tabBarBackground: () => FooterBackground,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons size={BOTTOM_ICON_SIZE} name="home" color={color} style={{ width: BOTTOM_ICON_SIZE }} />
          ),
          headerRight: ({}) => (
            <View style={{ marginRight: 8, flexDirection: 'row' }}>
              <MaterialIcons
                size={HEADER_ICON_SIZE}
                name="info"
                color={Colors[theme].inactiveTint}
                style={{ marginLeft: 4 }}
                onPress={() => navigation.navigate('Introduction', { isCategory: true })}
              />
              <MaterialIcons
                size={HEADER_ICON_SIZE}
                name="settings"
                color={Colors[theme].inactiveTint}
                style={{ marginLeft: 4 }}
                onPress={() => navigation.navigate('Settings')}
              />
            </View>
          ),
        })}
      />
      <BottomTab.Screen
        name="GatherCreate"
        component={GatherRegisterScreen}
        options={({ navigation }: RootTabScreenProps<'GatherCreate'>) => ({
          title: '新規作成',
          headerBackground: () => HeaderBackground,
          tabBarBackground: () => FooterBackground,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                borderRadius: 99,
                overflow: 'hidden',
                opacity: theme == 'dark' ? 0.98 : 0.95,
                borderWidth: 6,
                borderColor: Colors[theme].background,
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                locations={[0.4, 0.8]}
                colors={Color.brandGradation}
              >
                <AppTouchableOpacity
                  name="gather_register"
                  style={{
                    flex: 1,
                    padding: BOTTOM_ICON_SIZE / 2,
                    borderRadius: 99,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    navigation.navigate('GatherRegister', {
                      gather: undefined,
                    });
                  }}
                >
                  <MaterialIcons
                    size={BOTTOM_ICON_SIZE + 8}
                    name="share"
                    color={Color.brand5}
                    style={{ width: BOTTOM_ICON_SIZE + 8 }}
                  />
                </AppTouchableOpacity>
              </LinearGradient>
            </View>
          ),
        })}
      />
      <BottomTab.Screen
        name="GatherList"
        component={GatherScreen}
        options={({ navigation }: RootTabScreenProps<'GatherList'>) => ({
          title: 'シェア',
          headerBackground: () => HeaderBackground,
          tabBarBackground: () => FooterBackground,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={BOTTOM_ICON_SIZE}
              name="format-list-bulleted"
              color={color}
              style={{ width: BOTTOM_ICON_SIZE }}
            />
          ),
          headerRight: ({}) => (
            <MaterialIcons
              size={HEADER_ICON_SIZE}
              name="settings"
              color={Colors[theme].inactiveTint}
              style={{ marginRight: 8 }}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
};
