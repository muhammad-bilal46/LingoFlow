import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import { common } from '../styles/common';

import type { RootStackParamList } from '../types/navigation';

const SignupStepOne = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePassword = (password: string) => password.trim().length >= 6;
  const validatePasswordMatch = () => password.trim() === confirmPassword.trim();

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    validateEmail(email) &&
    validatePassword(password) &&
    validatePasswordMatch();

  const handleNext = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!isFormValid) {
      Alert.alert('Error', 'Please correct the errors before continuing.');
      return;
    }

    if (!validatePasswordMatch()) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    navigation.navigate('EmailVerification', {
      email: trimmedEmail,
      password: trimmedPassword,
    });
  };

  const RequiredLabel = ({ text }: { text: string }) => (
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{text}</Text>
      <Text style={styles.requiredStar}>*</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={common.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={common.title}>Create Account</Text>
        <Text style={common.subtitle}>Step 1 of 2</Text>

        {/* Personal Info Heading */}
        <Text style={styles.sectionHeading}>Personal Info</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar} />
        </View>

        {/* First Name with Red Star */}
        <RequiredLabel text="First Name" />
        <TextInput
          style={common.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        {/* Middle Name (Optional) */}
        <Text style={styles.optionalLabel}>Middle Name</Text>
        <TextInput
          style={common.input}
          placeholder="Middle Name (Optional)"
          value={middleName}
          onChangeText={setMiddleName}
          autoCapitalize="words"
        />

        {/* Last Name with Red Star */}
        <RequiredLabel text="Last Name" />
        <TextInput
          style={common.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        {/* Email with Red Star */}
        <RequiredLabel text="Email" />
        <TextInput
          style={common.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {email !== '' && !validateEmail(email) && (
          <Text style={styles.errorText}>Please enter a valid email address.</Text>
        )}

        {/* Password with Red Star */}
        <RequiredLabel text="Password" />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[common.input, { flex: 1 }]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        {password !== '' && !validatePassword(password) && (
          <Text style={styles.errorText}>Password must be at least 6 characters.</Text>
        )}

        {/* Confirm Password with Red Star */}
        <RequiredLabel text="Confirm Password" />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[common.input, { flex: 1 }]}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text style={styles.toggleText}>
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        {confirmPassword !== '' && !validatePasswordMatch() && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[common.button, !isFormValid && styles.disabledButton]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={common.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    marginTop: 10,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginVertical: 20,
  },
  progressBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  requiredStar: {
    color: 'red',
    fontSize: 16,
    marginLeft: 2,
    fontWeight: 'bold',
  },
  optionalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    color: '#4A90E2',
    marginLeft: 10,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default SignupStepOne;