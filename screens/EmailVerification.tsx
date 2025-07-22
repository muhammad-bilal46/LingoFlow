import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { common } from '../styles/common';
import type { RootStackParamList } from '../types/navigation';



const EmailVerification = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email, password } = route.params as {
    email: string;
    password: string;
  };

  const [code, setCode] = useState(['', '', '', '']);
  const inputsRef = useRef<(TextInput | null)[]>(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await sendVerificationEmail();
      Alert.alert('Success', 'Verification code resent successfully!');
    } catch (error: any) {
      console.error('Error:', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend verification code.');
    }
  };

  const handleSubmit = async () => {
    if (code.some(digit => digit === '')) {
      Alert.alert('Error', 'Please enter all digits of the verification code.');
      return;
    }

    const verificationCode = code.join('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        navigation.navigate('SignupStepTwo', {
          first_name: '',
          last_name: '',
          email,
          password,
        });
      } else {
        Alert.alert('Error', response.data.message || 'Invalid verification code.');
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to verify email.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, { 
        email,
        password
      });
    } catch (error: any) {
      console.error('Error:', error.response?.data || error);
      throw error;
    }
  };

  useEffect(() => {
    // Send verification email when screen loads
    sendVerificationEmail();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.brandName}>LingoFlow</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.subtitle}>Get Your Code</Text>
            <Text style={styles.instruction}>
              Please Enter your 4 digit code that is sent on your given email address.
            </Text>

            <View style={styles.codeInputs}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => {
                    if (el) {
                      inputsRef.current[index] = el;
                    }
                  }}
                  style={styles.codeInput}
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleChange(index, value)}
                  keyboardType="number-pad"
                />
              ))}
            </View>

            <Text style={styles.resend}>
              You Don't receive Code?{' '}
              <Text style={styles.resendLink} onPress={handleResend}>
                Resend
              </Text>
            </Text>

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Verify and Proceed</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  resend: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  resendLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailVerification;
