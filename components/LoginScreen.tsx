import React from 'react';
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onGoogleButtonPress } from '../services/authServices';

export default function LoginScreen() {
  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        icon={props => <Ionicons color={props.color} size={props.size} name="logo-google" />}
        mode="contained-tonal"
        onPress={onGoogleButtonPress}
      >
        Continue with Google
      </Button>
    </View>
  );
}
