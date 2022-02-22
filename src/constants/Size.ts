import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const isSmallDevice = width <= 375;
const isLargeDevice = width > 480;

export const Layout = {
  window: { width, height },
  isSmallDevice,
  isLargeDevice,
};

export const FontSize = {
  tiny: isLargeDevice ? 16 : 14,
  small: isLargeDevice ? 18 : 16,
  middle: isLargeDevice ? 22 : 18,
  large: isLargeDevice ? 28 : 24,
};
