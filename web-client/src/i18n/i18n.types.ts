import type { Paths } from "../navigation/router";

interface IInput {
  labelText: string;
  placeholder: string;
  text: string;
}

export interface IRegister {
  title: string;
  subtitle: string;
  firstName: IInput;
  lastName: IInput;
  email: IInput;
  password: IInput;
  buttonText: string;
  accountAlready: string;
  logIn: string;
}
export interface IRegistrationPending {
  title: string;
  subtitle: string;
  bodyText1: string;
  bodyText2: string;
}
export interface IConfirmRegistration {
  title: string;
  subtitle: string;
  bodyText: string;
  success: string;
  idIsExpired: string;
  urlIsInvalid: string;
}
export interface ILogin {
  title: string;
  subtitle: string;
  email: IInput;
  password: IInput;
  rememberMeText: string;
  forgotPasswordText: string;
  loginButtonText: string;
  noAccountText: string;
  signUpText: string;
  wrongCredentials: string;
}
export interface IHome {
  title: string;
  tiles: {
    dailyExercise: string;
    archive: string;
  };
}

export interface INavItems extends Paths<string> {}
export interface IForm {
  inputMissingMessage: string;
  weakPassword: string;
  passwordTooShort: string;
}
export interface IToast {
  serverError: string;
}

export interface IExportData {
  register: IRegister;
  registrationPending: IRegistrationPending;
  confirmRegistration: IConfirmRegistration;
  login: ILogin;
  home: IHome;
  navItems: INavItems;
  form: IForm;
  toast: IToast;
}
