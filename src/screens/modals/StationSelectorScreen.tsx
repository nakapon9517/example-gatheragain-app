import React, { useCallback, useState } from 'react';
import { Alert, SectionList, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import { RootStackScreenProps, ScreenType, Station } from '@/entities';
import { sectionStations } from '@/routes';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { useTheme, useUserInfo } from '@/hooks';
import RouteDecorator, { getRouteInfo } from '@/decorators/RouteDecorator';
import { MaterialIcons } from '@expo/vector-icons';

type SectionStationData = {
  routeId: string;
  routeName: string;
  stations: Station[];
};
export type SectionStation = {
  companyId: string;
  companyName: string;
  data: SectionStationData[];
};

export const StationSelectorScreen = ({ navigation, route }: RootStackScreenProps<'StationSelector'>): JSX.Element => {
  const { theme } = useTheme();
  const { userInfo, saveUserInfo } = useUserInfo();
  const [sections, setSections] = useState<SectionStation[]>(sectionStations);
  const [searchText, setSearchText] = useState<string>();
  const [openCompanyIndex, setOpenCompanyIndex] = useState<string[]>([]);
  const [openRouteIndex, setOpenRouteIndex] = useState<string[]>([]);
  const [stations, setStations] = useState<Station[]>(route.params.stations);

  const onChangeSearchText = (text: string) => {
    const result = sectionStations.reduce((prev, curr) => {
      const data = curr.data.reduce((p, c) => {
        const stations = c.stations.filter(
          (v) => RegExp(text).test(v.stationName) || RegExp(text).test(v.stationHiragana ?? ''),
        );
        return stations.length > 0 ? [...p, { ...c, stations }] : p;
      }, [] as SectionStationData[]);

      return data.length > 0 ? [...prev, { companyId: curr.companyId, companyName: curr.companyName, data }] : prev;
    }, [] as SectionStation[]);
    setOpenCompanyIndex(text ? result.map((v) => v.companyId) : []);
    setOpenRouteIndex(text ? result.map((v) => v.data.map((r) => r.routeId)).flat() : []);
    setSections(result);
    setSearchText(text);
  };

  const onClose = () => {
    switch (route.params.type) {
      case ScreenType.Category:
        navigation.navigate('CategoryRegister', {
          ...route.params,
          stations,
        });
        break;
      case ScreenType.Settings:
      case ScreenType.Gather:
      case ScreenType.GatherEditer:
        break;
    }
  };

  const onPressStation = (station: Station) => {
    switch (route.params.type) {
      case ScreenType.Category:
        if (stations.includes(station)) {
          setStations(stations.filter((v) => v !== station));
        } else {
          if (stations.length >= route.params.maxSelectSize) {
            Alert.alert(`駅は${route.params.maxSelectSize}個まで指定可能です`);
          } else {
            setStations([...stations, station]);
          }
        }
        break;
      case ScreenType.Settings:
        saveUserInfo({
          ...userInfo,
          nearestStation: station.stationName,
        });
        navigation.navigate('Settings');
        break;
      case ScreenType.Gather:
        navigation.navigate('GatherRegister', { station });
        break;
      case ScreenType.GatherEditer:
        navigation.navigate('GatherEditer', { station, gather: route.params.gather });
        break;
    }
  };

  const keyExtractor = useCallback((_: SectionStationData, i: number) => `station-selector-${i}`, []);
  const renderItem = useCallback(
    (item: SectionStationData, sectionId: string) => (
      <>
        {openCompanyIndex.includes(sectionId) ? (
          <View style={styles.route}>
            <AppTouchableOpacity
              name="toggle_selector_route"
              id={item.routeId}
              style={[
                styles.routeView,
                { backgroundColor: getRouteInfo(item.routeName)?.color ?? Colors[theme].inactiveTint },
              ]}
              onPress={() => {
                setOpenRouteIndex(
                  openRouteIndex.includes(item.routeId)
                    ? openRouteIndex.filter((v) => v !== item.routeId)
                    : [...openRouteIndex, item.routeId],
                );
              }}
            >
              <AppText style={styles.routeName}>{item.routeName}</AppText>
              <MaterialIcons
                name={openRouteIndex.includes(item.routeId) ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={FontSize.small}
                color={Color.brand5}
              />
            </AppTouchableOpacity>
            {openRouteIndex.includes(item.routeId) ? (
              <View style={styles.stationView}>
                {item.stations.map((v, i) => (
                  <AppTouchableOpacity
                    key={`station-${i}`}
                    name="station_selected"
                    id={String(i)}
                    style={[styles.station, stationStyle(v)]}
                    onPress={() => onPressStation(v)}
                  >
                    <AppText style={[styles.stationName, stations.includes(v) && { color: Colors[theme].shadowColor }]}>
                      {v.stationName}
                    </AppText>
                  </AppTouchableOpacity>
                ))}
              </View>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <></>
        )}
      </>
    ),
    [stations, openCompanyIndex, openRouteIndex],
  );

  const stationStyle = useCallback(
    (v: Station): StyleProp<ViewStyle> => {
      return stations.includes(v)
        ? {
            backgroundColor: Colors[theme].inactiveTint,
            borderColor: Colors[theme].inactiveTint,
          }
        : { borderColor: Colors[theme].border };
    },
    [stations],
  );

  return (
    <AppView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>駅選択</Text>
        {route.params.maxSelectSize != 1 ? (
          <AppTouchableOpacity
            name="station_selector_decision"
            style={{ position: 'absolute', bottom: 4, right: 8 }}
            onPress={onClose}
          >
            <Text style={[styles.headerText, { fontSize: 20 }]}>決定</Text>
          </AppTouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <View style={[styles.searchContainer, { backgroundColor: Colors[theme].inactiveTint }]}>
        <View style={[styles.searchWrapper, { backgroundColor: Colors[theme].background }]}>
          <MaterialIcons name="search" size={FontSize.large} color={Colors[theme].icon} />
          <TextInput
            value={searchText}
            style={[styles.searchInput, { color: Colors[theme].text }]}
            placeholder="駅名で検索 (例:いけぶくろ)"
            placeholderTextColor={Colors[theme].inactiveTint}
            onChangeText={onChangeSearchText}
          />
          {Boolean(searchText) ? (
            <AppTouchableOpacity
              name="search_text_delete"
              style={{
                maxWidth: FontSize.large,
                height: FontSize.large,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => onChangeSearchText('')}
            >
              <MaterialIcons name="close" size={FontSize.small} color={Colors[theme].icon} />
            </AppTouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
      <SectionList
        sections={sections}
        initialNumToRender={1}
        keyExtractor={keyExtractor}
        renderItem={({ item, section }) => renderItem(item, section.companyId)}
        renderSectionHeader={({ section: { companyId, companyName, data } }) => (
          <AppView style={styles.companyView}>
            <AppTouchableOpacity
              name="toggle_selector_company"
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 4,
              }}
              onPress={() => {
                setOpenCompanyIndex(
                  openCompanyIndex.includes(companyId)
                    ? openCompanyIndex.filter((v) => v !== companyId)
                    : [...openCompanyIndex, companyId],
                );
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={styles.companyText}>{companyName}</AppText>
                <MaterialIcons
                  name={openCompanyIndex.includes(companyId) ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={FontSize.middle}
                  color={Colors[theme].text}
                />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                {data.map((v, i) => (
                  <View key={`route-${i}`} style={{ margin: 2 }}>
                    {new RouteDecorator(v.routeName, 24).icon}
                  </View>
                ))}
              </View>
            </AppTouchableOpacity>
          </AppView>
        )}
        ListHeaderComponent={() => (
          <>
            {route.params.maxSelectSize !== 1 ? (
              <View style={{ flexDirection: 'column', paddingHorizontal: 4, paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppTouchableOpacity
                    name="selected_station_clear"
                    style={{
                      padding: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stations.length > 0 ? Colors[theme].inactiveTint : Colors[theme].inactive,
                      borderRadius: 99,
                    }}
                    onPress={() => setStations([])}
                  >
                    <MaterialIcons name="check" size={FontSize.tiny} color={Colors[theme].primary} />
                  </AppTouchableOpacity>
                  <AppText style={{ fontSize: FontSize.middle, color: Colors[theme].icon, paddingLeft: 4 }}>
                    {stations.length > 0 ? '選択済み' : '未選択'}
                  </AppText>
                </View>
                <View style={styles.stationView}>
                  {stations.map((v, i) => (
                    <AppTouchableOpacity
                      key={`station-${i}`}
                      name="station_selected"
                      style={[styles.stationSelected, stationStyle(v)]}
                      onPress={() => onPressStation(v)}
                    >
                      <AppText
                        style={[styles.stationName, stations.includes(v) && { color: Colors[theme].shadowColor }]}
                      >
                        {v.stationName}
                      </AppText>
                    </AppTouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}
          </>
        )}
        ListFooterComponent={() => <View style={{ height: 80 }} />}
      />
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
    backgroundColor: Color.blue70,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.brand5,
  },
  companyView: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  companyText: {
    fontSize: 18,
  },
  searchContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  searchWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: Layout.isLargeDevice ? 80 : 48,
    fontSize: FontSize.middle,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  route: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 4,
    marginHorizontal: 4,
  },
  routeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.brand5,
  },
  stationView: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  station: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 8,
    margin: 2,
  },
  stationSelected: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    margin: 2,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
