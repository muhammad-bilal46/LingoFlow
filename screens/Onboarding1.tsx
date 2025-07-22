import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { common } from '../styles/common';
import ProgressDots from '../components/ProgressDots';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding1'>;

const logo = require('../assets/logo.png');

export default function Onboarding1({ navigation }: Props) {
  const handleSwipeLeft = () => {
    navigation.navigate('Onboarding2');
  };

  return (
    <GestureRecognizer onSwipeLeft={handleSwipeLeft} style={{ flex: 1 }}>
      <View style={common.container}>
        <Image
          source={logo}
          style={{ width: 200, height: 200, marginBottom: 32 }}
          resizeMode="contain"
        />

        <Text style={common.subtitle}>
          Master languages effortlessly with personalized learning.
        </Text>

        <TouchableOpacity style={common.button} onPress={() => navigation.navigate('Onboarding2')}>
          <Text style={common.buttonText}>Next</Text>
        </TouchableOpacity>

        <ProgressDots current={0} total={4} />
      </View>
    </GestureRecognizer>
  );
}
