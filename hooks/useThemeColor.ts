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
): string {
  const { theme } = useTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
