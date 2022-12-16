import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import RegistrationConfirmed from "./RegistrationConfirmed";
import i18next from "../i18n/index";

describe("Titles:", () => {
  it("Should render proper title.", () => {
    render(<RegistrationConfirmed />);
    const title = i18next.t("registrationConfirmed.title");
    expect(screen.getByText(title)).toBeDefined();
  });
  it("Should render proper subtitle.", () => {
    render(<RegistrationConfirmed />);
    const subtitle = i18next.t("registrationConfirmed.subtitle");
    expect(screen.getByText(subtitle)).toBeDefined();
  });
});
it("Should render proper bodyText1.", () => {
  render(<RegistrationConfirmed />);
  const bodyText1 = i18next.t("registrationConfirmed.bodyText1");
  expect(screen.getByText(bodyText1)).toBeDefined();
});
it("Should render proper bodyText2.", () => {
  render(<RegistrationConfirmed />);
  const bodyText2 = i18next.t("registrationConfirmed.bodyText2");
  expect(screen.getByText(bodyText2)).toBeDefined();
});
