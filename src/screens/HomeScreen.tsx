import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Merker } from '@/components';
import { AppView } from '@/appComponents';
import { useCategory, useIntroduction } from '@/hooks';
import { Category, RootTabScreenProps } from '@/entities';
import { DropDown } from '@/components';
import * as Haptics from 'expo-haptics';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

// 東京駅周辺の緯度軽度
const DEFAULT_LAT = 35.6840506;
const DEFAULT_LONG = 139.7651744;
const MAX_CATEGORY_SIZE = 12;

export const HomeScreen = ({ navigation, route }: RootTabScreenProps<'Home'>) => {
  const { isIntfoductionDone } = useIntroduction();
  const { categories, setCategories } = useCategory();
  const [showLatitude, setShowLatitude] = useState(DEFAULT_LAT);
  const [showLongitude, setShowLongitude] = useState(DEFAULT_LONG);
  const [showLatitudeDelta, setShowLatitudeDelta] = useState(0.06);
  const [showLongitudeDelta, setShowLongitudeDelta] = useState(0.06);
  const [selectedId, setSelectedId] = useState<string>(categories[0]?.id ?? undefined);
  const selectedCategory = categories.find((v) => v.id == selectedId);

  useEffect(() => {
    if (!isIntfoductionDone) navigation.navigate('Introduction', { isCategory: false });
  }, [isIntfoductionDone]);

  useEffect(() => {
    if (route.params.id) setSelectedId(route.params.id);
  }, [route.params.id]);

  useEffect(() => {
    setShowLatitude(selectedCategory?.stations[0].latitude ?? DEFAULT_LAT);
    setShowLongitude(selectedCategory?.stations[0].longitude ?? DEFAULT_LONG);
  }, [selectedId]);

  const onRegionChange = useCallback((region: Region) => {
    setShowLatitudeDelta(region.latitudeDelta);
    setShowLongitudeDelta(region.longitudeDelta);
  }, []);

  const onClickMarker = useCallback(
    (index: number) => {
      Haptics.selectionAsync();
      if (!selectedCategory) {
        Alert.alert('この駅は選択できません');
      } else {
        navigation.navigate('StationPreview', {
          station: selectedCategory.stations[index],
        });
      }
    },
    [selectedCategory],
  );

  const onPressAddCategory = useCallback(() => {
    Haptics.selectionAsync();
    if (MAX_CATEGORY_SIZE <= categories.length) {
      Alert.alert(`集合目的は合計${MAX_CATEGORY_SIZE}個まで登録可能です`);
      return;
    }
    navigation.navigate('CategoryRegister', {
      id: '',
      title: '',
      icon: '',
      maxSelectSize: 12,
      stations: [],
    });
  }, [categories]);

  const onClickCategory = useCallback((id: string) => {
    Haptics.selectionAsync();
    setSelectedId(id);
  }, []);

  const onPressEdit = useCallback((category: Category) => {
    Haptics.selectionAsync();
    setTimeout(
      () =>
        navigation.navigate('CategoryRegister', {
          ...category,
          maxSelectSize: 12,
        }),
      600,
    );
  }, []);

  return (
    <AppView style={styles.container}>
      {useMemo(
        () => (
          <MapView
            style={{ ...StyleSheet.absoluteFillObject }}
            region={{
              latitude: Number(showLatitude),
              longitude: Number(showLongitude),
              latitudeDelta: showLatitudeDelta,
              longitudeDelta: showLongitudeDelta,
            }}
            initialRegion={{
              latitude: Number(showLatitude),
              longitude: Number(showLongitude),
              latitudeDelta: showLatitudeDelta,
              longitudeDelta: showLongitudeDelta,
            }}
            onRegionChangeComplete={onRegionChange}
            showsUserLocation={false}
            provider={PROVIDER_GOOGLE}
          >
            {selectedCategory?.stations.map((station, i) => (
              <Merker key={`markey-${selectedId}-${i}`} index={i} station={station} onClickMerker={onClickMarker} />
            )) ?? null}
          </MapView>
        ),
        [selectedId, categories, showLatitude, showLongitude],
      )}
      <View style={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
        <View style={{ width: '100%', paddingHorizontal: 8 }}>
          <DropDown
            activeId={selectedId}
            categories={categories}
            onPressAddCategory={onPressAddCategory}
            onPressCategory={onClickCategory}
            onPressEdit={onPressEdit}
            setCategories={setCategories}
          />
        </View>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
