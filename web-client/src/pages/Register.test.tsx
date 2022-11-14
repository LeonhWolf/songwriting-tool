import { render, screen, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import i18next from "../i18n/index";
import Register from "./Register";
import LabelAndInput from "../components/LabelAndInput";

jest.mock("../components/LabelAndInput.tsx", () => jest.fn());

const renderWithRouter = (component: React.ReactNode): RenderResult => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe.skip("Titles:", () => {
  it("Should render title", () => {
    renderWithRouter(<Register />);
    const titleElement = screen.getByText(
      i18next.t("register.title").toString()
    );
    expect(titleElement).toBeDefined();
  });
  it("Should render subtitle", () => {
    renderWithRouter(<Register />);
    const subtitleElement = screen.getByText(
      i18next.t("register.subtitle").toString()
    );
    expect(subtitleElement).toBeDefined();
  });
});

describe.skip("Inputs:", () => {
  describe("First name:", () => {
    it("Should render.", () => {
      renderWithRouter(<Register />);
      const firstNameLabelText = i18next
        .t("register.firstName.labelText")
        .toString();
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].labelText
      ).toBe(firstNameLabelText);
    });
    it("Should be required.", () => {
      renderWithRouter(<Register />);
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].isRequired
      ).toBe(true);
    });
    it("Should have placeholder.", () => {
      renderWithRouter(<Register />);
      const firstNamePlaceholder = i18next
        .t("register.firstName.placeholder")
        .toString();
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].inputPlaceholder
      ).toBe(firstNamePlaceholder);
    });
    it("Should have input missing message.", () => {
      renderWithRouter(<Register />);
      const invalidMessage = i18next
        .t("inputMissingMessage", {
          inputTitle: `${i18next.t("register.firstName.labelText")}`,
        })
        .toString();
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].invalidMessage
      ).toBe(invalidMessage);
    });
  });
  describe("Last name:", () => {
    it("Should render.", () => {
      renderWithRouter(<Register />);
      const firstNameLabelText = i18next
        .t("register.lastName.labelText")
        .toString();
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].labelText
      ).toBe(firstNameLabelText);
    });
    it("Should be required.", () => {
      renderWithRouter(<Register />);
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].isRequired
      ).toBe(true);
    });
    it("Should have placeholder.", () => {
      renderWithRouter(<Register />);
      const firstNamePlaceholder = i18next
        .t("register.lastName.placeholder")
        .toString();
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].inputPlaceholder
      ).toBe(firstNamePlaceholder);
    });
    it("Should have input missing message.", () => {
      renderWithRouter(<Register />);
      const invalidMessage = i18next
        .t("inputMissingMessage", {
          inputTitle: `${i18next.t("register.lastName.labelText")}`,
        })
        .toString();
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].invalidMessage
      ).toBe(invalidMessage);
    });
  });
  describe("Email:", () => {
    it.todo("Should render.");
    it.todo("Should be required.");
    it.todo("Should have placeholder.");
    it.todo("Should have invalid message.");
  });
  describe("Password:", () => {
    it.todo("Should render.");
    it.todo("Should be required.");
    it.todo("Should have placeholder.");
    it.todo("Should have invalid message.");
  });
});

describe.skip("Sign up button:", () => {
  it.todo("Should render.");
  it.todo("Should trigger validation.");
  it.todo("Should not trigger request when form invalid.");
  it.todo("Should trigger request when form valid.");
});

describe.skip("Miscellaneous", () => {
  it.todo("Should render 'signUp' button.");
  it.todo("Should render 'logIn' link.");
});
