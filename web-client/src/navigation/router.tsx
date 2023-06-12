import { createBrowserRouter } from "react-router-dom";

import Register, {
  name as registerName,
} from "../pages/authentication/Register";
import RegistrationPending, {
  name as registrationPendingName,
} from "../pages/authentication/RegistrationPending";
import ConfirmRegistration, {
  name as confirmRegistrationName,
} from "../pages/authentication/ConfirmRegistration";
import Login, { name as loginName } from "../pages/authentication/Login";
import Home from "../pages/Home";

export interface Path {
  path: string;
  element: React.ReactElement;
  handle: {
    translationKeys: string[];
  };
}
export interface Paths<ValueType> {
  register: ValueType;
  registrationPending: ValueType;
  confirmRegistration: ValueType;
  login: ValueType;
  home: ValueType;
  dailyExercise: ValueType;
  archive: ValueType;
  exerciseSettings: ValueType;
  userSettings: ValueType;
}
export interface RouterPaths extends Paths<Path> {}
export const paths: RouterPaths = {
  register: {
    path: `/register`,
    element: <Register />,
    handle: {
      translationKeys: ["register"],
    },
  },
  registrationPending: {
    path: `/registration-pending`,
    element: <RegistrationPending />,
    handle: {
      translationKeys: ["registrationPending"],
    },
  },
  confirmRegistration: {
    path: `/confirm-registration`,
    element: <ConfirmRegistration />,
    handle: {
      translationKeys: ["confirmRegistration"],
    },
  },
  login: {
    path: `/login`,
    element: <Login />,
    handle: {
      translationKeys: ["login"],
    },
  },
  home: {
    path: "/",
    element: <Home />,
    handle: {
      translationKeys: [],
    },
  },
  dailyExercise: {
    path: "/daily-exercise",
    element: <div>Hello daily exercise!</div>,
    handle: {
      translationKeys: ["dailyExercise"],
    },
  },
  archive: {
    path: "/archive",
    element: <div>Hello archive!</div>,
    handle: {
      translationKeys: ["archive"],
    },
  },
  exerciseSettings: {
    path: "/settings/exercises",
    element: <div>Hello exercise settings!</div>,
    handle: {
      translationKeys: ["settings.root", "settings.exercises"],
    },
  },
  userSettings: {
    path: "/settings/user",
    element: <div>Hello user settings!</div>,
    handle: {
      translationKeys: ["settings.root", "settings.user"],
    },
  },
};

export const router = createBrowserRouter([
  { ...paths.register },
  { ...paths.registrationPending },
  { ...paths.confirmRegistration },
  { ...paths.login },
  { ...paths.home },
  { ...paths.dailyExercise },
  { ...paths.archive },
  { ...paths.exerciseSettings },
  { ...paths.userSettings },
]);
