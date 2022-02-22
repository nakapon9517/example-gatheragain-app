import * as Linking from 'expo-linking';
import * as StoreReview from 'expo-store-review';

export const requestStoreReview = async () => {
  if (await StoreReview.hasAction()) {
    StoreReview.requestReview();
  } else {
    const url = StoreReview.storeUrl();
    if (url) Linking.openURL(url);
  }
};
