import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gather, RootStackScreenProps, ScreenType } from '@/entities';
import { useTheme, useUpdateGather, useUserGather, useUserInfo } from '@/hooks';
import { AppBorder, AppSwitch, AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import { Indicator } from '@/components';
import { auth } from '@/utils/Firebase';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MaterialIcons } from '@expo/vector-icons';

const INPUT_MIN_SIZE = Layout.isLargeDevice ? 200 : 160;
export const GatherEditerScreen = ({ navigation, route }: RootStackScreenProps<'GatherEditer'>): JSX.Element => {
  const [userAuth] = useAuthState(auth);
  const gather = route.params.gather as Gather;
  const currentUser = gather.userRoutes.find((v) => v.userId == userAuth?.uid);
  const updateGather = useUpdateGather();
  const { loading, setGathersReload } = useUserGather();
  const { theme } = useTheme();
  const { userInfo } = useUserInfo();
  const { bottom } = useSafeAreaInsets();
  const [title, setTitle] = useState<string>(gather.title);
  const [name, setName] = useState<string | undefined>(currentUser?.userName ?? userInfo.name);
  const [nearestStation, setNearestStation] = useState<string | undefined>(
    currentUser?.routes[0].stationFrom ?? userInfo.nearestStation,
  );
  const [visible, setVisible] = useState(true);
  const [visibleAll, setVisibleAll] = useState(gather.visible);
  const width = useMemo(() => new Animated.Value(Math.max((name?.length ?? 7) * FontSize.middle, INPUT_MIN_SIZE)), []);

  useEffect(() => {
    if (route.params.station?.stationName) setNearestStation(route.params.station?.stationName);
  }, [route.params]);

  const onChangeTextName = (text: string) => {
    Animated.timing(width, {
      toValue: Math.max(text.length * FontSize.middle, INPUT_MIN_SIZE),
      duration: 200,
      useNativeDriver: false,
    }).start();
    setName(text);
  };

  const onPressAddNearest = () => {
    navigation.navigate('StationSelector', {
      id: '',
      title: '',
      icon: '',
      maxSelectSize: 1,
      stations: [],
      type: ScreenType.GatherEditer,
      gather,
    });
  };

  const onPressUpdate = async () => {
    if (!title) {
      Alert.alert('入力エラー', 'タイトルを入力してください');
      return;
    }
    if (!name) {
      Alert.alert('入力エラー', 'ニックネームを入力してください');
      return;
    }
    if (!nearestStation) {
      Alert.alert('選択エラー', '最寄駅を選択してください');
      return;
    }

    await updateGather.call({
      shareId: gather.shareId,
      title,
      userRoute: {
        userName: name,
        visible,
        routeName: nearestStation,
      },
      visible: visibleAll,
    });
    setGathersReload(true);
    navigation.pop();
    navigation.navigate('Root', { screen: 'GatherList' });
  };

  return (
    <AppView style={styles.container}>
      <Indicator loading={updateGather.loading || loading} size="large" />
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={gather.colors ?? Color.brandGradation}
        style={styles.header}
      >
        <Text style={styles.title}>更新</Text>
      </LinearGradient>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Layout.isLargeDevice ? 120 : 80}
      >
        <ScrollView
          style={styles.body}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingBottom: 120 }}>
            <View style={styles.row}>
              <AppText style={styles.label}>タイトル</AppText>
              <TextInput
                value={title}
                maxLength={12}
                style={[styles.inputTitle, { color: Colors[theme].text }]}
                onChangeText={setTitle}
                placeholder="タイトル"
                editable={userAuth?.uid == gather.ownerId}
                placeholderTextColor={Colors[theme].inactiveTint}
              />
              {userAuth?.uid == gather.ownerId ? (
                <MaterialIcons size={FontSize.small} name="edit" color={Colors[theme].icon} />
              ) : (
                <></>
              )}
            </View>
            <AppBorder />
            <View style={styles.row}>
              <AppText style={styles.label}>駅</AppText>
              <View style={styles.stationWrapper}>
                {gather.category.stationNames.map((v, i) => (
                  <AppView key={`station-${i}`} style={[styles.station, { borderColor: Colors[theme].border }]}>
                    <MaterialIcons name="train" size={FontSize.small} color={Colors[theme].description} />
                    <AppText style={styles.stationText}>{v}</AppText>
                  </AppView>
                )) ?? <></>}
              </View>
            </View>
            <AppBorder />
            <View style={[styles.row, { justifyContent: 'flex-start' }]}>
              <AppText style={styles.label}>参加情報</AppText>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Animated.View style={{ width: width.interpolate({ inputRange: [0, 200], outputRange: [0, 200] }) }}>
                    <TextInput
                      value={name}
                      onChangeText={onChangeTextName}
                      style={{
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: Colors[theme].border,
                        borderRadius: 8,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        marginBottom: 4,
                        color: Colors[theme].text,
                      }}
                      maxLength={12}
                      placeholder="ニックネーム"
                      placeholderTextColor={Colors[theme].inactiveTint}
                    />
                  </Animated.View>
                  <AppTouchableOpacity
                    name="gather_station_selector"
                    style={{
                      minWidth: INPUT_MIN_SIZE,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderRadius: 8,
                      borderColor: Color.brand80,
                    }}
                    onPress={onPressAddNearest}
                  >
                    <AppText style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {nearestStation ?? '最寄駅を選択する'}
                    </AppText>
                  </AppTouchableOpacity>
                </View>
              </View>
            </View>
            <AppBorder />
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <AppText style={[styles.label, { width: '70%' }]}>自分の最寄駅を表示する</AppText>
              <AppSwitch value={visible} onValueChange={(v) => setVisible(v)} />
            </View>
            {userAuth?.uid == gather.ownerId ? (
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <AppText style={[styles.label, { width: '70%' }]}>全員の最寄駅を表示する</AppText>
                <AppSwitch value={visibleAll} onValueChange={(v) => setVisibleAll(v)} />
              </View>
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.footer, { marginBottom: bottom }]}>
        <AppTouchableOpacity
          name="gather_register_close"
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <AppText style={styles.buttonText}>閉じる</AppText>
        </AppTouchableOpacity>
        <AppTouchableOpacity name="gather_register_decision" style={styles.button} onPress={onPressUpdate}>
          <AppText style={[styles.buttonText, { color: Color.white }]}>更新</AppText>
        </AppTouchableOpacity>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.isLargeDevice ? 120 : 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: Color.brand5,
  },
  body: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  stationWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    width: '70%',
    flexDirection: 'row',
  },
  label: {
    fontSize: FontSize.middle,
    width: '30%',
    padding: 12,
  },
  inputTitle: {
    flex: 1,
    fontSize: FontSize.middle,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  footer: {
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
  },
  button: {
    flex: 3,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: Color.brand80,
  },
  closeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  station: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 6,
    marginRight: 8,
    marginVertical: Layout.isLargeDevice ? 12 : 8,
    borderBottomWidth: 1,
  },
  stationText: {
    fontSize: FontSize.small,
    marginLeft: 2,
  },
});
