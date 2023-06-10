import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import RegistrationPending from "./RegistrationPending";
import i18next from "../../i18n/index";

describe("Titles:", () => {
  it("Should render proper title.", () => {
    render(<RegistrationPending />);
    const title = i18next.t("registrationPending.title");
    expect(screen.getByText(title)).toBeDefined();
  });
  it("Should render proper subtitle.", () => {
    render(<RegistrationPending />);
    const subtitle = i18next.t("registrationPending.subtitle");
    expect(screen.getByText(subtitle)).toBeDefined();
  });
});
it("Should render proper bodyText1.", () => {
  render(<RegistrationPending />);
  const bodyText1 = i18next.t("registrationPending.bodyText1");
  expect(screen.getByText(bodyText1)).toBeDefined();
});
it("Should render proper bodyText2.", () => {
  render(<RegistrationPending />);
  const bodyText2 = i18next.t("registrationPending.bodyText2");
  expect(screen.getByText(bodyText2)).toBeDefined();
});
