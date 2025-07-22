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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import { common } from '../styles/common';

type RootStackParamList = {
  SignupStepTwo: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  Login: undefined;
};

const SignupStepTwo = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const { first_name, last_name, email, password } = route.params as {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };

  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const validateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 13;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateConfirm = (date) => {
    setDateOfBirth(date);
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleSignup = async () => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim();

    if (!trimmedUsername || !trimmedPhone || !trimmedCity || !trimmedCountry || !dateOfBirth) {
      Alert.alert('Error', 'Please fill in all fields including date of birth.');
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      Alert.alert('Invalid Phone', 'Enter a valid phone number.');
      return;
    }

    if (!validateAge(dateOfBirth)) {
      Alert.alert('Age Requirement', 'You must be at least 13 years old to create an account.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        first_name,
        last_name,
        email,
        password,
        username: trimmedUsername,
        phone_number: trimmedPhone,
        city: trimmedCity,
        country: trimmedCountry,
        date_of_birth: dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Signup Failed', message);
    }
  };

  return (
    <>
      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        maximumDate={new Date()} // Prevent future dates
        minimumDate={new Date(1900, 0, 1)} // Set reasonable minimum date
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={common.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={common.title}>Create Account</Text>
            <Text style={common.subtitle}>Step 2 of 2</Text>

            <TextInput
              style={common.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <TextInput
              style={common.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={common.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
            
            <TextInput
              style={common.input}
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
              autoCapitalize="words"
            />

            {/* Date of Birth Field */}
            <TouchableOpacity
              style={[common.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, !dateOfBirth && styles.placeholderText]}>
                {dateOfBirth ? formatDate(dateOfBirth) : 'Date of Birth'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={common.button} onPress={handleSignup}>
              <Text style={common.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dateInput: {
    justifyContent: 'center',
    paddingVertical: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#888',
  },
});

export default SignupStepTwo;