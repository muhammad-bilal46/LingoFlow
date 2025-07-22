import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../config';
import { common } from '../styles/common';

const ForgotPassword = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email,
      });

      Alert.alert(
        'Check Your Email',
        'If the email exists, we’ve sent instructions to reset your password.'
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={common.container} keyboardShouldPersistTaps="handled">
        <Text style={common.title}>Reset Password</Text>
        <Text style={common.subtitle}>
          Enter your email address and we’ll send you instructions to reset your password.
        </Text>

        <TextInput
          style={common.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TouchableOpacity
          style={[common.button, loading && { opacity: 0.6 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={common.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
