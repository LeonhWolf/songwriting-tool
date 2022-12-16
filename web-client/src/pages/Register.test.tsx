import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import "whatwg-fetch";

import i18next from "../i18n/index";
import Register from "./Register";
import { setInputValue, flushPendingPromises } from "../utils/testUtils";
import { registerUser } from "../services/authenticationService";

const navigateSpy = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => navigateSpy,
}));

jest.mock("../services/authenticationService.ts", () => ({
  registerUser: jest.fn().mockResolvedValue(""),
}));

const renderWithAct = async (): Promise<void> => {
  /*eslint-disable*/
  await act(() => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  });
};

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Titles:", () => {
  it("Should render title.", async () => {
    await renderWithAct();
    const title = i18next.t("register.title");
    expect(screen.getByText(title)).toBeDefined();
  });
  it("Should render subtitle.", async () => {
    await renderWithAct();
    const subtitle = i18next.t("register.subtitle");
    expect(screen.getByText(subtitle)).toBeDefined();
  });
});

describe("Inputs:", () => {
  describe("First name:", () => {
    it("Should have id 'firstName' (should render, should be required).", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.firstName.labelText") + " *";
      const input = screen.getByLabelText(labelText);
      expect(input).toBeDefined();
      expect(input.id).toBe("firstName");
    });
    it("Should be text input.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.firstName.labelText") + " *";
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.type).toBe("text");
    });
    it("Should render placeholder.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.firstName.labelText") + " *";
      const placeholder = i18next.t("register.firstName.placeholder");
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.placeholder).toBe(placeholder);
    });
    it.todo("Should show invalid message on invalid submit.");
  });
  describe("Last name:", () => {
    it("Should have id 'lastName' (should render, should be required).", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.lastName.labelText") + " *";
      const input = screen.getByLabelText(labelText);
      expect(input).toBeDefined();
      expect(input.id).toBe("lastName");
    });
    it("Should be text input.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.lastName.labelText") + " *";
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.type).toBe("text");
    });
    it("Should render placeholder.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.lastName.labelText") + " *";
      const placeholder = i18next.t("register.lastName.placeholder");
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.placeholder).toBe(placeholder);
    });
    it.todo("Should show invalid message on invalid submit.");
  });
  describe("Email:", () => {
    it("Should have id 'email' (should render, should be required).", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.email.labelText") + " *";
      const input = screen.getByLabelText(labelText);
      expect(input).toBeDefined();
      expect(input.id).toBe("email");
    });
    it("Should be email input.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.email.labelText") + " *";
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.type).toBe("email");
    });
    it("Should render placeholder.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.email.labelText") + " *";
      const placeholder = i18next.t("register.email.placeholder");
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.placeholder).toBe(placeholder);
    });
    it.todo("Should show invalid message on invalid submit.");
  });
  describe("Password:", () => {
    it("Should have id 'password' (should render, should be required).", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.password.labelText") + " *";
      const input = screen.getByLabelText(labelText);
      expect(input).toBeDefined();
      expect(input.id).toBe("password");
    });
    it("Should be password input.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.password.labelText") + " *";
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("Should render placeholder.", async () => {
      await renderWithAct();
      const labelText = i18next.t("register.password.labelText") + " *";
      const placeholder = i18next.t("register.password.placeholder");
      const input = screen.getByLabelText(labelText) as HTMLInputElement;
      expect(input.placeholder).toBe(placeholder);
    });
    it.todo("Should show invalid message on invalid submit.");
  });
});
it("Should render register button.", async () => {
  await renderWithAct();
  const buttonText = i18next.t("register.buttonText");
  expect(screen.getByText(buttonText)).toBeDefined();
});
it("Should render log in link.", async () => {
  await renderWithAct();
  const alreadyAccountText = i18next.t("register.accountAlready");
  const logInText = i18next.t("register.logIn");

  expect(screen.getByText(alreadyAccountText)).toBeDefined();
  expect(screen.getByText(logInText)).toBeDefined();
});
it("Should link log in link to page.", async () => {
  await renderWithAct();
  const logInText = i18next.t("register.logIn");

  const linkElement = screen.getByText(logInText) as HTMLLinkElement;
  expect(linkElement.href).toBe("http://localhost/login");
});

describe("Calling register service:", () => {
  jest.spyOn(navigator, "language", "get").mockReturnValue("en-US");

  const enterValidInputContents = (): void => {
    const firstNamePlaceholder = i18next.t("register.firstName.placeholder");
    setInputValue(firstNamePlaceholder, "John");

    const lastNamePlaceholder = i18next.t("register.lastName.placeholder");
    setInputValue(lastNamePlaceholder, "Doe");

    const emailPlaceholder = i18next.t("register.email.placeholder");
    setInputValue(emailPlaceholder, "john@doe.com");

    const passwordPlaceholder = i18next.t("register.password.placeholder");
    setInputValue(passwordPlaceholder, "123456789");
  };

  it("Should call register service with input values on button press.", async () => {
    await renderWithAct();
    const buttonText = i18next.t("register.buttonText");
    const registerButton = screen.getByText(buttonText);

    enterValidInputContents();

    const expectedRegisterUserArgs: Parameters<typeof registerUser>[0] = {
      first_name: "John",
      last_name: "Doe",
      email_address: "john@doe.com",
      plainPassword: "123456789",
      client_language: "en",
    };

    await act(() => {
      registerButton.click();
    });

    expect(registerUser).toHaveBeenCalledWith(expectedRegisterUserArgs);
  });
  it("Should detect 'de' client language.", async () => {
    jest.spyOn(navigator, "language", "get").mockReturnValueOnce("de-DE");

    await renderWithAct();
    const buttonText = i18next.t("register.buttonText");
    const registerButton = screen.getByText(buttonText);

    enterValidInputContents();

    const expectedRegisterUserArgs: Parameters<typeof registerUser>[0] = {
      first_name: "John",
      last_name: "Doe",
      email_address: "john@doe.com",
      plainPassword: "123456789",
      client_language: "de",
    };

    await act(() => {
      registerButton.click();
    });
    expect(registerUser).toHaveBeenCalledWith(expectedRegisterUserArgs);
  });
  it("Should use 'en' as fallback language.", async () => {
    jest.spyOn(navigator, "language", "get").mockReturnValueOnce("fr-FR");

    await renderWithAct();
    const buttonText = i18next.t("register.buttonText");
    const registerButton = screen.getByText(buttonText);

    enterValidInputContents();

    const expectedRegisterUserArgs: Parameters<typeof registerUser>[0] = {
      first_name: "John",
      last_name: "Doe",
      email_address: "john@doe.com",
      plainPassword: "123456789",
      client_language: "en",
    };

    await act(() => {
      registerButton.click();
    });
    expect(registerUser).toHaveBeenCalledWith(expectedRegisterUserArgs);
  });
  it("Should not call register service without button press.", async () => {
    await renderWithAct();
    enterValidInputContents();

    expect(registerUser).toHaveBeenCalledTimes(0);
  });
  it("Should not call register service if form is invalid.", async () => {
    await renderWithAct();

    const firstNamePlaceholder = i18next.t("register.firstName.placeholder");
    setInputValue(firstNamePlaceholder, "");

    const lastNamePlaceholder = i18next.t("register.lastName.placeholder");
    setInputValue(lastNamePlaceholder, "Doe");

    const emailPlaceholder = i18next.t("register.email.placeholder");
    setInputValue(emailPlaceholder, ".com");

    const passwordPlaceholder = i18next.t("register.password.placeholder");
    setInputValue(passwordPlaceholder, "1");

    const buttonText = i18next.t("register.buttonText");
    const registerButton = screen.getByText(buttonText);

    await act(() => {
      registerButton.click();
    });

    expect(registerUser).toHaveBeenCalledTimes(0);
  });
  it("Should redirect to '/registration-confirmed' on success.", async () => {
    await renderWithAct();
    const buttonText = i18next.t("register.buttonText");
    const registerButton = screen.getByText(buttonText);

    enterValidInputContents();
    fireEvent.click(registerButton);

    await act(async () => {
      await flushPendingPromises();
    });
    expect(navigateSpy).toHaveBeenCalledWith("/registration-confirmed");
  });
  it("Should catch when 'registerUser' rejects.", async () => {
    (
      registerUser as jest.MockedFunction<typeof registerUser>
    ).mockRejectedValueOnce("Some reason for rejecting registering the user.");

    await renderWithAct();

    const buttonText = i18next.t("register.buttonText");
    const registerButton = screen.getByText(buttonText);
    enterValidInputContents();

    fireEvent.click(registerButton);
    await act(async () => {
      await flushPendingPromises();
    });

    // Did not find a good way to test this behavior.
    // But the test will fail if the error is not caught.
    expect(1).toBe(1);
  });
});
