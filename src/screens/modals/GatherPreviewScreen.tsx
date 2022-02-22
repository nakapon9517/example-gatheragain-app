import React from 'react';
import { Alert } from 'react-native';
import { RootStackScreenProps } from '@/entities';
import { useTheme } from '@/hooks';
import { AppView } from '@/appComponents';
import GatherDecorator from '@/decorators/GatherDecorator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const GatherPreviewScreen = ({ navigation, route }: RootStackScreenProps<'GatherPreview'>): JSX.Element => {
  const { gather } = route.params;
  const { theme } = useTheme();
  const inset = useSafeAreaInsets();

  const navigateEditer = () => navigation.navigate('GatherEditer', { gather });
  const onPressEdit = () => navigateEditer();

  const view = new GatherDecorator(gather, theme, inset, onPressEdit).preview;
  if (!view) {
    Alert.alert('エラーが発生しました', '前の画面へ戻ります', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    return <AppView />;
  } else {
    return <>{view}</>;
  }
};
