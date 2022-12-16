import { INewUser } from "../../../api-types/authentication.types";
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
