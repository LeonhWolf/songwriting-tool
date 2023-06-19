import type {
  Global,
  Register,
  RegistrationPending,
  ConfirmRegistration,
  Login,
  Home,
  NavItems,
  Sidebar,
  Form,
  Toast,
  ExportData,
} from "./i18n.types";

const global: Global = {
  appTitle: "Songwriting Tool",
};

const register: Register = {
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

const registrationPending: RegistrationPending = {
  title: "Registration Pending",
  subtitle: "You're close to getting started",
  bodyText1:
    "You should receive an email if you haven't registered already with this email address.",
  bodyText2: "Confirm your account by clicking the link in the email.",
};

const confirmRegistration: ConfirmRegistration = {
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

const login: Login = {
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

const home: Home = {
  title: "Home",
  tiles: {
    dailyExercise: "Start Daily Exercise",
    archive: "Archive",
  },
};

const navItems: NavItems = {
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
const sidebar: Sidebar = {
  settings: {
    parent: "Settings",
    exercise: "Exercise",
    user: "User",
  },
};

const form: Form = {
  inputMissingMessage: "Please provide a {{inputTitle}}.",
  weakPassword:
    "You picked one of the 200 weakest passwords. It is strongly advised to chooses another password!",
  passwordTooShort: "at least 8 characters long",
};

const toast: Toast = {
  serverError: "Your request did not go through. There was a server error.",
};

const exportData: ExportData = {
  global,
  register,
  registrationPending,
  confirmRegistration,
  login,
  home,
  navItems,
  sidebar,
  form,
  toast,
};

export default exportData;
