import React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  Switch as DefaultSwitch,
  TouchableOpacity as DefaultTouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { Color, Colors } from '@/constants';
import { useTheme } from '@/hooks';
import { logger } from '@/utils';

export const useThemeColor = (colorName: keyof typeof Colors.light & keyof typeof Colors.dark) =>
  Colors[useTheme().theme][colorName];

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type SwitchProps = ThemeProps & DefaultSwitch['props'];
export type BorderProps = ThemeProps & { size?: number } & DefaultView['props'];
export type TouchableOpacityProps = ThemeProps & {
  name: string;
  id?: string;
} & DefaultTouchableOpacity['props'];

export const AppText = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor('text');
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
};

export const AppView = (props: ViewProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor('background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
};

export const AppTouchableOpacity = (props: TouchableOpacityProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const onPress = (event: GestureResponderEvent) => {
    logger.action(`press_${props.name.toLowerCase()}`, props.id?.toLowerCase());
    props.onPress && props.onPress(event);
  };

  return (
    <DefaultTouchableOpacity
      {...otherProps}
      style={[{ backgroundColor: 'transparent' }, style]}
      onPress={onPress}
      activeOpacity={otherProps.activeOpacity ?? 0.6}
    />
  );
};

export const AppBorder = (props: BorderProps) => {
  const { size, style, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor = useThemeColor('border');
  return <DefaultView style={[{ width: '100%', height: size ?? 1, backgroundColor }, style]} {...otherProps} />;
};

export const AppSwitch = (props: SwitchProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const primary = useThemeColor('primary');
  const inactive = useThemeColor('inactive');

  return (
    <DefaultSwitch
      trackColor={{ true: primary, false: inactive }}
      thumbColor={Color.brand5}
      ios_backgroundColor={inactive}
      style={style}
      {...otherProps}
    />
  );
};
