import React, { ReactElement, Ref, useCallback, useEffect } from "react";
import { ListRenderItemInfo } from "@shopify/flash-list";
import { FlashList, FlashListProps } from "@shopify/flash-list";

import Animated, {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type FadeInProps = {
  index: number;
  children: ReactElement;
  parallelItems: number;
  animationValue: SharedValue<number>;
};

const FadeInComponent = ({
  index,
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

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

type PropTypes<ItemT> = FlashListProps<ItemT> & {
  itemsToFadeIn?: number;
  initialDelay?: number;
  durationPerItem?: number;
  parallelItems?: number;
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

export default FadeFlatList;
