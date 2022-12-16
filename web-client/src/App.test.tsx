import { render, screen, act, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import fakeTimers from "@sinonjs/fake-timers";

import App from "./App";
import { store } from "./redux/store";
import { addToast, removeToast } from "./redux/toastsSlice";
import uuid from "uuid";

jest.mock("uuid", () => ({ v4: jest.fn() }));

let clock: fakeTimers.InstalledClock;

beforeAll(() => {
  clock = fakeTimers.install();
});

afterAll(() => {
  clock.uninstall();
});

beforeEach(() => {
  jest.resetModules();
});

it("Should render one toast.", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.queryByText("Test text here.")).toBeNull();

  act(() => {
    (uuid.v4 as jest.MockedFunction<typeof uuid.v4>).mockReturnValueOnce("123");
    store.dispatch(
      addToast({
        bodyText: "Test text here.",
        severity: "info",
      })
    );
  });
  expect(screen.getByText("Test text here.")).toBeDefined();
  act(() => {
    store.dispatch(removeToast("123"));
  });
});
it("Should render two toasts.", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.queryByText("Test text here.")).toBeNull();

  act(() => {
    (uuid.v4 as jest.MockedFunction<typeof uuid.v4>).mockReturnValueOnce("123");
    store.dispatch(
      addToast({
        bodyText: "Test1.",
        severity: "info",
      })
    );
    (uuid.v4 as jest.MockedFunction<typeof uuid.v4>).mockReturnValueOnce("456");
    store.dispatch(
      addToast({
        bodyText: "Test2.",
        severity: "error",
      })
    );
  });
  expect(screen.getByText("Test1.")).toBeDefined();
  expect(screen.getByText("Test2.")).toBeDefined();

  act(() => {
    store.dispatch(removeToast("123"));
    store.dispatch(removeToast("456"));
  });
});

it("Should only close first toast.", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.queryByText("Test text here.")).toBeNull();

  act(() => {
    (uuid.v4 as jest.MockedFunction<typeof uuid.v4>).mockReturnValueOnce("123");
    store.dispatch(
      addToast({
        bodyText: "Test1.",
        severity: "info",
      })
    );
    (uuid.v4 as jest.MockedFunction<typeof uuid.v4>).mockReturnValueOnce("456");
    store.dispatch(
      addToast({
        bodyText: "Test2.",
        severity: "error",
      })
    );
    (uuid.v4 as jest.MockedFunction<typeof uuid.v4>).mockReturnValueOnce("789");
    store.dispatch(
      addToast({
        bodyText: "Test3.",
        severity: "info",
      })
    );
  });

  const firstToastBodyElement = screen.getByText("Test1.");
  const firstToastCloseButton =
    firstToastBodyElement?.parentElement?.querySelector("button") as  // eslint-disable-line
      | HTMLButtonElement
      | undefined;
  if (!firstToastCloseButton) throw new Error();
  fireEvent.click(firstToastCloseButton);

  expect(screen.queryByText("Test1.")).toBeNull();
  expect(screen.getByText("Test2.")).toBeDefined();
  expect(screen.getByText("Test3.")).toBeDefined();

  act(() => {
    // Toast '123' is already disposed by button click.
    store.dispatch(removeToast("456"));
    store.dispatch(removeToast("789"));
  });
});
