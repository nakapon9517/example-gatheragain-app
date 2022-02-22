import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppView } from '@/appComponents';
import { Colors } from '@/constants';
import RouteDecorator from '@/decorators/RouteDecorator';
import { RouteSort } from '@/decorators/StationDecorator';
import { Station } from '@/entities';
import { useTheme } from '@/hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { Marker as DefaultMerker } from 'react-native-maps';

type Props = {
  index: number;
  station: Station;
  onClickMerker: (_: number) => void;
};

export const Merker = (props: Props) => {
  const { theme } = useTheme();
  const transfersModel = RouteSort(
    [
      {
        companyName: props.station.companyName,
        routeName: props.station.routeName,
      },
      ...props.station.transfers,
    ].filter((v) => new RouteDecorator(v.routeName).icon),
    props.station.companyName,
    props.station.routeName,
  );

  return (
    <DefaultMerker
      coordinate={{
        latitude: Number(props.station.latitude),
        longitude: Number(props.station.longitude),
      }}
      onPress={() => props.onClickMerker(props.index)}
    >
      <AppView style={[styles.marker, { backgroundColor: Colors[theme].transBackground }]}>
        <View style={styles.routes}>
          <MaterialIcons name="train" size={24} color={Colors[theme].text} />
          <AppText style={styles.stationName}>{props.station.stationName}</AppText>
        </View>
        <AppView style={[styles.routes, { paddingVertical: 2 }]}>
          {transfersModel.slice(0, 3).map((v, i) => (
            <AppView
              key={`marker-route-${i}`}
              style={{
                backgroundColor: 'transparent',
                marginLeft: i || 2,
              }}
            >
              {new RouteDecorator(v.routeName, 18).icon}
            </AppView>
          )) ?? null}
          <AppText style={styles.dot}>{transfersModel.length > 3 ? '...' : ''}</AppText>
        </AppView>
      </AppView>
    </DefaultMerker>
  );
};

const styles = StyleSheet.create({
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
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dot: {
    marginLeft: 1,
  },
});
