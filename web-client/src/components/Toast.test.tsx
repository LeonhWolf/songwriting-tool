import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import fakeTimers from "@sinonjs/fake-timers";
import { Provider } from "react-redux";

import Toast from "./Toast";
import { store } from "../redux/store";
import { addToast } from "../redux/toastsSlice";

let clock: fakeTimers.InstalledClock;

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("12345"),
}));

beforeAll(() => {
  clock = fakeTimers.install();
});

afterAll(() => {
  clock.uninstall();
});

it("Should render bodyText.", () => {
  render(<Toast id="123" bodyText="test, 123" severity="info" />);
  expect(screen.getByText("test, 123")).toBeDefined();
});
describe("Severity:", () => {
  it("Should render 'info' severity.", () => {
    render(<Toast id="123" bodyText="test here" severity="info" />);
    const toastElement = screen.getByText("test here").parentElement; // eslint-disable-line
    expect(toastElement?.className.includes("bg-white")).toBe(true);
  });
  it("Should render 'error' severity.", () => {
    render(<Toast id="123" bodyText="test here" severity="error" />);
    const toastElement = screen.getByText("test here").parentElement; // eslint-disable-line
    expect(toastElement?.className.includes("bg-danger")).toBe(true);
  });
});

describe("Dispose:", () => {
  it("Should dispose on click of close button.", () => {
    const store = require("../redux/store").store;
    store.dispatch(addToast({ bodyText: "test text", severity: "info" }));
    expect(store.getState()).toEqual({
      toasts: [{ id: "12345", bodyText: "test text", severity: "info" }],
    });

    render(
      <Provider store={store}>
        <Toast id="12345" bodyText="test text" severity="info" />
      </Provider>
    );
    const closeButton = screen.getByRole("button");
    expect(screen.getByText("test text")).toBeDefined();

    fireEvent.click(closeButton);
    expect(store.getState()).toEqual({ toasts: [] });
  });
  it("Should dispose after 5 secs.", () => {
    store.dispatch(addToast({ bodyText: "test text 123", severity: "error" }));
    expect(store.getState()).toEqual({
      toasts: [{ id: "12345", bodyText: "test text 123", severity: "error" }],
    });

    render(
      <Provider store={store}>
        <Toast id="12345" bodyText="test text 123" severity="error" />
      </Provider>
    );
    expect(store.getState()).toEqual({
      toasts: [{ id: "12345", bodyText: "test text 123", severity: "error" }],
    });

    clock.tick(4999);
    expect(store.getState()).toEqual({
      toasts: [{ id: "12345", bodyText: "test text 123", severity: "error" }],
    });

    clock.tick(1);
    expect(store.getState()).toEqual({ toasts: [] });
  });
  it("Should cancel dispose timer when close btn pressed.", () => {
    store.dispatch(addToast({ bodyText: "test text 123", severity: "error" }));
    expect(store.getState()).toEqual({
      toasts: [{ id: "12345", bodyText: "test text 123", severity: "error" }],
    });

    render(
      <Provider store={store}>
        <Toast id="12345" bodyText="test text 123" severity="error" />
      </Provider>
    );
    // Bootstrap toast seems to add its own timer
    expect(clock.countTimers()).toBe(2);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    // Bootstrap toast seems to add its own timer
    expect(clock.countTimers()).toBe(1);
  });
  it("Should dispose toast on unmount.", () => {
    const store = require("../redux/store").store;
    const { unmount } = render(
      <Provider store={store}>
        <Toast id="12345" bodyText="test text 123" severity="error" />
      </Provider>
    );
    expect(screen.getByText("test text 123")).toBeDefined();

    unmount();
    expect(screen.queryByText("test text 123")).toBe(null);
  });
});
