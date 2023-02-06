import "whatwg-fetch";

import {
  INewUser,
  IConfirmRegistration,
} from "../../../api-types/authentication.types";
import { registerUser, confirmRegistration } from "./authenticationService";
import i18n from "../i18n/index";
import { store } from "../redux/store";
import { removeToast } from "../redux/toastsSlice";

const mockBaseUrl = "http://base-url.com";

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("some id"),
}));

const oldEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...oldEnv };
});
afterAll(() => {
  process.env = oldEnv;
});

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

describe("'registerUser()':", () => {
  const newUser: INewUser = {
    first_name: "Jane",
    last_name: "Doe",
    email_address: "jane@doe.com",
    plainPassword: "112233",
    client_language: "en",
  };
  it("Should send 'post' to '/register'.", async () => {
    process.env.REACT_APP_BASE_URL = mockBaseUrl;
    await registerUser(newUser);

    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/register`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
  });
  describe("Toasts:", () => {
    it("Should add a toast if fetch rejects.", async () => {
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockRejectedValueOnce("Fetch rejected.");

      const serverErrorMessage = i18n.t("toast.serverError");
      expect(store.getState().toasts).toEqual([]);

      await expect(registerUser).rejects.toBeTruthy();
      expect(store.getState().toasts).toEqual([
        { id: "some id", bodyText: serverErrorMessage, severity: "error" },
      ]);
      store.dispatch(removeToast("some id"));
    });
    it("Should show toast if status !== '200'.", async () => {
      const response = new Response(undefined, { status: 400 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const serverErrorMessage = i18n.t("toast.serverError");
      expect(store.getState().toasts).toEqual([]);

      await registerUser(newUser);

      expect(store.getState().toasts).toEqual([
        { id: "some id", bodyText: serverErrorMessage, severity: "error" },
      ]);
      store.dispatch(removeToast("some id"));
    });
  });

  it("Should not catch if 'fetch' rejects.", async () => {
    (
      global.fetch as jest.MockedFunction<typeof global.fetch>
    ).mockRejectedValueOnce(new Error("Fetch rejected here."));

    await expect(registerUser).rejects.toThrow("Fetch rejected here.");
    store.dispatch(removeToast("some id"));
  });
});

describe("'confirmRegistration()'", () => {
  const confirmationId: IConfirmRegistration = {
    confirmation_id: "123",
  };
  it("Should send 'post' to 'confirm-registration'.", async () => {
    process.env.REACT_APP_BASE_URL = mockBaseUrl;
    await confirmRegistration(confirmationId);

    expect(fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/confirm-registration`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationId),
      }
    );
  });
  describe("status === 200:", () => {
    it("Should not show toast.", async () => {
      const response = new Response(undefined, { status: 200 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      expect(store.getState().toasts).toEqual([]);

      await confirmRegistration(confirmationId);
      expect(store.getState().toasts).toEqual([]);
    });
    it("Should return the response.", async () => {
      const response = new Response(undefined, { status: 200 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await confirmRegistration(confirmationId);
      expect(returnValue).toEqual(response);
    });
  });
  describe("status === 400:", () => {
    it("Should not show toast.", async () => {
      const response = new Response(undefined, { status: 400 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      expect(store.getState().toasts).toEqual([]);

      await confirmRegistration(confirmationId);
      expect(store.getState().toasts).toEqual([]);
    });
    it("Should return the response.", async () => {
      const response = new Response(undefined, { status: 400 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await confirmRegistration(confirmationId);
      expect(returnValue).toEqual(response);
    });
  });
  describe("status === 500:", () => {
    it("Should show toast.", async () => {
      const response = new Response(undefined, { status: 500 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      expect(store.getState().toasts).toEqual([]);
      await confirmRegistration(confirmationId);

      const serverErrorMessage = i18n.t("toast.serverError");
      expect(store.getState().toasts).toEqual([
        { id: "some id", bodyText: serverErrorMessage, severity: "error" },
      ]);
      store.dispatch(removeToast("some id"));
    });
    it("Should return the response", async () => {
      const response = new Response(undefined, { status: 500 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await confirmRegistration(confirmationId);
      expect(returnValue).toEqual(response);
      store.dispatch(removeToast("some id"));
    });
  });
  describe("Fetch rejects:", () => {
    it("Should show toast.", async () => {
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockRejectedValueOnce("Fetch rejected.");

      expect(store.getState().toasts).toEqual([]);

      await expect(confirmRegistration).rejects.toBeTruthy();
      const serverErrorMessage = i18n.t("toast.serverError");
      expect(store.getState().toasts).toEqual([
        { id: "some id", bodyText: serverErrorMessage, severity: "error" },
      ]);
      store.dispatch(removeToast("some id"));
    });
    it("Should not catch.", async () => {
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockRejectedValueOnce(new Error("Fetch rejected here."));

      await expect(confirmRegistration).rejects.toThrow("Fetch rejected here.");
    });
  });
});

describe("'loginUser()':", () => {
  it.todo("Should send 'post' to '/login'.");
  describe("status === 200:", () => {
    it.todo("Should not show toast.");
    it.todo("Should return the response.");
  });
  describe("status === 400:", () => {
    it.todo("Should not show toast.");
    it.todo("Should return the response.");
  });
  describe("status === 500:", () => {
    it.todo("Should show toast.");
    it.todo("Should return the response.");
  });
  describe("Fetch rejects:", () => {
    it.todo("Should show toast.");
    it.todo("Should not catch.");
  });
});
