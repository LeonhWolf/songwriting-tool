import { createBrowserRouter } from "react-router-dom";

import Register, { path as registerPath } from "../pages/Register";
import RegistrationPending, {
  path as registrationPendingPath,
} from "../pages/RegistrationPending";
import ConfirmRegistration, {
  path as confirmRegistrationPath,
} from "../pages/ConfirmRegistration";
import Login, { path as loginPath } from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <div>not found</div>,
    children: [],
  },
  {
    path: registerPath,
    element: <Register />,
  },
  {
    path: registrationPendingPath,
    element: <RegistrationPending />,
  },
  {
    path: confirmRegistrationPath,
    element: <ConfirmRegistration />,
  },
  {
    path: loginPath,
    element: <Login />,
  },
]);
