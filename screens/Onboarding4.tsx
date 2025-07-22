import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { common } from '../styles/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import ProgressDots from '../components/ProgressDots';
import GestureRecognizer from 'react-native-swipe-gestures';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding4'>;

const animationSource = require('../assets/air.json');

export default function Onboarding4({ navigation }: Props) {
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'false');
      navigation.replace('Login');
    } catch (e) {
      console.error('Failed to save onboarding status', e);
    }
  };

  return (
    <GestureRecognizer
      onSwipeRight={() => navigation.navigate('Onboarding3')}
      onSwipeLeft={finishOnboarding} // Optional: swipe left to finish too
      style={{ flex: 1 }}
    >
      <View style={common.container}>
        <LottieView
          source={animationSource}
          autoPlay
          loop={false}
          style={{ width: 250, height: 250, marginBottom: 32 }}
        />

        <Text style={common.title}>Let’s Get Started</Text>
        <Text style={common.subtitle}>
          Create your account and start learning today.
        </Text>

        <TouchableOpacity style={common.button} onPress={finishOnboarding}>
          <Text style={common.buttonText}>Start Now</Text>
        </TouchableOpacity>

        <ProgressDots current={3} total={4} />
      </View>
    </GestureRecognizer>
  );
}
