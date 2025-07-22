import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { common } from '../styles/common';
import ProgressDots from '../components/ProgressDots';
import LottieView from 'lottie-react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding3'>;

const animationSource = require('../assets/Chat.json');

export default function Onboarding3({ navigation }: Props) {
  return (
    <GestureRecognizer
      onSwipeLeft={() => navigation.navigate('Onboarding4')}
      onSwipeRight={() => navigation.navigate('Onboarding2')}
      style={{ flex: 1 }}
    >
      <View style={common.container}>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={{ width: 250, height: 250, marginBottom: 32 }}
        />

        <Text style={common.title}>Real Conversations</Text>
        <Text style={common.subtitle}>
          Practice speaking with real-world dialogue simulations.
        </Text>

        <TouchableOpacity
          style={common.button}
          onPress={() => navigation.navigate('Onboarding4')}
        >
          <Text style={common.buttonText}>Next</Text>
        </TouchableOpacity>

        <ProgressDots current={2} total={4} />
      </View>
    </GestureRecognizer>
  );
}
