import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Category, RootStackScreenProps, ScreenType } from '@/entities';
import { useCategory, useTheme } from '@/hooks';
import { AppBorder, AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUUIDV4 } from '@/utils';

export const CategoryRegisterScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'CategoryRegister'>): JSX.Element => {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { categories, setCategories } = useCategory();
  const id = route.params.id;
  const [title, setTitle] = useState<string>(route.params.title);
  const [icon, setIcon] = useState<Category['icon']>(route.params.icon);
  const [stations, setStations] = useState<Category['stations']>(route.params.stations);

  useEffect(() => {
    setStations(route.params.stations);
  }, [route.params]);

  const onPressAdd = () => {
    Keyboard.dismiss();
    navigation.navigate('StationSelector', {
      id: '',
      title,
      icon: icon,
      maxSelectSize: route.params.maxSelectSize,
      stations,
      type: ScreenType.Category,
    });
  };

  const onRegister = () => {
    if (!title) {
      Alert.alert('入力エラー', 'タイトルは入力必須です');
      return;
    }
    if (icon && icon.length > 2) {
      Alert.alert('入力エラー', 'アイコンは１文字のみ入力可能です');
      return;
    }
    if (!stations.length) {
      Alert.alert('選択エラー', '駅を1つ以上選択してください');
      return;
    }

    const newCategory = {
      id: id || getUUIDV4(),
      sortIndex: categories.sort((a, b) => a.sortIndex - b.sortIndex)[0]?.sortIndex + 1 ?? 0,
      title,
      icon,
      stations,
    };

    if (categories.find((v) => v.id === newCategory.id)) {
      setCategories(categories.map((v) => (v.id == newCategory.id ? newCategory : v)));
    } else {
      setCategories([...categories, newCategory]);
    }
    navigation.navigate('Root', { screen: 'Home', params: { id: newCategory.id } });
  };

  return (
    <AppView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{id ? '更新' : '新規作成'}</Text>
      </View>
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
            <AppText style={styles.label}>アイコン</AppText>
            <TextInput
              value={icon ?? undefined}
              maxLength={12}
              style={[styles.inputIcon, { color: Colors[theme].text }]}
              onChangeText={setIcon}
              placeholder="絵文字"
              placeholderTextColor={Colors[theme].inactiveTint}
            />
          </View>
          <AppBorder />
          <View style={styles.stations}>
            <View style={{ width: '100%' }}>
              <AppText style={styles.label}>駅</AppText>
            </View>
            <View style={styles.stationWrapper}>
              <AppTouchableOpacity
                name="category_station_select"
                style={[styles.addButton, { backgroundColor: Colors[theme].inactiveTint }]}
                onPress={onPressAdd}
              >
                <MaterialIcons name="add" size={24} color={Colors[theme].shadowColor} />
                <AppText style={[styles.stationText, { color: Colors[theme].shadowColor, fontWeight: 'bold' }]}>
                  追加
                </AppText>
              </AppTouchableOpacity>
              {stations.map((v, index) => (
                <AppTouchableOpacity
                  key={`station-${index}`}
                  name="category_station_remove"
                  style={[styles.station, { borderColor: Colors[theme].border }]}
                  onPress={() => setStations(stations.filter((_, i) => i !== index))}
                >
                  <AppText style={styles.stationText}>{v.stationName}</AppText>
                  <MaterialIcons name="close" size={16} color={Colors[theme].inactiveTint} />
                </AppTouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <AppTouchableOpacity
          name="category_register_close"
          style={[styles.closeButton, { marginBottom: bottom }]}
          onPress={() => navigation.goBack()}
        >
          <AppText style={styles.buttonText}>閉じる</AppText>
        </AppTouchableOpacity>
        <AppTouchableOpacity
          name="category_register_decision"
          style={[styles.button, { marginBottom: bottom }]}
          onPress={onRegister}
        >
          <AppText style={[styles.buttonText, { color: Color.white }]}>登録する</AppText>
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
    height: Layout.isLargeDevice ? 120 : 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Color.brand70,
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
    marginVertical: 4,
  },
  stations: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 4,
  },
  stationWrapper: {
    flex: 1,
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
  inputIcon: {
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
  addButton: {
    width: 88,
    paddingVertical: 12,
    margin: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: FontSize.middle,
    fontWeight: 'bold',
    marginRight: 2,
  },
  station: {
    margin: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 8,
  },
  stationText: {
    fontSize: FontSize.small,
    marginRight: 2,
  },
});
