import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-native-paper';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import React from 'react';
import {
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { Colors } from '@/constants/Colors'; 
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from '@/components/LoginScreen';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import axios from 'axios';

const CustomDefaultTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...Colors.light,
  },
};

SplashScreen.preventAutoHideAsync();

export const UserContext = createContext(null);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDefaultTheme : CustomDefaultTheme;
  const [userDetails, setUserDetails]: any = useState();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const signinWithBackend = async (fireBaseJson: FirebaseAuthTypes.User) => {
    const res = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth`, {
      name: fireBaseJson.displayName,
      email: fireBaseJson.email,
    });
    return res.data;
  };

  async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      const backendUserDetail: any = await signinWithBackend(user);
      setUserDetails({
        firebaseData: user,
        id: backendUserDetail._id,
      });
    } else {
      setUserDetails(null);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider theme={theme}>
      <UserContext.Provider value={userDetails}>
        {!userDetails && <LoginScreen />}
        {userDetails && (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="map/[map]/index"
              options={{
                headerShown: true,
                headerTitle: '',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
      </UserContext.Provider>
    </Provider>
  );
}
