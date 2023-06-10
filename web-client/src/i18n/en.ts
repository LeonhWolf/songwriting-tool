import type {
  IRegister,
  IRegistrationPending,
  IConfirmRegistration,
  ILogin,
  IHome,
  INavItems,
  IForm,
  IToast,
  IExportData,
} from "./i18n.types";

const register: IRegister = {
  title: "Create an Account",
  subtitle: "Start shopping smart!",
  firstName: {
    labelText: "First name",
    placeholder: "Enter your first name",
    text: "first name",
  },
  lastName: {
    labelText: "Last name",
    placeholder: "Enter your last name",
    text: "last name",
  },
  email: {
    labelText: "Email",
    placeholder: "Enter your email",
    text: "email",
  },
  password: {
    labelText: "Password",
    placeholder: "Enter your password",
    text: "password",
  },
  buttonText: "Sign Up",
  accountAlready: "Already have an account?",
  logIn: "Log in",
};

const registrationPending: IRegistrationPending = {
  title: "Registration Pending",
  subtitle: "You're close to getting started",
  bodyText1:
    "You should receive an email if you haven't registered already with this email address.",
  bodyText2: "Confirm your account by clicking the link in the email.",
};

const confirmRegistration: IConfirmRegistration = {
  title: "Confirm Registration",
  subtitle: "You're almost finished setting up",
  bodyText:
    "Your will be redirected as soon as your account registration is confirmed.",
  success:
    "Your registration is now confirmed. You will be redirected within 5 seconds.",
  idIsExpired:
    "The id for your confirmation has expired. Please register again.",
  urlIsInvalid:
    "Your confirmation link is invalid. Make sure you copy & paste it from the email.",
};

const login: ILogin = {
  title: "Login to Your Account",
  subtitle: "Welcome back! Please enter your details.",
  email: {
    labelText: "Email",
    placeholder: "Enter your email",
    text: "email",
  },
  password: {
    labelText: "Password",
    placeholder: "Enter your password",
    text: "password",
  },
  rememberMeText: "Remember me",
  forgotPasswordText: "Forgot password",
  loginButtonText: "Login",
  noAccountText: "Don't have an account?",
  signUpText: "Sign up",
  wrongCredentials: "The email and/or password you provided is wrong.",
};

const home: IHome = {
  title: "Home",
  tiles: {
    dailyExercise: "Start Daily Exercise",
    archive: "Archive",
  },
};

const navItems: INavItems = {
  register: "Registration",
  registrationPending: "Registration Pending",
  confirmRegistration: "Confirm Registration",
  login: "Login",
  home: "Home",
  dailyExercise: "Daily Exercise",
  archive: "Archive",
  exerciseSettings: "Exercise Settings",
  userSettings: "User Settings",
};

const form: IForm = {
  inputMissingMessage: "Please provide a {{inputTitle}}.",
  weakPassword:
    "You picked one of the 200 weakest passwords. It is strongly advised to chooses another password!",
  passwordTooShort: "at least 8 characters long",
};

const toast: IToast = {
  serverError: "Your request did not go through. There was a server error.",
};

const exportData: IExportData = {
  register,
  registrationPending,
  confirmRegistration,
  login,
  home,
  navItems,
  form,
  toast,
};

export default exportData;
