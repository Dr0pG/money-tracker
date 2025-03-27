import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import React, { memo, ReactElement, Ref, useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TouchableOpacity from "./TouchableOpacity";

type FadeInProps = {
  index: number;
  onDelete?: () => void;
  children: ReactElement;
  parallelItems: number;
  animationValue: SharedValue<number>;
};

function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  onDelete: () => void
) {
  const backgroundRed = useThemeColor({}, "error");
  const iconColor = useThemeColor({}, "text");

  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + Metrics.trashSize }],
    };
  });

  return (
    <Animated.View style={styleAnimation}>
      <TouchableOpacity onPress={onDelete}>
        <View style={[styles.rightAction, { backgroundColor: backgroundRed }]}>
          <FontAwesome
            name="trash"
            size={Metrics.trashDeleteIcon}
            color={iconColor}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const FadeInComponent = ({
  index,
  onDelete,
  children,
  parallelItems,
  animationValue,
}: FadeInProps) => {
  const moveBy = (1 - 1 / parallelItems) * index;

  const animatedStyle = useAnimatedStyle(() => {
    const progress = animationValue.value;

    // Define smooth input/output ranges for opacity
    const startFadeIn = index - moveBy;
    const endFadeIn = index + 1 - moveBy;

    const opacity =
      progress < startFadeIn
        ? 0
        : progress > endFadeIn
          ? 1
          : (progress - startFadeIn) / (endFadeIn - startFadeIn); // Linear interpolation

    return { opacity };
  });

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(
          prog: SharedValue<number>,
          drag: SharedValue<number>
        ) => RightAction(prog, drag, onDelete)}
      >
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

type PropTypes<ItemT> = FlashListProps<ItemT> & {
  itemsToFadeIn?: number;
  initialDelay?: number;
  durationPerItem?: number;
  parallelItems?: number;
  onDeleteItem?: (id: string) => void;
};

const FadeFlatList = React.forwardRef(
  <ItemT,>(
    {
      initialDelay = 0,
      itemsToFadeIn = 10,
      durationPerItem = 500,
      parallelItems = 5,
      renderItem: originalRenderItem,
      ItemSeparatorComponent,
      onDeleteItem,
      ...props
    }: PropTypes<ItemT>,
    ref: Ref<FlashList<ItemT>>
  ): ReactElement => {
    const animationValue = useSharedValue(0);

    // Trigger animation with a delay using runOnJS.
    useEffect(() => {
      const startAnimation = () => {
        animationValue.value = withTiming(itemsToFadeIn + 1, {
          duration: itemsToFadeIn * durationPerItem,
          easing: Easing.inOut(Easing.ease),
        });
      };

      if (initialDelay > 0) {
        const timeoutId = setTimeout(
          () => runOnJS(startAnimation)(),
          initialDelay
        );
        return () => clearTimeout(timeoutId);
      } else {
        startAnimation();
      }
    }, [initialDelay, durationPerItem, itemsToFadeIn]);

    // Memoized item renderer
    const renderItem = useCallback(
      (info: ListRenderItemInfo<ItemT>): React.ReactElement | null => {
        const renderedItem = originalRenderItem!(info);
        if (!renderedItem) {
          // Handle null case explicitly (e.g., return null or a fallback element).
          return null;
        }

        return info.index < itemsToFadeIn ? (
          <FadeInComponent
            index={info.index}
            onDelete={() => onDeleteItem?.(info?.item?.id || "")}
            parallelItems={parallelItems}
            animationValue={animationValue}
          >
            {renderedItem}
          </FadeInComponent>
        ) : (
          renderedItem
        );
      },
      [itemsToFadeIn, parallelItems, animationValue, originalRenderItem]
    );

    // Memoized separator renderer
    const renderSeparator = useCallback(
      (info: { leadingItem: ItemT | null; index: number }) =>
        ItemSeparatorComponent ? (
          <FadeInComponent
            index={info.index}
            parallelItems={parallelItems}
            animationValue={animationValue}
          >
            <ItemSeparatorComponent />
          </FadeInComponent>
        ) : null,
      [ItemSeparatorComponent, parallelItems, animationValue]
    );

    return (
      <FlashList
        {...props}
        ref={ref}
        renderItem={renderItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={
          ItemSeparatorComponent
            ? ({ leadingItem }) => renderSeparator(leadingItem?.index)
            : undefined
        }
      />
    );
  }
);

FadeFlatList.displayName = "FadeFlatList";

const styles = StyleSheet.create({
  rightAction: {
    width: Metrics.trashSize,
    height: Metrics.mediumPadding * 2 + 40,
    borderTopRightRadius: Metrics.largeRadius,
    borderBottomRightRadius: Metrics.largeRadius,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(FadeFlatList);
