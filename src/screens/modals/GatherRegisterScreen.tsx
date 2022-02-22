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
import { Category, RootStackScreenProps, ScreenType } from '@/entities';
import { useCategory, useCreateGather, useUserGather, useTheme, useUserInfo } from '@/hooks';
import { AppBorder, AppSwitch, AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import { DropDown, Indicator } from '@/components';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { getRandomColor, getRandomNumber, requestStoreReview } from '@/utils';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const INPUT_MIN_SIZE = Layout.isLargeDevice ? 200 : 160;
const headerAnimation1 = { 0: { opacity: 0.62 }, 1: { opacity: 1 } };
const headerAnimation2 = { 0: { opacity: 0.64 }, 1: { opacity: 1 } };

export const GatherRegisterScreen = ({ navigation, route }: RootStackScreenProps<'GatherRegister'>): JSX.Element => {
  const { getGathers } = useUserGather();
  const { loading, call } = useCreateGather();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { userInfo } = useUserInfo();
  const { categories, setCategories } = useCategory();
  const [colors, setColors] = useState<string[]>(Color.brandGradation);
  const [title, setTitle] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>(categories[0]?.id ?? undefined);
  const [name, setName] = useState<string | undefined>(userInfo.name);
  const [nearestStation, setNearestStation] = useState<string | undefined>(userInfo.nearestStation);
  const [visible, setVisible] = useState(true);
  const [visibleAll, setVisibleAll] = useState(true);
  const [toggle, setToggle] = useState(false);
  const width = useMemo(() => new Animated.Value(Math.max((name?.length ?? 7) * FontSize.middle, INPUT_MIN_SIZE)), []);

  useEffect(() => {
    if (route.params.station?.stationName) setNearestStation(route.params.station?.stationName);
  }, [route.params]);

  const onPressChangeColor = () => {
    Haptics.selectionAsync();
    setToggle(!toggle);
    setColors(Array(getRandomNumber(8, 1)).fill(null).map(getRandomColor));
  };

  const onClickCategory = (id: string) => {
    Haptics.selectionAsync();
    setSelectedId(id);
  };

  const onPressEdit = (category: Category) => {
    setTimeout(
      () =>
        navigation.navigate('CategoryRegister', {
          ...category,
          maxSelectSize: 12,
        }),
      600,
    );
  };

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
      type: ScreenType.Gather,
    });
  };

  const onRegister = async () => {
    if (!title) {
      Alert.alert('入力エラー', 'タイトルを入力してください');
      return;
    }
    const targetCategory = categories.find((v) => v.id === selectedId);
    if (!targetCategory) {
      Alert.alert('選択エラー', '目的を選択してください');
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

    navigation.navigate('Root', { screen: 'GatherList' });

    // Firebase非接続環境では動かない
    // const response = await call({
    //   category: {
    //     title: targetCategory.title,
    //     icon: targetCategory.icon,
    //     stationNames: targetCategory.stations.map((v) => v.stationName),
    //   },
    //   colors,
    //   title,
    //   userRoute: {
    //     userName: name,
    //     visible,
    //     routeName: nearestStation,
    //   },
    //   visible: visibleAll,
    // });
    // const gathers = await getGathers();
    // const gather = gathers.find((v) => v.id == response.id);
    // navigation.pop();
    // navigation.push('Root', { screen: 'GatherList' });
    // if (gather) {
    //   navigation.navigate('GatherPreview', { gather });
    //   if (gathers.length % 3 == 0) await requestStoreReview();
    // }
  };

  return (
    <AppView style={styles.container}>
      <Indicator loading={loading} size="large" />
      <Animatable.View animation={toggle ? headerAnimation1 : headerAnimation2} duration={600}>
        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={colors} style={styles.header}>
          <Text style={styles.title}>新規作成</Text>
          <AppTouchableOpacity
            name="change_color"
            style={[styles.colors, { backgroundColor: Colors[theme].transBackground }]}
            onPress={onPressChangeColor}
          >
            <MaterialIcons size={FontSize.small} name="color-lens" color={Colors[theme].icon} />
            <Text style={{ color: Colors[theme].icon, fontSize: FontSize.small, marginLeft: 4 }}>カラー変更</Text>
          </AppTouchableOpacity>
        </LinearGradient>
      </Animatable.View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Layout.isLargeDevice ? 120 : 100}
      >
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 120 }}>
            <View style={styles.row}>
              <AppText style={styles.label}>タイトル</AppText>
              <TextInput
                value={title}
                maxLength={12}
                style={[styles.inputTitle, { color: Colors[theme].text }]}
                onChangeText={setTitle}
                placeholder="タイトル"
                placeholderTextColor={Colors[theme].inactiveTint}
              />
            </View>
            <AppBorder />
            <View style={styles.row}>
              <AppText style={styles.label}>目的</AppText>
              <DropDown
                activeId={selectedId}
                categories={categories}
                shadowOpacity={0.2}
                categoryFontSize={FontSize.small}
                onPressCategory={onClickCategory}
                onPressEdit={onPressEdit}
                setCategories={setCategories}
              />
            </View>
            <AppBorder />
            <View style={styles.row}>
              <AppText style={styles.label}>駅</AppText>
              <View style={styles.stationWrapper}>
                {categories
                  .find((v) => v.id == selectedId)
                  ?.stations.map((v, i) => (
                    <AppView key={`station-${i}`} style={[styles.station, { borderColor: Colors[theme].border }]}>
                      <MaterialIcons name="train" size={FontSize.small} color={Colors[theme].description} />
                      <AppText style={styles.stationText}>{v.stationName}</AppText>
                    </AppView>
                  )) ?? <></>}
              </View>
            </View>
            <AppBorder />
            <View style={[styles.row, { justifyContent: 'flex-start' }]}>
              <AppText style={styles.label}>参加者</AppText>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Animated.View style={{ width: width.interpolate({ inputRange: [0, 200], outputRange: [0, 200] }) }}>
                    <TextInput
                      value={name}
                      onChangeText={onChangeTextName}
                      style={{
                        fontSize: FontSize.small,
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
                    <AppText style={{ fontSize: FontSize.small, fontWeight: 'bold' }}>
                      {nearestStation ?? '最寄駅を選択する'}
                    </AppText>
                  </AppTouchableOpacity>
                </View>
              </View>
            </View>
            <AppBorder />
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <AppText style={[styles.label, { width: '70%' }]}>全員の最寄駅を表示する</AppText>
              <AppSwitch value={visibleAll} onValueChange={(v) => setVisibleAll(v)} />
            </View>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <AppText style={[styles.label, { width: '70%' }]}>自分の最寄駅を表示する</AppText>
              <AppSwitch value={visible} onValueChange={(v) => setVisible(v)} />
            </View>
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
        <AppTouchableOpacity name="gather_register_decision" style={styles.button} onPress={onRegister}>
          <AppText style={[styles.buttonText, { color: Color.white }]}>新規作成</AppText>
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
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.isLargeDevice ? 120 : 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: Color.brand5,
  },
  colors: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingVertical: Layout.isLargeDevice ? 12 : 8,
    paddingHorizontal: Layout.isLargeDevice ? 16 : 12,
    borderRadius: 99,
    opacity: 0.8,
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
