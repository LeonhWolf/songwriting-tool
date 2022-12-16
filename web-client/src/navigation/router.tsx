import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import RegistrationConfirmed from "../pages/RegistrationConfirmed";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <div>not found</div>,
    children: [],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/registration-confirmed",
    element: <RegistrationConfirmed />,
  },
]);
