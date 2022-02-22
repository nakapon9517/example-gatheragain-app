import React, { useCallback, useMemo } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type AnimatedHeaderScrollProps = {
  headerSize: number;
  HeaderComponent: JSX.Element;
  scrollStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export const AnimatedHeaderScroll = (props: AnimatedHeaderScrollProps) => {
  const animatedHeader = useMemo(
    () => ({ opacity: new Animated.Value(1), height: new Animated.Value(props.headerSize) }),
    [],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrolling = props.headerSize - e.nativeEvent.contentOffset.y;
      Animated.timing(animatedHeader.height, {
        toValue: Math.max(0, scrolling),
        duration: 100,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedHeader.opacity, {
        toValue: Math.max(0, scrolling / props.headerSize),
        duration: 100,
        useNativeDriver: false,
      }).start();
    },
    [animatedHeader],
  );

  return (
    <>
      <Animated.View
        style={{
          ...styles.header,
          opacity: animatedHeader.opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          height: animatedHeader.height.interpolate({
            inputRange: [0, props.headerSize],
            outputRange: [0, props.headerSize],
          }),
        }}
      >
        {props.HeaderComponent}
      </Animated.View>
      <ScrollView
        style={[styles.body, { paddingTop: props.headerSize }, props.scrollStyle]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {props.children}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  body: {
    flex: 1,
    width: '100%',
  },
});
