import { render, screen, act, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import "@testing-library/jest-dom";
import "whatwg-fetch";

import Login from "./Login";
import i18next from "../i18n/index";
import { loginUser } from "../services/authenticationService";
import { flushPendingPromises, setInputValue } from "../utils/testUtils";
import { path as registrationPath } from "./Register";

const navigateSpy = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => navigateSpy,
}));

jest.mock("../services/authenticationService.ts", () => ({
  loginUser: jest.fn().mockResolvedValue("loginUser resolved."),
}));

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

const history = createMemoryHistory();
history.push = jest.fn();
const renderWithAct = async (): Promise<void> => {
  /*eslint-disable*/
  await act(() => {
    render(
      <Router location={history.location} navigator={history}>
        <Login />
      </Router>
    );
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

it("Should render title.", async () => {
  await renderWithAct();
  const titleText = i18next.t("login.title");
  expect(screen.getByText(titleText)).toBeDefined();
});
it("Should render subtitle.", async () => {
  await renderWithAct();
  const subtitleText = i18next.t("login.subtitle");
  expect(screen.getByText(subtitleText)).toBeDefined();
});
describe("Inputs:", () => {
  describe("Email:", () => {
    it("Should have id 'email' (should render, should be required).", async () => {
      await renderWithAct();
      const labelText = i18next.t("login.email.labelText") + " *";
      const input = screen.getByLabelText(labelText);
      expect(input).toBeDefined();
      expect(input.id).toBe("email");
    });
    it("Should be email input.", async () => {
      await renderWithAct();
      const labelText = i18next.t("login.email.labelText") + " *";
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.type).toBe("email");
    });
    it("Should render placeholder.", async () => {
      await renderWithAct();
      const labelText = i18next.t("login.email.labelText") + " *";
      const placeholder = i18next.t("login.email.placeholder");
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.placeholder).toBe(placeholder);
    });
    it("Should show invalid message on invalid submit.", async () => {
      await renderWithAct();
      jest.spyOn(console, "error").mockImplementationOnce(() => {});

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      const invalidMessage = i18next.t("form.inputMissingMessage", {
        inputTitle: i18next.t("login.email.text"),
      });
      expect(screen.getByText(invalidMessage)).toBeDefined();
    });
  });

  describe("Password:", () => {
    it("Should have id 'password' (should render, should be required).", async () => {
      await renderWithAct();
      const labelText = i18next.t("login.password.labelText") + " *";
      const input = screen.getByLabelText(labelText);
      expect(input).toBeDefined();
      expect(input.id).toBe("password");
    });
    it("Should be password input.", async () => {
      await renderWithAct();
      const labelText = i18next.t("login.password.labelText") + " *";
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("Should render placeholder.", async () => {
      await renderWithAct();
      const labelText = i18next.t("login.password.labelText") + " *";
      const placeholder = i18next.t("login.password.placeholder");
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.placeholder).toBe(placeholder);
    });
    it("Should show invalid message on invalid submit.", async () => {
      await renderWithAct();
      jest.spyOn(console, "error").mockImplementationOnce(() => {});

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      const invalidMessage = i18next.t("form.inputMissingMessage", {
        inputTitle: i18next.t("login.password.text"),
      });
      expect(screen.getByText(invalidMessage)).toBeDefined();
    });
  });
});
it.skip("Should render 'remember me' checkbox.", async () => {
  await renderWithAct();

  const rememberMeText = i18next.t("login.rememberMeText");
  expect(screen.getByText(rememberMeText)).toBeDefined();
});
// it.todo("Should call service with 'rememberMe = false' if unchecked.");
// it.todo("Should call service with 'rememberMe = true' if checked.");
it("Should render 'forgot password' link.", async () => {
  await renderWithAct();

  const forgotPasswordText = i18next.t("login.forgotPasswordText");
  expect(screen.getByText(forgotPasswordText)).toBeDefined();
});
it.todo("Should navigate to forgot password page on click.");
it("Should render 'login' button.", async () => {
  await renderWithAct();

  const loginButtonText = i18next.t("login.loginButtonText");
  const button = screen.getByText(loginButtonText);
  expect(button).toBeDefined();
  expect(button.nodeName).toBe("BUTTON");
});
it("Should render sign up text.", async () => {
  await renderWithAct();

  const noAccountText = i18next.t("login.noAccountText");
  expect(screen.getByText(noAccountText)).toBeDefined();
});
it("Should render sign up link.", async () => {
  await renderWithAct();

  const signUpText = i18next.t("login.signUpText");
  expect(screen.getByText(signUpText)).toBeDefined();
});
describe("Login service:", () => {
  it("Should call service on login click.", async () => {
    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    expect(loginUser).toHaveBeenCalledTimes(0);

    act(() => {
      loginButton.click();
    });
    await flushPendingPromises();
    expect(loginUser).toHaveBeenCalledTimes(1);
    expect(loginUser).toHaveBeenCalledWith("jane@doe.com", "11223344");
  });
  it("Should not call service on invalid form.", async () => {
    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");
    setInputValue(passwordLabelText, "");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    expect(loginUser).toHaveBeenCalledTimes(0);

    act(() => {
      loginButton.click();
    });
    await flushPendingPromises();
    expect(loginUser).toHaveBeenCalledTimes(0);
  });
  it("Should catch if service call rejects.", async () => {
    (loginUser as jest.MockedFunction<typeof loginUser>).mockRejectedValueOnce(
      "Reason why 'loginUser()' rejected."
    );
    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    expect(loginUser).toHaveBeenCalledTimes(0);

    // Triggers 'UnhandledPromiseRejection' if not caught.
    act(() => {
      loginButton.click();
    });
    await flushPendingPromises();
    expect(loginUser).toHaveBeenCalledTimes(1);
    expect(loginUser).toHaveBeenCalledWith("jane@doe.com", "11223344");
  });
  it("Should log if service rejects", async () => {
    (loginUser as jest.MockedFunction<typeof loginUser>).mockRejectedValueOnce(
      "Reason why 'loginUser()' rejected."
    );
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementationOnce(() => {});
    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    expect(loginUser).toHaveBeenCalledTimes(0);

    // Triggers 'UnhandledPromiseRejection' if not caught.
    act(() => {
      loginButton.click();
    });
    await flushPendingPromises();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "User could not be logged in: Reason why 'loginUser()' rejected."
    );
  });
});
describe("Wrong credentials:", () => {
  const wrongCredentialsText = i18next.t("login.wrongCredentials");
  it("Should not show message without request.", async () => {
    await renderWithAct();
    expect(screen.queryByText(wrongCredentialsText)).toBeNull();
  });
  it("Should show message after request.", async () => {
    const wrongCredentialsResponse = new Response(undefined, { status: 400 });
    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValueOnce(
      wrongCredentialsResponse
    );

    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    act(() => {
      loginButton.click();
    });
    await act(async () => {
      await flushPendingPromises();
    });

    expect(screen.getByText(wrongCredentialsText)).toBeDefined();
  });
  it("Should not show error message if credentials are correct.", async () => {
    const properCredentialsResponse = new Response(undefined, { status: 200 });
    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValueOnce(
      properCredentialsResponse
    );

    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    act(() => {
      loginButton.click();
    });
    await act(async () => {
      await flushPendingPromises();
    });

    expect(screen.queryByText(wrongCredentialsText)).toBeNull();
  });
  it("Should show error message and hide it on second proper request.", async () => {
    const wrongCredentialsResponse = new Response(undefined, { status: 400 });
    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValueOnce(
      wrongCredentialsResponse
    );

    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    act(() => {
      loginButton.click();
    });
    await act(async () => {
      await flushPendingPromises();
    });

    expect(screen.getByText(wrongCredentialsText)).toBeDefined();

    const properCredentialsResponse = new Response(undefined, { status: 200 });
    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValueOnce(
      properCredentialsResponse
    );

    act(() => {
      loginButton.click();
    });
    await act(async () => {
      await flushPendingPromises();
    });

    expect(screen.queryByText(wrongCredentialsText)).toBeNull();
  });
  it("Should show error message and still show it on second wrong request.", async () => {
    const wrongCredentialsResponse = new Response(undefined, { status: 400 });
    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValueOnce(
      wrongCredentialsResponse
    );

    await renderWithAct();

    const emailLabelText = i18next.t("login.email.placeholder");
    setInputValue(emailLabelText, "jane@doe.com");

    const passwordLabelText = i18next.t("login.password.placeholder");
    setInputValue(passwordLabelText, "11223344");

    const loginButtonText = i18next.t("login.loginButtonText");
    const loginButton = screen.getByText(loginButtonText);

    act(() => {
      loginButton.click();
    });
    await act(async () => {
      await flushPendingPromises();
    });
    expect(screen.getByText(wrongCredentialsText)).toBeDefined();

    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValueOnce(
      wrongCredentialsResponse
    );
    act(() => {
      loginButton.click();
    });
    await act(async () => {
      await flushPendingPromises();
    });
    expect(screen.getByText(wrongCredentialsText)).toBeDefined();
  });
});
it("Should navigate to sign up page on click.", async () => {
  await renderWithAct();

  const signUpText = i18next.t("login.signUpText");
  const signUpLink = screen.getByText(signUpText) as HTMLLinkElement;

  expect(history.push).toHaveBeenCalledTimes(0);
  signUpLink.click();
  expect(history.push).toHaveBeenCalledTimes(1);

  expect(
    //@ts-ignore
    (history.push as jest.MockedFunction<typeof history.push>).mock.calls[0][0][
      "pathname"
    ]
  ).toBe(registrationPath);
});
