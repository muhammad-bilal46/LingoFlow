export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Login: undefined;
  SignupStepOne: undefined;
  EmailVerification: {
    email: string;
    password: string;
  };
  SignupStepTwo: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  ForgotPassword: undefined;
  MainApp: undefined;
};
