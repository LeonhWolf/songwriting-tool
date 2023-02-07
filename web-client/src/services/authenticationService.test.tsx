import "whatwg-fetch";

import {
  INewUser,
  IConfirmRegistration,
  ILogin,
} from "../../../api-types/authentication.types";
import {
  registerUser,
  confirmRegistration,
  loginUser,
} from "./authenticationService";
import i18n from "../i18n/index";
import { store } from "../redux/store";
import { removeToast } from "../redux/toastsSlice";

const mockBaseUrl = "http://base-url.com";

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("some id"),
}));

const emptyToastStore = (): void => {
  const toasts = store.getState().toasts;
  if (toasts.length === 0) return;

  toasts.forEach((toast) => {
    store.dispatch(removeToast(toast.id));
  });
};

const oldEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...oldEnv };
});
afterEach(() => {
  emptyToastStore();
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
    const registerUserImport = require("./authenticationService").registerUser;
    await registerUserImport(newUser);

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
    });
  });

  it("Should not catch if 'fetch' rejects.", async () => {
    (
      global.fetch as jest.MockedFunction<typeof global.fetch>
    ).mockRejectedValueOnce(new Error("Fetch rejected here."));

    await expect(registerUser).rejects.toThrow("Fetch rejected here.");
  });
});

describe("'confirmRegistration()'", () => {
  const confirmationId: IConfirmRegistration = {
    confirmation_id: "123",
  };
  it("Should send 'post' to '/confirm-registration'.", async () => {
    process.env.REACT_APP_BASE_URL = mockBaseUrl;
    const confirmRegistrationImport =
      require("./authenticationService").confirmRegistration;
    await confirmRegistrationImport(confirmationId);

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
    });
    it("Should return the response", async () => {
      const response = new Response(undefined, { status: 500 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await confirmRegistration(confirmationId);
      expect(returnValue).toEqual(response);
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
  it("Should send 'post' to '/login'.", async () => {
    process.env.REACT_APP_BASE_URL = mockBaseUrl;
    const loginUserImport = require("./authenticationService").loginUser;
    await loginUserImport("john@doe.com", "11223344");

    const expectedBody: ILogin = {
      email_address: "john@doe.com",
      password: "11223344",
    };

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expectedBody),
    });
  });
  describe("status === 200:", () => {
    it("Should not show toast.", async () => {
      const response = new Response(undefined, { status: 200 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      expect(store.getState().toasts).toEqual([]);

      await loginUser("john@doe.com", "11223344");
      expect(store.getState().toasts).toEqual([]);
    });
    it("Should return the response.", async () => {
      const response = new Response(undefined, { status: 200 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await loginUser("john@doe.com", "11223344");
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

      await loginUser("jane@doe.com", "44332211");
      expect(store.getState().toasts).toEqual([]);
    });
    it("Should return the response.", async () => {
      const response = new Response(undefined, { status: 400 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await loginUser("john@doe.com", "11223344");
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
      await loginUser("jane@doe.com", "44332211");

      const serverErrorMessage = i18n.t("toast.serverError");
      expect(store.getState().toasts).toEqual([
        { id: "some id", bodyText: serverErrorMessage, severity: "error" },
      ]);
    });
    it("Should return the response.", async () => {
      const response = new Response(undefined, { status: 500 });
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockResolvedValueOnce(response);

      const returnValue = await loginUser("jane@doe.com", "44332211");
      expect(returnValue).toEqual(response);
    });
  });
  describe("Fetch rejects:", () => {
    it("Should show toast.", async () => {
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockRejectedValueOnce("Fetch rejected.");

      expect(store.getState().toasts).toEqual([]);

      await expect(loginUser).rejects.toBeTruthy();
      const serverErrorMessage = i18n.t("toast.serverError");
      expect(store.getState().toasts).toEqual([
        { id: "some id", bodyText: serverErrorMessage, severity: "error" },
      ]);
    });
    it("Should not catch.", async () => {
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockRejectedValueOnce(new Error("Fetch rejected here."));

      await expect(loginUser).rejects.toThrow("Fetch rejected here.");
    });
  });
});
