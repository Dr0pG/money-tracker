import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

export type ColorName = keyof typeof Colors.light;

interface ThemeColorProps {
  light?: string;
  dark?: string;
}

export function useThemeColor(
  props: ThemeColorProps,
  colorName: ColorName
): string;
export function useThemeColor(
  props: ThemeColorProps,
  colorNames: ColorName[]
): string[];
export function useThemeColor(
  props: ThemeColorProps,
  colorNames: ColorName | ColorName[]
): string | string[] {
  const { theme } = useTheme();

  const getColor = (name: ColorName): string => {
    const colorFromProps = props[theme];
    return colorFromProps ?? Colors[theme][name];
  };

  if (Array.isArray(colorNames)) {
    return colorNames.map(getColor);
  } else {
    return getColor(colorNames);
  }
}
