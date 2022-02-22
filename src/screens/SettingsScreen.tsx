import { useMemo, useState } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { requestStoreReview } from '@/utils';
import { useTheme, useUserInfo } from '@/hooks';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { AppBorder, AppSwitch, AppText, AppTouchableOpacity, AppView, ViewProps } from '@/appComponents';
import { RootStackScreenProps, ScreenType } from '@/entities';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import Ripple from 'react-native-material-ripple';

type SectionHeaderProps = {
  title: string;
} & ViewProps;
const SectionHeader = (props: SectionHeaderProps) => {
  return (
    <View style={[styles.header, props.style]}>
      <AppText style={styles.title}>{props.title}</AppText>
      <AppBorder style={{ marginVertical: 8 }} />
    </View>
  );
};

const PADDING = Layout.isLargeDevice ? 24 : 16;
const INPUT_MIN_SIZE = Layout.isLargeDevice ? 200 : 126;
export const SettingsScreen = ({ navigation }: RootStackScreenProps<'Settings'>): JSX.Element => {
  const { userInfo, saveUserInfo } = useUserInfo();
  const { theme, saveTheme } = useTheme();
  const [developModePressCount, setDevelopModePressCount] = useState<number>(0);
  const width = useMemo(
    () => new Animated.Value(Math.max((userInfo.name?.length ?? 7) * FontSize.middle, INPUT_MIN_SIZE)),
    [],
  );

  const onChangeTextName = (text: string) => {
    Animated.timing(width, {
      toValue: Math.max(text.length * FontSize.middle, INPUT_MIN_SIZE),
      duration: 200,
      useNativeDriver: false,
    }).start();
    saveUserInfo({ ...userInfo, name: text });
  };

  const onValueChangeDefaultTheme = (isDefaultTheme: boolean) => {
    saveUserInfo({ ...userInfo, isDefaultTheme });
  };

  const onPressNearestSelector = () => {
    navigation.navigate('StationSelector', {
      id: '',
      title: '',
      icon: '',
      maxSelectSize: 1,
      stations: [],
      type: ScreenType.Settings,
    });
  };

  const onPressFuncRequest = () => {
    navigation.navigate('WebView', {
      title: 'ご意見・ご要望',
      uri: 'https://www.google.com/',
    });
  };

  const onPressStoreReview = async () => {
    await requestStoreReview();
  };

  return (
    <AppView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <SectionHeader title="ユーザー情報" style={{ marginTop: PADDING }} />
        <View style={styles.row}>
          <AppText style={styles.label}>名前</AppText>
          <Animated.View
            style={{
              width: width.interpolate({
                inputRange: [0, 200],
                outputRange: [0, 200],
              }),
            }}
          >
            <TextInput
              value={userInfo.name}
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
        </View>
        <View style={styles.row}>
          <AppText style={styles.label}>最寄駅</AppText>
          <AppTouchableOpacity
            name="setting_station_selector"
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
            onPress={onPressNearestSelector}
          >
            <AppText style={{ fontSize: 16, fontWeight: 'bold' }}>{userInfo.nearestStation ?? '選択する'}</AppText>
          </AppTouchableOpacity>
        </View>
        <View style={styles.row}>
          <View>
            <AppText style={styles.label}>最寄駅を表示する</AppText>
            <AppText style={[styles.description, { color: Colors[theme].description }]}>
              共有の際に最寄駅を表示する
            </AppText>
          </View>
          <AppSwitch
            value={userInfo.visibleStation}
            onValueChange={(v) => saveUserInfo({ ...userInfo, visibleStation: v })}
          />
        </View>
        <SectionHeader title="ダークモード" />
        <View style={styles.row}>
          <AppText style={styles.label}>ダークモード</AppText>
          <AppSwitch
            disabled={userInfo.isDefaultTheme}
            value={theme === 'dark'}
            onValueChange={(v) => saveTheme(v ? 'dark' : 'light')}
          />
        </View>
        <View style={styles.row}>
          <View>
            <AppText style={styles.label}>システム</AppText>
            <AppText style={[styles.description, { color: Colors[theme].description }]}>
              端末のシステム設定を反映します
            </AppText>
          </View>
          <AppSwitch value={userInfo.isDefaultTheme} onValueChange={onValueChangeDefaultTheme} />
        </View>
        <SectionHeader title="その他" />
        <View
          style={{
            flex: 1,
            marginHorizontal: Layout.isLargeDevice ? 48 : 24,
            marginBottom: 4,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ripple
            style={[styles.button, { borderColor: Colors[theme].border }]}
            rippleContainerBorderRadius={12}
            rippleColor={Color.brand80}
            onPress={() =>
              navigation.navigate('WebView', {
                title: '利用規約',
                uri: 'https://www.google.com/',
              })
            }
          >
            <MaterialCommunityIcons
              name="handshake"
              style={[styles.buttonIcon, { transform: [{ rotate: '45deg' }] }]}
              color={Colors[theme].text}
            />
            <AppText style={styles.buttonText}>利用規約</AppText>
          </Ripple>
          <View style={{ width: 8 }} />
          <Ripple
            style={[styles.button, { borderColor: Colors[theme].border }]}
            rippleContainerBorderRadius={12}
            rippleColor={Color.brand80}
            onPress={() => navigation.navigate('Introduction', { isCategory: false })}
          >
            <MaterialIcons name="queue-play-next" style={styles.buttonIcon} color={Colors[theme].text} />
            <AppText style={styles.buttonText}>使い方</AppText>
          </Ripple>
        </View>
        <View style={styles.buttonGroup}>
          <Ripple
            style={[styles.button, { borderColor: Colors[theme].border }]}
            rippleContainerBorderRadius={12}
            rippleColor={Color.brand80}
            onPress={() =>
              navigation.navigate('WebView', {
                title: 'プライバシーポリシー',
                uri: 'https://www.google.com/',
              })
            }
          >
            <MaterialIcons name="privacy-tip" style={styles.buttonIcon} color={Colors[theme].text} />
            <AppText style={styles.buttonText}>プライバシーポリシー</AppText>
          </Ripple>
          <Ripple
            style={[styles.button, { borderColor: Colors[theme].border }]}
            rippleContainerBorderRadius={12}
            rippleColor={Color.brand80}
            onPress={onPressFuncRequest}
          >
            <MaterialIcons name="phone-iphone" style={styles.buttonIcon} color={Colors[theme].text} />
            <AppText style={styles.buttonText}>ご意見・ご要望はこちらまで</AppText>
          </Ripple>
          <Ripple
            style={[styles.button, { borderColor: Colors[theme].border }]}
            rippleContainerBorderRadius={12}
            rippleColor={Color.brand80}
            onPress={onPressStoreReview}
          >
            <MaterialIcons name="record-voice-over" style={styles.buttonIcon} color={Colors[theme].text} />
            <AppText style={styles.buttonText}>ストアレビューを送る</AppText>
          </Ripple>
        </View>
        <AppTouchableOpacity
          name="setting_version"
          id={String(developModePressCount)}
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 24,
          }}
          onPress={() => setDevelopModePressCount(developModePressCount + 1)}
          activeOpacity={1}
        >
          <AppText style={[styles.version, { color: Colors[theme].description }]}>{`バージョン ${
            Constants.manifest?.version
          }(${
            Platform.OS == 'ios' ? Constants.manifest?.ios?.buildNumber : Constants.manifest?.android?.versionCode
          })`}</AppText>
          <AppText style={[styles.version, { color: Colors[theme].description }]}>
            {developModePressCount > 6 ? Updates.releaseChannel : ''}
          </AppText>
        </AppTouchableOpacity>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    textAlign: 'center',
  },
  header: {
    width: '100%',
    paddingHorizontal: PADDING / 2,
    marginTop: 32,
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.isLargeDevice ? 8 : 4,
    paddingHorizontal: PADDING + 8,
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    paddingHorizontal: PADDING / 2,
  },
  label: {
    fontSize: FontSize.middle,
  },
  description: {
    fontSize: FontSize.small,
    marginTop: 2,
  },
  version: {
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Layout.isLargeDevice ? 48 : 24,
  },
  button: {
    flex: 1,
    paddingVertical: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    fontSize: FontSize.large,
    textAlign: 'center',
  },
  buttonText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
});
