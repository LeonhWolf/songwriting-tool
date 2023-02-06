import {
  INewUser,
  IConfirmRegistration,
  ILogin,
} from "../../../api-types/authentication.types";
import { store } from "../redux/store";
import { addToast } from "../redux/toastsSlice";
import i18n from "../i18n";

const addServerErrorToast = (): void => {
  const serverErrorMessage = i18n.t("toast.serverError");
  store.dispatch(addToast({ bodyText: serverErrorMessage, severity: "error" }));
};

export const registerUser = async (userData: INewUser): Promise<void> => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.status !== 200) addServerErrorToast();
  } catch (error) {
    addServerErrorToast();
    throw new Error(`${error as Error}`);
  }
};

export const confirmRegistration = async (
  confirmationId: IConfirmRegistration
): Promise<Response> => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/confirm-registration`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmationId),
    });

    if (response.status === 500) addServerErrorToast();

    return response;
  } catch (error) {
    addServerErrorToast();
    throw error;
  }
};

export const loginUser = async (
  emailAddress: ILogin["email_address"],
  plainPassword: ILogin["password"]
): Promise<Response> => {
  const response = await fetch("");
  return response;
};
