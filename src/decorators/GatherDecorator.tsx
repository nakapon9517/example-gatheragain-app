import React from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { Gather } from '@/entities';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { AnimatedHeaderScroll } from '@/components';
import { AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import * as Formater from '@/utils/Formatter';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { logger } from '@/utils';
import { EdgeInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type ArrivalUser = {
  name: string;
  from?: string;
  transferCount: number;
  rideTime: number;
};

type RouteModel = {
  stationName: string;
  arrivalUser: ArrivalUser[];
};

const HeaderSize = Layout.isLargeDevice ? 120 : 80;

export default class GatherDecorator {
  private gather: Gather;
  private theme: 'light' | 'dark';
  private inset: EdgeInsets;
  private onPressEdit: () => void;

  constructor(gather: Gather, theme: 'light' | 'dark', inset: EdgeInsets, onPressEdit: () => void) {
    this.gather = gather;
    this.theme = theme;
    this.inset = inset;
    this.onPressEdit = onPressEdit;
  }

  onShare = async () => {
    try {
      const redirectUrl = Linking.createURL('share/preview', {
        queryParams: { shareId: this.gather.shareId },
      });
      await Share.share({ title: '', message: `この指とまれ！👆\n${redirectUrl}` });
    } catch (error) {
      logger.error(error as Error);
    }
  };

  get preview(): JSX.Element {
    const routesModal = this.gather.category.stationNames.reduce((prev, curr) => {
      const targetUser = this.gather.userRoutes.reduce((p, user) => {
        const route = user.routes.find((route) => route.stationTo == curr);
        if (!route) return p;
        return [
          ...p,
          {
            name: user.userName,
            from: this.gather.visible && user.visible ? route.stationFrom : undefined,
            transferCount: route.transferCount,
            rideTime: route.rideTime,
          },
        ];
      }, [] as ArrivalUser[]);

      return [...prev, { stationName: curr, arrivalUser: targetUser }];
    }, [] as RouteModel[]);
    const captionColor = this.theme == 'dark' ? Color.brand80 : Color.brand20;

    return (
      <AppView style={styles.wrapper}>
        <AnimatedHeaderScroll
          headerSize={HeaderSize}
          HeaderComponent={
            <>
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={this.gather.colors ?? Color.brandGradation}
                style={styles.header}
              />
              <View style={[styles.colors, { backgroundColor: Colors[this.theme].transBackground }]}>
                <MaterialIcons size={FontSize.small} name="history" color={Colors[this.theme].icon} />
                <AppText style={[styles.description, { color: Colors[this.theme].icon, marginLeft: 4 }]}>
                  更新日 {Formater.dateJapanease(this.gather.updatedTime.toDate())}
                </AppText>
              </View>
            </>
          }
          scrollStyle={{ padding: 8 }}
        >
          <View style={{ paddingBottom: HeaderSize * 3 }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}
            >
              <AppText style={styles.title}>{this.gather.title}</AppText>
            </View>
            <View>
              {routesModal.map((route, index) => (
                <View key={`routes-${index}`}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: 4,
                      paddingHorizontal: 4,
                      marginVertical: 12,
                      borderRadius: 24,
                      shadowColor: Colors[this.theme].shadowColor,
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowRadius: 4,
                      shadowOpacity: 0.2,
                      elevation: 12,
                      backgroundColor: Colors[this.theme].background,
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 24,
                        backgroundColor: captionColor,
                      }}
                    >
                      {route.arrivalUser.map((user, i) => (
                        <View key={`arrival-user-${i}`} style={{ paddingVertical: 8, flexDirection: 'column' }}>
                          <AppText style={styles.userName}>
                            {user.name}
                            {user.from ? <AppText style={styles.description}>{`【${user.from}】`}</AppText> : null}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              opacity: route.stationName == user.from ? 0.5 : 1,
                            }}
                          >
                            <AppText
                              style={[styles.description, { color: Colors[this.theme].primary, fontWeight: 'bold' }]}
                            >
                              {`${route.stationName}まで  `}
                            </AppText>
                            <AppText style={styles.description}>{`乗換:${user.transferCount}回`}</AppText>
                            <AppText
                              style={[styles.description, { marginLeft: 8 }]}
                            >{`時間:${user.rideTime}分`}</AppText>
                          </View>
                        </View>
                      ))}
                    </View>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={80}
                      color={captionColor}
                      style={{
                        position: 'absolute',
                        bottom: 80 - 80 / 2,
                        zIndex: 2,
                      }}
                    />
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 80,
                        paddingHorizontal: 48,
                        borderRadius: 12,
                      }}
                    >
                      <MaterialCommunityIcons name="flag-triangle" size={24} color={Color.green} />
                      <AppText style={styles.stationName} numberOfLines={2} adjustsFontSizeToFit>
                        {route.stationName}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <AppTouchableOpacity
              name="gather_register_decision"
              style={[styles.editButton, { borderColor: Colors[this.theme].border }]}
              onPress={this.onPressEdit}
            >
              <AppText style={styles.editText}>修正</AppText>
              <MaterialIcons size={FontSize.small} name="edit" color={Colors[this.theme].icon} />
            </AppTouchableOpacity>
          </View>
        </AnimatedHeaderScroll>
        <View style={[styles.footer, { marginBottom: this.inset.bottom }]}>
          <AppTouchableOpacity name="gather_register_decision" style={styles.shareWrapper} onPress={this.onShare}>
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              locations={[0.4, 0.8]}
              colors={Color.brandGradation}
              style={styles.shareButon}
            >
              <AppText style={styles.shareText}>他の人に共有する</AppText>
              <MaterialIcons size={FontSize.middle} name="share" color={Color.brand5} />
            </LinearGradient>
          </AppTouchableOpacity>
        </View>
      </AppView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flex: 1,
    width: Layout.window.width,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    flex: 1,
    fontSize: FontSize.large,
    fontWeight: 'bold',
  },
  colors: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 99,
    opacity: 0.8,
  },
  description: {
    fontSize: FontSize.small,
  },
  body: {
    flex: 1,
    width: '100%',
    padding: 8,
  },
  userName: {
    fontSize: FontSize.small,
    fontWeight: 'bold',
  },
  stationName: {
    fontSize: FontSize.middle,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  shareWrapper: {
    overflow: 'hidden',
    borderRadius: 99,
  },
  shareButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.isLargeDevice ? 24 : 16,
  },
  shareText: {
    fontSize: FontSize.middle,
    marginRight: 4,
    color: Color.brand5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 99,
  },
  editText: {
    fontSize: FontSize.small,
    marginRight: 4,
  },
});
