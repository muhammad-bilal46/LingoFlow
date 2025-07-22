import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from './types/navigation';

import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import Onboarding3 from './screens/Onboarding3';
import Onboarding4 from './screens/Onboarding4';

import LoginScreen from './screens/Login';
import MainApp from './screens/MainApp';
import SignupStepOne from './screens/SignupStepOne';
import SignupStepTwo from './screens/SignupStepTwo';
import ForgotPassword from './screens/ForgotPassword';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      setFirstLaunch(completed === null);
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {firstLaunch ? (
          <>
            <Stack.Screen name="Onboarding1" component={Onboarding1} />
            <Stack.Screen name="Onboarding2" component={Onboarding2} />
            <Stack.Screen name="Onboarding3" component={Onboarding3} />
            <Stack.Screen name="Onboarding4" component={Onboarding4} />
          </>
        ) : null}

        {/* Shared screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignupStepOne" component={SignupStepOne} />
        <Stack.Screen name="SignupStepTwo" component={SignupStepTwo} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}