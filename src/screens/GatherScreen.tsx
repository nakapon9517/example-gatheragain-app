import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Gather, RootTabScreenProps } from '@/entities';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { useUserGather, useTheme } from '@/hooks';
import { Admob, admobDataGenerator } from '@/components';
import { AppText, AppView } from '@/appComponents';
import * as Formater from '@/utils/Formatter';
import * as Haptics from 'expo-haptics';
import Ripple from 'react-native-material-ripple';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

type ListItem = Gather | null;

const ciecleSize = Layout.isLargeDevice ? 140 : 100;
const ItemSeparatorComponent = () => <View style={{ height: 16 }} />;

export const GatherScreen = ({ navigation }: RootTabScreenProps<'GatherList'>) => {
  const { gathers, loading, gathersReload, onRefresh, setGathersReload } = useUserGather();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const visibleAdsGathers = admobDataGenerator(gathers);

  useEffect(() => {
    if (gathersReload) {
      setRefreshing(true);
      onRefresh().finally(() =>
        setTimeout(() => {
          setRefreshing(false);
          setGathersReload(false);
        }, 1000),
      );
    }
  }, [gathersReload]);

  const onRefreshList = async () => {
    setRefreshing(true);
    await onRefresh().finally(() => setTimeout(() => setRefreshing(false), 1000));
  };

  const onPressGather = (gather: Gather) => {
    Haptics.selectionAsync();
    navigation.navigate('GatherPreview', { gather });
  };

  const keyExtractor = (item: ListItem, i: number) => `list-${item?.createdTime ?? 'ads'}-${i}`;
  const renderItem = ({ item }: { item: ListItem }) => {
    if (!item)
      return (
        <AppView style={[styles.itemView, styles.itemAdsWrapper, { shadowColor: Colors[theme].shadowColor }]}>
          <Admob bannerSize={Layout.window.width > 728 + 48 ? 'leaderboard' : 'largeBanner'} />
        </AppView>
      );
    return (
      <Ripple
        rippleDuration={600}
        rippleColor={Color.brand50}
        rippleContainerBorderRadius={12}
        onPress={() => onPressGather(item)}
      >
        <AppView style={[styles.itemView, { shadowColor: Colors[theme].shadowColor }]}>
          <View style={styles.itemWrapper}>
            <View
              style={{
                width: ciecleSize,
                height: ciecleSize,
                borderRadius: 99,
                overflow: 'hidden',
                position: 'absolute',
                top: -ciecleSize / 2,
                right: -ciecleSize / 2,
                zIndex: -1,
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={item.colors ?? Color.brandGradation}
                style={{ width: ciecleSize, height: ciecleSize }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText style={styles.title}>{item.title}</AppText>
            </View>
            <AppView style={styles.memberView}>
              {item.userRoutes.map((v, i) => (
                <View key={`user-${i}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="person" color={Colors[theme].icon} size={FontSize.tiny} />
                  <AppText style={{ fontSize: FontSize.tiny, marginLeft: 4 }}>{v.userName}</AppText>
                </View>
              ))}
            </AppView>
            <View style={styles.dateLabel}>
              <MaterialIcons size={FontSize.small} name="history" color={Colors[theme].icon} />
              <AppText style={{ color: Colors[theme].description, marginLeft: 4 }}>
                更新日: {Formater.dateJapanease(item.updatedTime.toDate())}
              </AppText>
            </View>
          </View>
        </AppView>
      </Ripple>
    );
  };

  return (
    <AppView style={styles.container}>
      <Skelton loading={loading} theme={theme} />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[Colors[theme].shadowColor]}
            tintColor={Colors[theme].shadowColor}
            refreshing={refreshing}
            onRefresh={onRefreshList}
          />
        }
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={visibleAdsGathers}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={() => <View style={{ height: 80 }} />}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  titleView: {
    padding: 8,
  },
  itemView: {
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  itemAdsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  itemWrapper: {
    justifyContent: 'center',
    minHeight: Layout.isLargeDevice ? 140 : 124,
    paddingVertical: 32,
    paddingLeft: 24,
    paddingRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: FontSize.middle,
    fontWeight: 'bold',
  },
  memberView: {
    width: '60%',
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  dateLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    bottom: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 99,
    opacity: 0.8,
  },
});

const rect = { rx: '4', ry: '4' };
type SkeltonProps = {
  theme: 'light' | 'dark';
  loading: boolean;
};
const Skelton = (props: SkeltonProps) => {
  if (!props.loading) return null;
  return (
    <View style={styles.list}>
      <AppView
        style={{
          borderRadius: 12,
          shadowColor: Colors[props.theme].shadowColor,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 4,
          shadowOpacity: 0.2,
          elevation: 6,
        }}
      >
        <ContentLoader
          width={Layout.window.width - 24}
          height={124}
          speed={0.7}
          backgroundColor={Colors[props.theme].inactiveTint}
          foregroundColor={Colors[props.theme].description}
        >
          <Rect x={12} y={32} width={200} height={24} {...rect} />
          <Rect x={12 + 8} y={32 + 24 + 8} width={200 / 2} height={18} {...rect} />
          <Rect x={Layout.window.width - 24 - (140 + 8)} y={124 - 18 - 4} width={140} height={18} {...rect} />
        </ContentLoader>
      </AppView>
    </View>
  );
};
