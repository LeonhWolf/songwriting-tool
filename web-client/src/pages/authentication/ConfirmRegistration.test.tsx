import { render, screen, act } from "@testing-library/react";
import fakeTimers from "@sinonjs/fake-timers";
import "whatwg-fetch";

import ConfirmRegistration from "./ConfirmRegistration";
import i18next from "../../i18n/index";
import { confirmRegistration } from "../../services/authenticationService";
import { flushPendingPromises } from "../../utils/testUtils";

jest.mock("../../services/authenticationService", () => ({
  confirmRegistration: jest.fn().mockResolvedValue(""),
}));

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

let clock: fakeTimers.InstalledClock;

beforeAll(() => {
  clock = fakeTimers.install();
});
beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(document, "URL", "get")
    .mockImplementation(() => "https://mock-url.com/some-route?id=112233");
});

afterAll(() => {
  clock.uninstall();
});

describe("Render:", () => {
  it("Should render title.", () => {
    render(<ConfirmRegistration />);
    const titleText = i18next.t("confirmRegistration.title");
    expect(screen.getByText(titleText)).toBeDefined();
  });
  it("Should render subtitle.", () => {
    render(<ConfirmRegistration />);
    const subtitleText = i18next.t("confirmRegistration.subtitle");
    expect(screen.getByText(subtitleText)).toBeDefined();
  });
  it("Should render body text.", () => {
    render(<ConfirmRegistration />);
    const bodyText = i18next.t("confirmRegistration.bodyText");
    expect(screen.getByText(bodyText)).toBeDefined();
  });
});

it("Should call 'confirmRegistration()' with URL query parameter.", () => {
  render(<ConfirmRegistration />);
  expect(confirmRegistration).toHaveBeenCalledWith({
    confirmation_id: "112233",
  });
});
describe("'confirmRegistration()' resolves:", () => {
  it("Should show success message.", async () => {
    render(<ConfirmRegistration />);

    await act(async () => {
      await flushPendingPromises();
    });

    const bodyText = i18next.t("confirmRegistration.bodyText");
    const successText = i18next.t("confirmRegistration.success");
    expect(screen.queryByText(bodyText)).toBeNull();
    expect(screen.getByText(successText)).toBeDefined();
  });
  it("Should redirect to '/' after 5 seconds.", async () => {
    clock.reset();
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    render(<ConfirmRegistration />);
    await act(async () => {
      await flushPendingPromises();
    });

    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    clock.tick(4999);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    clock.tick(1);
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith("/");
  });
});

describe("Confirmation id URL variable is 'null':", () => {
  it("Show error message.", () => {
    jest
      .spyOn(document, "URL", "get")
      .mockImplementationOnce(
        () => "https://mock-url.com/some-route?somevariable=456"
      );

    render(<ConfirmRegistration />);
    const bodyText = i18next.t("confirmRegistration.bodyText");
    expect(screen.queryByText(bodyText)).toBeNull();

    const urlIsInvalidText = i18next.t("confirmRegistration.urlIsInvalid");
    expect(screen.getByText(urlIsInvalidText)).toBeDefined();
  });
  it("Should not redirect.", () => {
    clock.reset();
    jest
      .spyOn(document, "URL", "get")
      .mockImplementationOnce(
        () => "https://mock-url.com/some-route?somevariable=456"
      );
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);

    render(<ConfirmRegistration />);
    clock.tick(100000);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
});

describe("'confirmRegistration()' fetch (status === 400):", () => {
  it("Should show error message.", async () => {
    const response = new Response(undefined, { status: 400 });
    (
      confirmRegistration as jest.MockedFunction<typeof confirmRegistration>
    ).mockResolvedValueOnce(response);

    render(<ConfirmRegistration />);
    const idIsExpiredText = i18next.t("confirmRegistration.idIsExpired");
    expect(screen.queryByText(idIsExpiredText)).toBeNull();

    await act(async () => {
      await flushPendingPromises();
    });

    const bodyText = i18next.t("confirmRegistration.bodyText");
    expect(screen.queryByText(bodyText)).toBeNull();
    expect(screen.getByText(idIsExpiredText)).toBeDefined();
  });
  it("Should not redirect.", async () => {
    clock.reset();
    const response = new Response(undefined, { status: 400 });
    (
      confirmRegistration as jest.MockedFunction<typeof confirmRegistration>
    ).mockResolvedValueOnce(response);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);

    render(<ConfirmRegistration />);
    await act(async () => {
      await flushPendingPromises();
    });
    clock.tick(50000);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
});
describe("'confirmRegistration()' fetch (status === 500):", () => {
  it("Should not show error message.", async () => {
    const response = new Response(undefined, { status: 500 });
    (
      confirmRegistration as jest.MockedFunction<typeof confirmRegistration>
    ).mockResolvedValueOnce(response);

    render(<ConfirmRegistration />);
    const idIsExpiredText = i18next.t("confirmRegistration.idIsExpired");
    expect(screen.queryByText(idIsExpiredText)).toBeNull();

    await act(async () => {
      await flushPendingPromises();
    });

    expect(screen.queryByText(idIsExpiredText)).toBeNull();
  });
  it("Should not redirect.", async () => {
    clock.reset();
    const response = new Response(undefined, { status: 500 });
    (
      confirmRegistration as jest.MockedFunction<typeof confirmRegistration>
    ).mockResolvedValueOnce(response);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);

    render(<ConfirmRegistration />);
    await act(async () => {
      await flushPendingPromises();
    });
    clock.tick(50000);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
});
describe("'confirmRegistration()' rejects:", () => {
  it("Should not show error message.", async () => {
    (
      confirmRegistration as jest.MockedFunction<typeof confirmRegistration>
    ).mockRejectedValueOnce("Some reason why fetch rejected.");

    render(<ConfirmRegistration />);
    const idIsExpiredText = i18next.t("confirmRegistration.idIsExpired");
    expect(screen.queryByText(idIsExpiredText)).toBeNull();

    await act(async () => {
      await flushPendingPromises();
    });

    expect(screen.queryByText(idIsExpiredText)).toBeNull();
  });
  it("Should not redirect.", async () => {
    clock.reset();
    (
      confirmRegistration as jest.MockedFunction<typeof confirmRegistration>
    ).mockRejectedValueOnce("Some reason why fetch rejected.");
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);

    render(<ConfirmRegistration />);
    await act(async () => {
      await flushPendingPromises();
    });
    clock.tick(50000);
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
});
