import type { Paths } from "../router";

export interface Global {
  appTitle: string;
}
interface Input {
  labelText: string;
  placeholder: string;
  text: string;
}

export interface Register {
  title: string;
  subtitle: string;
  firstName: Input;
  lastName: Input;
  email: Input;
  password: Input;
  buttonText: string;
  accountAlready: string;
  logIn: string;
}
export interface RegistrationPending {
  title: string;
  subtitle: string;
  bodyText1: string;
  bodyText2: string;
}
export interface ConfirmRegistration {
  title: string;
  subtitle: string;
  bodyText: string;
  success: string;
  idIsExpired: string;
  urlIsInvalid: string;
}
export interface Login {
  title: string;
  subtitle: string;
  email: Input;
  password: Input;
  rememberMeText: string;
  forgotPasswordText: string;
  loginButtonText: string;
  noAccountText: string;
  signUpText: string;
  wrongCredentials: string;
}
export interface Home {
  title: string;
  tiles: {
    dailyExercise: string;
    archive: string;
  };
}

export interface NavItems extends Paths<string> {}
export interface Sidebar {
  settings: {
    parent: string;
    exercise: string;
    user: string;
  };
}
export interface Form {
  inputMissingMessage: string;
  weakPassword: string;
  passwordTooShort: string;
}
export interface Toast {
  serverError: string;
}

export interface ExportData {
  global: Global;
  register: Register;
  registrationPending: RegistrationPending;
  confirmRegistration: ConfirmRegistration;
  login: Login;
  home: Home;
  navItems: NavItems;
  sidebar: Sidebar;
  form: Form;
  toast: Toast;
}
