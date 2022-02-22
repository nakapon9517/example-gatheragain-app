import Constants from 'expo-constants';
import { User } from 'firebase/auth';
import { Adapter } from './';
import * as Analytics from 'expo-firebase-analytics';
import * as Updates from 'expo-updates';

class FirebaseAdapter implements Adapter {
  currentScreen = 'launch';

  constructor() {
    Analytics.setAnalyticsCollectionEnabled(!__DEV__);
  }

  async set(user?: User) {
    if (user) {
      await Analytics.setUserId(user.uid);
      await Analytics.setUserProperties({
        version: Constants.manifest?.version ?? '',
        releaseChannel: Updates.releaseChannel,
      });
    } else {
      await Analytics.setUserId(null);
      await Analytics.setUserProperties({});
    }
  }

  async screen(name: string) {
    this.currentScreen = name;
    await Analytics.logEvent('screen_view', {
      screen_name: name,
    });
  }

  async action(name: string, id?: string) {
    await Analytics.logEvent(name, {
      id,
      screen: this.currentScreen,
    });
  }

  async error(error: Error) {
    await Analytics.logEvent('error', {
      name: error.name,
      messagge: error.message,
      screen: this.currentScreen,
    });
  }
}

export { FirebaseAdapter };
