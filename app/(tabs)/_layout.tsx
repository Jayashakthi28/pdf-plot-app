import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from '.';
import UserScreen from './user';

export default function TabLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'maps',
      title: 'Sites',
      focusedIcon: 'map-marker',
      unfocusedIcon: 'map-marker-outline',
    },
    {
      key: 'account',
      title: 'Account',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    maps: HomeScreen,
    account: UserScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
