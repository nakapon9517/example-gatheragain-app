import { StyleSheet } from 'react-native';

import { AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import { RootStackScreenProps } from '@/entities';

export const NotFoundScreen = ({ navigation }: RootStackScreenProps<'NotFound'>) => {
  return (
    <AppView style={styles.container}>
      <AppText style={styles.title}>This screen doesn't exist.</AppText>
      <AppTouchableOpacity name="notfound" onPress={() => navigation.replace('Root')} style={styles.link}>
        <AppText style={styles.linkText}>Go to home screen!</AppText>
      </AppTouchableOpacity>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
