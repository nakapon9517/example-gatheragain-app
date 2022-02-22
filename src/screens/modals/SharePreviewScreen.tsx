import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Gather, RootStackScreenProps } from '@/entities';
import { useUserGather, useTheme } from '@/hooks';
import GatherDecorator from '@/decorators/GatherDecorator';
import { useRefrectGather } from '@/hooks';
import { logger } from '@/utils';
import { Indicator } from '@/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SharePreviewScreen = ({ navigation, route }: RootStackScreenProps<'SharePreview'>): JSX.Element => {
  const { shareId } = route.params;
  const { getGather } = useUserGather();
  const { theme } = useTheme();
  const [gather, setGather] = useState<Gather>();
  const refrectGather = useRefrectGather();
  const inset = useSafeAreaInsets();

  const onPressEdit = () => {
    gather && navigation.navigate('GatherEditer', { gather });
  };

  useEffect(() => {
    refrectGather
      .call({ shareId })
      .then(async () => {
        const gather = await getGather(shareId);
        if (!gather) {
          Alert.alert('エラーが発生しました', '前の画面へ戻ります', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        }
        setGather(gather);
      })
      .catch((err) => {
        logger.error(err);
        Alert.alert('エラーが発生しました', '前の画面へ戻ります', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ]);
      });
  }, [shareId]);

  return (
    <>
      <Indicator loading={refrectGather.loading} size="large" />
      {gather ? new GatherDecorator(gather, theme, inset, onPressEdit).preview : null}
    </>
  );
};
