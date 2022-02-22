import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Color, Layout } from '@/constants';
import { useIntroduction } from '@/hooks';
import { RootStackScreenProps } from '@/entities';
import AppIntroSlider from 'react-native-app-intro-slider';

const smallSlides = [
  { image: require('@/assets/images/intros/5inchs/regist-1-min.png') },
  { image: require('@/assets/images/intros/5inchs/regist-2-min.png') },
  { image: require('@/assets/images/intros/5inchs/create-1-min.png') },
  { image: require('@/assets/images/intros/5inchs/create-2-min.png') },
  { image: require('@/assets/images/intros/5inchs/create-3-min.png') },
  { image: require('@/assets/images/intros/5inchs/update-1-min.png') },
  { image: require('@/assets/images/intros/5inchs/update-2-min.png') },
  { image: require('@/assets/images/intros/5inchs/update-3-min.png') },
];
const middleSlides = [
  { image: require('@/assets/images/intros/6inchs/regist-1-min.png') },
  { image: require('@/assets/images/intros/6inchs/regist-2-min.png') },
  { image: require('@/assets/images/intros/6inchs/create-1-min.png') },
  { image: require('@/assets/images/intros/6inchs/create-2-min.png') },
  { image: require('@/assets/images/intros/6inchs/create-3-min.png') },
  { image: require('@/assets/images/intros/6inchs/update-1-min.png') },
  { image: require('@/assets/images/intros/6inchs/update-2-min.png') },
  { image: require('@/assets/images/intros/6inchs/update-3-min.png') },
];
const largeSlides = [
  { image: require('@/assets/images/intros/12inchs/regist-1-min.png') },
  { image: require('@/assets/images/intros/12inchs/regist-2-min.png') },
  { image: require('@/assets/images/intros/12inchs/create-1-min.png') },
  { image: require('@/assets/images/intros/12inchs/create-2-min.png') },
  { image: require('@/assets/images/intros/12inchs/create-3-min.png') },
  { image: require('@/assets/images/intros/12inchs/update-1-min.png') },
  { image: require('@/assets/images/intros/12inchs/update-2-min.png') },
  { image: require('@/assets/images/intros/12inchs/update-3-min.png') },
];

const slides = Layout.isSmallDevice ? smallSlides : Layout.isLargeDevice ? largeSlides : middleSlides;

export const IntroductionScreen = ({ navigation, route }: RootStackScreenProps<'Introduction'>) => {
  const { saveIntroductionDone } = useIntroduction();

  const keyExtractor = useCallback((_: any, i: number) => `introduction-${i}`, []);
  const onDone = () => {
    saveIntroductionDone(true);
    navigation.goBack();
  };

  return (
    <AppIntroSlider
      data={route.params.isCategory ? slides.slice(0, 2) : slides}
      style={styles.container}
      showSkipButton
      showNextButton
      showDoneButton
      skipLabel="スキップ"
      nextLabel="次へ"
      doneLabel="完了"
      onDone={onDone}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.brand80,
  },
  item: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
