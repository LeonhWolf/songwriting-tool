import {
  INewUser,
  IConfirmRegistration,
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
): Promise<void> => {
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

    if (response.status === 400) throw new Error("400");
    if (response.status === 500) addServerErrorToast();
  } catch (error) {
    addServerErrorToast();
    throw new Error(`${error as Error}`);
  }
};
