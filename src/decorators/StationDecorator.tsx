import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Color, Colors, Layout } from '@/constants';
import { Station, Transfer } from '@/entities';
import { AppBorder, AppText, AppView } from '@/appComponents';
import RouteDecorator, { getRouteInfo } from './RouteDecorator';
import { MaterialIcons } from '@expo/vector-icons';
import { Admob } from '@/components';
import { EdgeInsets } from 'react-native-safe-area-context';

type transferModel = {
  companyName: string;
  routeNames: string[];
};

export const RouteSort = (arr: Transfer[], rootCompanyName?: string, rootRouteName?: string) =>
  arr
    .sort((a, b) => (rootCompanyName === b.companyName ? 1 : a.companyName > b.companyName ? 1 : -1))
    .sort((a, b) => (rootRouteName !== a.routeName ? 1 : a.routeName < b.routeName ? -1 : 1))
    .filter((v, i, arr) =>
      arr[i + 1] ? !(v.companyName === arr[i + 1].companyName && v.routeName === arr[i + 1].routeName) : true,
    );

export default class StationDecorator {
  private station: Station;
  private transfers: Station['transfers'];
  private theme: 'light' | 'dark';
  private inset: EdgeInsets;

  constructor(station: Station, theme: 'light' | 'dark', inset: EdgeInsets) {
    this.station = station;
    this.transfers = RouteSort(
      [{ companyName: station.companyName, routeName: station.routeName }, ...station.transfers].filter(
        (v) => new RouteDecorator(v.routeName).icon,
      ),
      station.companyName,
      station.routeName,
    );
    this.theme = theme;
    this.inset = inset;
  }

  get preview(): JSX.Element | undefined {
    const transfers = this.transfers.reduce((prev, curr) => {
      const target = prev.findIndex((v) => v.companyName == curr.companyName);
      if (target != -1) {
        prev[target].routeNames = [...prev[target].routeNames, curr.routeName];
        return prev;
      } else {
        return [
          ...prev,
          {
            companyName: curr.companyName,
            routeNames: [curr.routeName],
          },
        ];
      }
    }, [] as transferModel[]);
    return (
      <AppView style={styles.wrapper}>
        <View
          style={[
            styles.header,
            {
              borderColor: Colors[this.theme].border,
              backgroundColor: getRouteInfo(this.station.routeName)?.color ?? Color.brand80,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText style={styles.breadList}>{this.station.companyName}</AppText>
            <MaterialIcons size={18} color={Color.brand5} name="keyboard-arrow-right" />
            <AppText style={styles.breadList}>{this.station.routeName}</AppText>
            <MaterialIcons size={18} color={Color.brand5} name="keyboard-arrow-right" />
          </View>
          <View style={styles.station}>
            <AppText style={styles.stationiName}>{this.station.stationName}</AppText>
          </View>
        </View>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.bodyHeader}>
            <AppText style={styles.text}>乗り換え路線</AppText>
          </View>
          <AppBorder />
          <View style={styles.transferWrapperView}>
            {transfers.map((transform, index) => (
              <View key={`company-${index}`} style={styles.transferView}>
                <AppText style={styles.companyName}>{transform.companyName}</AppText>
                {transform.routeNames.map((v, i) => (
                  <View key={`route-${i}`} style={styles.route}>
                    {new RouteDecorator(v, 24).icon}
                    <AppText style={styles.routeName}>{v}</AppText>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: this.inset.bottom + 8,
            zIndex: 2,
          }}
        >
          <Admob bannerSize={Layout.isLargeDevice ? 'fullBanner' : 'smartBannerPortrait'} />
        </View>
      </AppView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  breadList: {
    fontSize: 18,
    color: Color.brand5,
  },
  station: {
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationiName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Color.brand5,
  },
  text: {
    fontSize: 18,
  },
  body: {
    flex: 1,
    width: '100%',
    padding: 12,
  },
  bodyHeader: {
    padding: 12,
  },
  transferWrapperView: {
    padding: 12,
    marginBottom: 80,
  },
  transferView: {
    padding: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  route: {
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  routeName: {
    marginLeft: 12,
    fontSize: 16,
  },
});
