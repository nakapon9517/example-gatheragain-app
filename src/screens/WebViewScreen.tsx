import React from 'react';
import { View, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { useTheme } from '@/hooks';
import { RootStackScreenProps } from '@/entities';
import { Indicator } from '@/components';
import { AppView } from '@/appComponents';
import { Color, Colors } from '@/constants';
import { WebView } from 'react-native-webview';

export const WebViewScreen = ({ route }: RootStackScreenProps<'WebView'>): JSX.Element => {
  const { title, uri } = route.params;
  const { theme } = useTheme();

  return (
    <AppView style={[styles.view, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={[styles.header]}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: uri }}
        startInLoadingState={true}
        renderLoading={() => <Indicator loading size="small" color={Colors[theme].shadowColor} />}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: Color.brand60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.brand5,
  },
});
