import { logger } from '@/utils';
import { AdMobBanner } from 'expo-ads-admob';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// banner (320x50, Standard Banner for Phones and Tablets)
// largeBanner (320x100, Large Banner for Phones and Tablets)
// mediumRectangle (300x250, IAB Medium Rectangle for Phones and Tablets)
// fullBanner (468x60, IAB Full-Size Banner for Tablets)
// leaderboard (728x90, IAB Leaderboard for Tablets)
// smartBannerPortrait (Screen width x 32|50|90, Smart Banner for Phones and Tablets)
// smartBannerLandscape (Screen width x 32|50|90, Smart Banner for Phones and Tablets)
type AdmobProps = {
  bannerSize:
    | 'banner'
    | 'largeBanner'
    | 'mediumRectangle'
    | 'fullBanner'
    | 'leaderboard'
    | 'smartBannerPortrait'
    | 'smartBannerLandscape';
};

// https://developers.google.com/admob/android/test-ads
const testID = 'ca-app-pub-test';
const productionID = Platform.select({
  ios: 'ca-app-pub-ios',
  android: 'ca-app-pub-android',
});
const DEFAULT_SEPALATE_INDEX = 99;

export const Admob = (props: AdmobProps) => {
  const adUnitID = Boolean(Device?.isDevice) && !__DEV__ ? productionID : testID;
  if (adUnitID) {
    return (
      <AdMobBanner
        adUnitID={adUnitID}
        servePersonalizedAds={true}
        bannerSize={props.bannerSize}
        onDidFailToReceiveAdWithError={(message: string) =>
          logger.error(new Error(`Admob failed ${JSON.stringify(message)}`))
        }
      />
    );
  } else {
    return <></>;
  }
};

type AdmobData<S> = S | null;
export function admobDataGenerator<T>(datas: T[], separateIndex?: number): AdmobData<T>[] {
  return datas.reduce(
    (p, c, i) => [...p, ...((i + 1) % (separateIndex ?? DEFAULT_SEPALATE_INDEX) == 0 ? [null] : [])].concat(c),
    [] as AdmobData<T>[],
  );
}
