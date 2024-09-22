import { Tabs } from "expo-router";
import React, { useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from ".";
import TabTwoScreen from "./explore";

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  // return (
  //   <Tabs
  //     screenOptions={{
  //       tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
  //       headerShown: false,
  //     }}>
  //     <Tabs.Screen
  //       name="index"
  //       options={{
  //         title: 'Maps',
  //         tabBarIcon: ({ color, focused }) => (
  //           <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
  //         ),
  //       }}
  //     />
  //     <Tabs.Screen
  //       name="explore"
  //       options={{
  //         title: 'Account',
  //         tabBarIcon: ({ color, focused }) => (
  //           <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
  //         ),
  //       }}
  //     />
  //   </Tabs>
  // );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "maps",
      title: "Sites",
      focusedIcon: "map-marker",
      unfocusedIcon: "map-marker-outline",
    },
    {
      key: "account",
      title: "Account",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    maps: HomeScreen,
    account: TabTwoScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
