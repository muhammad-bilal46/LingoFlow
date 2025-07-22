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
  Image,
  Modal,
} from 'react-native';
import LottieView from 'lottie-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import { common } from '../styles/common';

type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
};

const loginAnimation = require('../assets/login3.json');
const loadingAnimation = require('../assets/loading.json');
const logoImage = require('../assets/logo.png');
const googleIcon = require('../assets/google-icon.png');

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup Step 1 states
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Signup Step 2 states
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null); // Moved to step 2
  const [showDatePicker, setShowDatePicker] = useState(false); // Date picker visibility
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    signupEmail: '', 
    signupPassword: '',
    confirmPassword: '',
    username: '',
    phoneNumber: '',
    city: '',
    country: '',
    dateOfBirth: '', // Now in step 2 validation
  });
  const [activeTab, setActiveTab] = useState('Login');
  const [signupStep, setSignupStep] = useState(1);

  const validateLoginForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = { ...errors, email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateSignupStepOne = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = { 
      ...errors, 
      firstName: '', 
      lastName: '', 
      signupEmail: '', 
      signupPassword: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!signupEmail.trim()) {
      newErrors.signupEmail = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(signupEmail)) {
      newErrors.signupEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (!signupPassword) {
      newErrors.signupPassword = 'Password is required';
      isValid = false;
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (signupPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateSignupStepTwo = () => {
    const newErrors = { 
      ...errors, 
      username: '', 
      phoneNumber: '', 
      city: '', 
      country: '',
      dateOfBirth: '' // Now validating date of birth in step 2
    };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!country.trim()) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    // Validate date of birth
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    } else {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier: email,
        password,
      });

      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Login failed', 'Invalid email or password');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignupStepOneNext = () => {
    if (!validateSignupStepOne()) return;
    setSignupStep(2);
  };

  const handleSignupStepTwoBack = () => {
    setSignupStep(1);
    setErrors({
      ...errors,
      username: '',
      phoneNumber: '',
      city: '',
      country: '',
      dateOfBirth: '' // Clear date of birth error when going back
    });
  };

  const handleDateConfirm = (date) => {
    setDateOfBirth(date);
    setShowDatePicker(false);
    setErrors({ ...errors, dateOfBirth: '' });
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFinalSignup = async () => {
    if (!validateSignupStepTwo()) return;
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: signupEmail,
        password: signupPassword,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
        username,
        phone_number: phoneNumber,
        city,
        country,
      });
      
      setLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset all form states
            setFirstName('');
            setMiddleName('');
            setLastName('');
            setSignupEmail('');
            setSignupPassword('');
            setConfirmPassword('');
            setDateOfBirth(null); // Reset date of birth
            setUsername('');
            setPhoneNumber('');
            setCity('');
            setCountry('');
            setSignupStep(1);
            setActiveTab('Login');
          }
        }
      ]);
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    setSignupStep(1);
    setErrors({
      email: '', 
      password: '', 
      firstName: '', 
      lastName: '', 
      signupEmail: '', 
      signupPassword: '',
      confirmPassword: '',
      username: '',
      phoneNumber: '',
      city: '',
      country: '',
      dateOfBirth: '' // Reset date of birth error
    });
    setShowPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
  };

  const renderPasswordInput = (
    value,
    onChangeText,
    placeholder,
    showPassword,
    setShowPassword,
    errorKey,
    disabled = false
  ) => (
    <View style={styles.passwordContainer}>
      <TextInput
        style={[
          styles.inputAlt,
          styles.passwordInput,
          errors[errorKey] && styles.inputError
        ]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        editable={!disabled}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        <Text style={styles.eyeIcon}>
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoginForm = () => (
    <View style={styles.formContainerAlt}>
      <TextInput
        style={[styles.inputAlt, errors.email && styles.inputError]}
        placeholder="Enter email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: '' });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      {renderPasswordInput(
        password,
        (text) => {
          setPassword(text);
          setErrors({ ...errors, password: '' });
        },
        "Password",
        showPassword,
        setShowPassword,
        'password',
        loading
      )}
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TouchableOpacity 
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonAlt, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Log In'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignupStepOne = () => (
    <View style={styles.formContainerAlt}>
      <Text style={styles.stepText}>Step 1 of 2</Text>
      
      <TextInput
        style={[styles.inputAlt, errors.firstName && styles.inputError]}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setErrors({ ...errors, firstName: '' });
        }}
        editable={!loading}
      />
      {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

      <TextInput
        style={styles.inputAlt}
        placeholder="Middle Name (Optional)"
        placeholderTextColor="#888"
        value={middleName}
        onChangeText={setMiddleName}
        editable={!loading}
      />

      <TextInput
        style={[styles.inputAlt, errors.lastName && styles.inputError]}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          setErrors({ ...errors, lastName: '' });
        }}
        editable={!loading}
      />
      {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

      <TextInput
        style={[styles.inputAlt, errors.signupEmail && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#888"
        value={signupEmail}
        onChangeText={(text) => {
          setSignupEmail(text);
          setErrors({ ...errors, signupEmail: '' });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      {errors.signupEmail ? <Text style={styles.errorText}>{errors.signupEmail}</Text> : null}

      {renderPasswordInput(
        signupPassword,
        (text) => {
          setSignupPassword(text);
          setErrors({ ...errors, signupPassword: '' });
        },
        "Password",
        showSignupPassword,
        setShowSignupPassword,
        'signupPassword',
        loading
      )}
      {errors.signupPassword ? <Text style={styles.errorText}>{errors.signupPassword}</Text> : null}

      {renderPasswordInput(
        confirmPassword,
        (text) => {
          setConfirmPassword(text);
          setErrors({ ...errors, confirmPassword: '' });
        },
        "Confirm Password",
        showConfirmPassword,
        setShowConfirmPassword,
        'confirmPassword',
        loading
      )}
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity
        style={[styles.buttonAlt, loading && styles.buttonDisabled]}
        onPress={handleSignupStepOneNext}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignupStepTwo = () => (
    <View style={styles.formContainerAlt}>
      <Text style={styles.stepText}>Step 2 of 2</Text>
      
      <TextInput
        style={[styles.inputAlt, errors.username && styles.inputError]}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors({ ...errors, username: '' });
        }}
        editable={!loading}
      />
      {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

      <TextInput
        style={[styles.inputAlt, errors.phoneNumber && styles.inputError]}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          setErrors({ ...errors, phoneNumber: '' });
        }}
        keyboardType="phone-pad"
        editable={!loading}
      />
      {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

      <TextInput
        style={[styles.inputAlt, errors.city && styles.inputError]}
        placeholder="City"
        placeholderTextColor="#888"
        value={city}
        onChangeText={(text) => {
          setCity(text);
          setErrors({ ...errors, city: '' });
        }}
        editable={!loading}
      />
      {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

      <TextInput
        style={[styles.inputAlt, errors.country && styles.inputError]}
        placeholder="Country"
        placeholderTextColor="#888"
        value={country}
        onChangeText={(text) => {
          setCountry(text);
          setErrors({ ...errors, country: '' });
        }}
        editable={!loading}
      />
      {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}

      {/* Date of Birth Field - Now in Step 2 */}
      <TouchableOpacity
        style={[styles.inputAlt, styles.dateInput, errors.dateOfBirth && styles.inputError]}
        onPress={() => setShowDatePicker(true)}
        disabled={loading}
      >
        <Text style={[styles.dateText, !dateOfBirth && styles.placeholderText]}>
          {dateOfBirth ? formatDate(dateOfBirth) : 'Date of Birth'}
        </Text>
      </TouchableOpacity>
      {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}

      <TouchableOpacity
        style={[styles.buttonAlt, loading && styles.buttonDisabled]}
        onPress={handleFinalSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentForm = () => {
    if (activeTab === 'Login') {
      return renderLoginForm();
    } else {
      return signupStep === 1 ? renderSignupStepOne() : renderSignupStepTwo();
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

      {/* Loading Modal */}
      <Modal
        visible={loading}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <LottieView
              source={loadingAnimation}
              autoPlay
              loop
              style={styles.modalLottie}
            />
            <Text style={styles.loadingText}>
              {activeTab === 'Login' ? 'Logging you in...' : 
               signupStep === 2 ? 'Creating account...' : 'Processing...'}
            </Text>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <Image source={logoImage} style={styles.logoImage} />

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Login' ? styles.tabActive : styles.tabInactive]}
                onPress={() => handleTabPress('Login')}
              >
                <Text style={[styles.tabText, activeTab === 'Login' ? styles.tabTextActive : styles.tabTextInactive]}>
                  Log In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'SignUp' ? styles.tabActive : styles.tabInactive]}
                onPress={() => handleTabPress('SignUp')}
              >
                <Text style={[styles.tabText, activeTab === 'SignUp' ? styles.tabTextActive : styles.tabTextInactive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {renderCurrentForm()}

            {(activeTab === 'Login' || (activeTab === 'SignUp' && signupStep === 1)) && (
              <>
                <Text style={styles.orText}>OR</Text>
                
                <TouchableOpacity style={styles.googleButton}>
                  <View style={styles.googleIconContainer}>
                    <Image
                      source={googleIcon}
                      style={styles.googleIcon}
                    />
                  </View>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.link}>Terms of Service</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logoImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#00A6FE',
  },
  tabInactive: {
    backgroundColor: '#f2f2f2',
  },
  tabText: {
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#555',
    fontWeight: '500',
  },
  formContainerAlt: {
    width: '100%',
    gap: 14,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  inputAlt: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#888',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#666',
  },
  inputError: {
    borderColor: '#e53e3e',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 5,
  },
  forgotPasswordText: {
    color: '#00A6FE',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonAlt: {
    backgroundColor: '#00A6FE',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#00A6FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#99cfe0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    marginVertical: 16,
    fontSize: 14,
    color: '#888',
  },
  googleButton: {
    marginBottom: 20,
  },
  googleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginHorizontal: 20,
    marginTop: 10,
  },
  link: {
    color: '#00A6FE',
    textDecorationLine: 'underline',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalLottie: {
    width: 120,
    height: 120,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});