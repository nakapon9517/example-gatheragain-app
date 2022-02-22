import { Color } from '@/constants';
import { ActivityIndicatorProps, ActivityIndicator, StyleSheet, View } from 'react-native';

type Props = {
  loading: boolean;
} & ActivityIndicatorProps;
export const Indicator = (props: Props) => {
  if (!props.loading) return null;
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator {...props} size={props.size} color={props.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.gray50,
    zIndex: 99,
    ...StyleSheet.absoluteFillObject,
  },
});
