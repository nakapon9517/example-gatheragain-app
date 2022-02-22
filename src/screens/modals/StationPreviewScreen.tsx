import React from 'react';
import { Alert } from 'react-native';
import { RootStackScreenProps } from '@/entities';
import StationDecorator from '@/decorators/StationDecorator';
import { useTheme } from '@/hooks';
import { AppView } from '@/appComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const StationPreviewScreen = ({ navigation, route }: RootStackScreenProps<'StationPreview'>): JSX.Element => {
  const { station } = route.params;
  const { theme } = useTheme();
  const inset = useSafeAreaInsets();

  const view = new StationDecorator(station, theme, inset).preview;

  if (!view) {
    Alert.alert('エラーが発生しました', '前の画面へ戻ります', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    return <AppView />;
  } else {
    return <>{view}</>;
  }
};
