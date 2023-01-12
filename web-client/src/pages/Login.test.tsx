import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "whatwg-fetch";

import Login from "./Login";
import i18next from "../i18n/index";

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

const renderWithAct = async (): Promise<void> => {
  /*eslint-disable*/
  await act(() => {
    render(<Login />);
  });
};

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

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      const invalidMessage = i18next.t("form.inputMissingMessage", {
        inputTitle: i18next.t("login.password.text"),
      });
      expect(screen.getByText(invalidMessage)).toBeDefined();
    });
  });
});
it("Should render 'remember me' checkbox.", async () => {
  await renderWithAct();

  const rememberMeText = i18next.t("login.rememberMeText");
  expect(screen.getByText(rememberMeText)).toBeDefined();
});
it.todo("Should call service with 'rememberMe = false' if unchecked.");
it.todo("Should call service with 'rememberMe = true' if checked.");
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
it.todo("Should navigate to sign up page on click.");
it.todo("Should show message if login fails.");
