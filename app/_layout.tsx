import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-native-paper";
import { useEffect } from "react";
import "react-native-reanimated";
import React from "react";
import {
  PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import { Colors } from "@/constants/Colors"; // Your custom color file
import { useColorScheme } from "@/hooks/useColorScheme"; // Your hook for detecting system theme

const CustomDefaultTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...Colors.light,
  },
};

const CustomDarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...Colors.dark,
  },
};
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme =
    colorScheme === "dark" ? CustomDefaultTheme : CustomDefaultTheme;
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="map/[map]/index"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
