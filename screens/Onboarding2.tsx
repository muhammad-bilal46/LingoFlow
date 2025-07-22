import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { common } from '../styles/common';
import ProgressDots from '../components/ProgressDots';
import LottieView from 'lottie-react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding2'>;

const animationSource = require('../assets/voc.json');

export default function Onboarding2({ navigation }: Props) {
  return (
    <GestureRecognizer
      onSwipeLeft={() => navigation.navigate('Onboarding3')}
      onSwipeRight={() => navigation.navigate('Onboarding1')}
      style={{ flex: 1 }}
    >
      <View style={common.container}>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={{ width: 250, height: 250, marginBottom: 32 }}
        />
        
        <Text style={common.title}>Smart Vocabulary</Text>
        <Text style={common.subtitle}>
          Learn new words in context and never forget them again.
        </Text>

        <TouchableOpacity
          style={common.button}
          onPress={() => navigation.navigate('Onboarding3')}
        >
          <Text style={common.buttonText}>Next</Text>
        </TouchableOpacity>

        <ProgressDots current={1} total={4} />
      </View>
    </GestureRecognizer>
  );
}
