import { View } from 'react-native';
import React, { useContext } from 'react';

import { Avatar, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../_layout';
import auth from '@react-native-firebase/auth';
const UserScreen = () => {
  const userDetails = useContext(UserContext);
  return (
    <SafeAreaView
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar.Image
          shouldRasterizeIOS
          size={80}
          source={{ uri: userDetails.firebaseData.photoURL }}
        />
        <Text variant="displaySmall">{userDetails.firebaseData.displayName}</Text>
        <Text variant="titleSmall">({userDetails.firebaseData.email})</Text>
      </View>
      <Button
        textColor="red"
        shouldRasterizeIOS
        style={{
          marginTop: 10,
        }}
        onPress={() => {
          auth().signOut();
        }}
      >
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default UserScreen;
