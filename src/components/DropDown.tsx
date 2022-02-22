import React, { useCallback, useRef, useState } from 'react';
import { Alert, Animated, View, StyleSheet } from 'react-native';
import { AppText, AppTouchableOpacity, AppView } from '@/appComponents';
import { Color, Colors, FontSize, Layout } from '@/constants';
import { Category } from '@/entities';
import { useTheme } from '@/hooks';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HandPointingIcon } from './SvgIcon';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeableItem, { OpenDirection, useSwipeableItemParams } from 'react-native-swipeable-item';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useAnimatedStyle } from 'react-native-reanimated';

// sample react-native-animatable > definitions > attention-seekers.js
const initAnimation = {
  0: { opacity: 1, rotate: '180deg' },
  1: { opacity: 1, rotate: '180deg' },
};
const rotateFront = {
  0: { opacity: 0.96, rotate: '0deg', scale: 1 },
  0.4: { opacity: 0.5, rotate: '180deg', scale: 0.7 },
  1: { opacity: 0.96, rotate: '360deg', scale: 1 },
};
const rotateBack = {
  0: { opacity: 0.96, rotate: '0deg', scale: 1 },
  0.6: { opacity: 0.5, rotate: '-180deg', scale: 0.7 },
  1: { opacity: 0.96, rotate: '-360deg', scale: 1 },
};
const rotateHalfFront = {
  0: { opacity: 1, rotate: '-180deg' },
  1: { opacity: 1, rotate: '0deg' },
};
const rotateHalfBack = {
  0: { opacity: 1, rotate: '0deg' },
  1: { opacity: 1, rotate: '-180deg' },
};

type DropDownProps = {
  activeId: string;
  categories: Category[];
  shadowOpacity?: number;
  categoryFontSize?: number;
  onPressAddCategory?: () => void;
  onPressCategory: (_: string) => void;
  onPressEdit: (_: Category) => void;
  setCategories: (_: Category[]) => void;
};

export const DropDown = (props: DropDownProps) => {
  const { theme } = useTheme();
  const [initialLoad, setInitialLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const [back, setBack] = useState(false);
  const itemRefs = useRef(new Map());
  const fontSize = props.categoryFontSize ?? FontSize.middle;

  const onPressAnimationIndex = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBack(!back);
  };

  const onPressToggle = () => {
    Haptics.selectionAsync();
    setOpen(!open);
  };

  const onPressCategory = (i: string) => {
    setOpen(false);
    props.onPressCategory(i);
  };

  const onSwipeLeft = (item: Category) => {
    props.setCategories(props.categories.filter((v) => v.id != item.id));
  };

  const shadowStyle = {
    shadowColor: Colors[theme].shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: props.shadowOpacity ?? 0.4,
    elevation: 4,
  };

  const renderItem = useCallback((params: RenderItemParams<Category>) => {
    return (
      <RowItem
        {...params}
        theme={theme}
        itemRefs={itemRefs}
        onPressItem={onPressCategory}
        onPressEdit={() => {
          setOpen(false);
          props.onPressEdit(params.item);
        }}
        onSwipeLeft={onSwipeLeft}
      />
    );
  }, []);

  return (
    <>
      <View style={styles.container}>
        {props.onPressAddCategory ? (
          <AppTouchableOpacity
            name="category_add"
            style={{
              width: 52,
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              marginRight: 4,
              backgroundColor: Colors[theme].background,
              ...shadowStyle,
            }}
            onPress={props.onPressAddCategory}
          >
            <MaterialIcons name="add" size={fontSize + 8} color={Colors[theme].text} />
          </AppTouchableOpacity>
        ) : (
          <></>
        )}
        <View style={{ flex: 1 }}>
          <Ripple
            rippleDuration={800}
            rippleColor={Color.brand50}
            rippleContainerBorderRadius={24}
            style={{
              minHeight: Layout.isLargeDevice ? 60 : 52,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 99,
              backgroundColor: Colors[theme].background,
              ...shadowStyle,
            }}
            onPress={onPressToggle}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {props.categories.find((v) => v.id == props.activeId)?.icon ? (
                <AppText style={{ width: fontSize + 4, fontSize }}>
                  {props.categories.find((v) => v.id == props.activeId)?.icon}
                </AppText>
              ) : (
                <></>
              )}
              <AppText
                style={{
                  fontSize: fontSize,
                  fontWeight: 'bold',
                  borderRadius: 8,
                  marginLeft: 4,
                }}
              >
                {props.categories.find((v) => v.id == props.activeId)?.title ?? null}
              </AppText>
            </View>
            <Animatable.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              duration={600}
              delay={initialLoad ? 200 : 0}
              animation={initialLoad ? initAnimation : open ? rotateHalfFront : rotateHalfBack}
            >
              <MaterialIcons name={'keyboard-arrow-up'} size={fontSize + 12} color={Colors[theme].description} />
            </Animatable.View>
          </Ripple>
        </View>
      </View>
      <Modal
        isVisible={open}
        animationIn="fadeInDown"
        animationOut="fadeOutUp"
        style={styles.modalWrapper}
        onBackdropPress={() => setOpen(false)}
      >
        <View style={styles.modal}>
          <View
            style={{
              width: '100%',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              locations={[0.4, 0.8]}
              colors={Color.brandGradation}
              style={{
                opacity: 0.9,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animatable.View
                animation={back ? rotateBack : rotateFront}
                onAnimationBegin={() => setInitialLoad(false)}
                duration={600}
                delay={initialLoad ? 200 : 0}
              >
                <AppTouchableOpacity name="logo_animation" onPress={onPressAnimationIndex}>
                  <HandPointingIcon size={Layout.window.height / 10} color={Color.brand5} />
                </AppTouchableOpacity>
              </Animatable.View>
            </LinearGradient>
          </View>
          <AppView style={styles.categoryWrap}>
            <DraggableFlatList
              containerStyle={{ flex: 1 }}
              keyExtractor={(item) => item.id}
              data={props.categories}
              renderItem={renderItem}
              onDragEnd={({ data }) => props.setCategories(data.map((v, i) => ({ ...v, sortIndex: i })))}
              activationDistance={20}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors[theme].border }} />}
            />
          </AppView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0.9,
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrapper: {
    flex: 1,
    height: '100%',
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    minHeight: Layout.isLargeDevice ? 480 : 360,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 12,
  },
  categoryWrap: {
    flex: 1,
    width: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    fontSize: FontSize.middle,
    marginRight: 2,
  },
  title: {
    fontSize: FontSize.middle,
    textAlign: 'left',
  },
});

const SWIPE_LEFT = 120;
const OVERSWIPE_DIST = 20;
type RowItemProps = {
  theme: 'light' | 'dark';
  item: Category;
  itemRefs: React.MutableRefObject<Map<any, any>>;
  drag: () => void;
  onPressItem: (_: string) => void;
  onPressEdit: (_: Category) => void;
  onSwipeLeft: (_: Category) => void;
};
const RowItem = (props: RowItemProps) => {
  return (
    <ScaleDecorator>
      <SwipeableItem
        key={props.item.id}
        item={props.item}
        ref={(ref) => {
          if (ref && !props.itemRefs.current.get(props.item.id)) {
            props.itemRefs.current.set(props.item.id, ref);
          }
        }}
        onChange={({ open }) => {
          if ([OpenDirection.LEFT, OpenDirection.RIGHT].includes(open)) {
            open == OpenDirection.LEFT &&
              Alert.alert('', '削除しますか？', [
                { text: 'キャンセル', onPress: () => {}, style: 'cancel' },
                {
                  text: 'OK',
                  onPress: () => props.onSwipeLeft(props.item),
                  style: 'destructive',
                },
              ]);
          }
          if (open) {
            [...props.itemRefs.current.entries()].forEach(([key, ref]) => {
              if (key !== props.item.id && ref) ref.close();
            });
          }
        }}
        overSwipe={OVERSWIPE_DIST}
        renderUnderlayLeft={() => <UnderlayLeft drag={props.drag} />}
        snapPointsLeft={[SWIPE_LEFT]}
      >
        <AppView
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}
        >
          <AppTouchableOpacity
            name="category_selected"
            id={props.item.id}
            style={styles.category}
            onPress={() => props.onPressItem(props.item.id)}
          >
            <AppText style={styles.icon}>{props.item.icon ?? ''}</AppText>
            <AppText style={styles.title}>{props.item.title}</AppText>
          </AppTouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <AppTouchableOpacity
              name="category_edit"
              id={props.item.id}
              style={{ marginRight: 4 }}
              onPress={() => props.onPressEdit(props.item)}
              delayLongPress={100}
            >
              <MaterialIcons name="edit" size={FontSize.middle + 6} color={Colors[props.theme].inactiveTint} />
            </AppTouchableOpacity>
            <AppTouchableOpacity name="category_drag" id={props.item.id} onPressIn={props.drag} delayLongPress={100}>
              <MaterialIcons
                name="drag-indicator"
                size={FontSize.middle + 6}
                color={Colors[props.theme].inactiveTint}
              />
            </AppTouchableOpacity>
          </View>
        </AppView>
      </SwipeableItem>
    </ScaleDecorator>
  );
};

const UnderlayLeft = ({ drag }: { drag: () => void }) => {
  const { percentOpen, item } = useSwipeableItemParams<Category>();
  const animStyle = useAnimatedStyle(
    () => ({
      opacity: percentOpen.value,
    }),
    [percentOpen],
  );

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: (SWIPE_LEFT - 32) / 2,
          backgroundColor: Color.denger,
        },
        animStyle,
      ]}
    >
      <AppTouchableOpacity name="category_delete" id={item.id} onPressIn={drag}>
        <MaterialCommunityIcons name="trash-can-outline" size={32} color={Color.brand5} />
      </AppTouchableOpacity>
    </Animated.View>
  );
};
