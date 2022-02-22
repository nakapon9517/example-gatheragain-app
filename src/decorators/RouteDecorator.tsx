import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Color } from '@/constants';

const jrEast = require('@/routes/colors/jr-east');
const jrHokaido = require('@/routes/colors/jr-hokaido');
const jrKyushu = require('@/routes/colors/jr-kyushu');
const jrShikoku = require('@/routes/colors/jr-shikoku');
const jrTokai = require('@/routes/colors/jr-tokai');
const jrWest = require('@/routes/colors/jr-west');
const keio = require('@/routes/colors/keio');
const tokyoMetro = require('@/routes/colors/tokyo-metro');
const osakaMetro = require('@/routes/colors/osaka-metro');
const odakyu = require('@/routes/colors/odakyu');

const rinkai = require('@/routes/colors/rinkai');
const seibu = require('@/routes/colors/seibu');
const shinkansen = require('@/routes/colors/shinkansen');
const shutoShintoshi = require('@/routes/colors/shutoShintoshi');
const tobu = require('@/routes/colors/tobu');
const tokyoKotsukyoku = require('@/routes/colors/tokyoKotsukyoku');
const tokyu = require('@/routes/colors/tokyu');
const yokohamaChikatetus = require('@/routes/colors/yokohamaChikatetus');

export const getRouteInfo = (routeName: string): { color: string; shortText: string } | undefined => {
  const result =
    jrEast[routeName] ??
    jrWest[routeName] ??
    jrHokaido[routeName] ??
    jrKyushu[routeName] ??
    jrShikoku[routeName] ??
    jrTokai[routeName] ??
    keio[routeName] ??
    tokyoMetro[routeName] ??
    osakaMetro[routeName] ??
    odakyu[routeName] ??
    rinkai[routeName] ??
    seibu[routeName] ??
    shutoShintoshi[routeName] ??
    tobu[routeName] ??
    tokyoKotsukyoku[routeName] ??
    tokyu[routeName] ??
    yokohamaChikatetus[routeName];
  if (!result) console.info(routeName);
  return result ?? undefined;
};

export default class RouteDecorator {
  private routeName: string;
  private iconColor: string | undefined;
  private iconText: string | undefined;
  private size: number;

  constructor(routeName: string, size?: number) {
    const routeInfo = getRouteInfo(routeName);
    this.routeName = routeName;
    this.iconColor = routeInfo?.color;
    this.iconText = routeInfo?.shortText;
    this.size = size ?? 32;
  }

  get icon(): JSX.Element | undefined {
    if (!this.iconColor || !this.iconText) return undefined;

    const scale = this.iconText.length > 1 ? 1.4 : 1.8;
    const fontScale = this.iconText.length > 1 ? 2.8 : 2.4;
    const borderRadius = this.iconText.length > 1 ? 2 : 999;
    return (
      <View
        key={`routeIcon-${this.routeName}`}
        style={[
          styles.wrapper,
          {
            width: this.size,
            height: this.size,
            borderRadius: borderRadius,
            backgroundColor: this.iconColor,
          },
        ]}
      >
        <View
          style={[
            styles.iconView,
            {
              width: this.size / scale,
              height: this.size / scale,
              borderRadius: borderRadius,
              backgroundColor: Color.white,
            },
          ]}
        >
          <Text style={[styles.iconText, { fontSize: this.size / fontScale }]}>{this.iconText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: Color.brand100,
    fontWeight: '900',
    textAlign: 'center',
  },
});
