import {
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import Popover from "./Popover";

describe("Initial visibility:", () => {
  it("Should show the popover.", () => {
    render(
      <Popover doShow content="testContent" targetComponent={<div></div>} />
    );
    expect(screen.getByText("testContent")).toBeDefined();
  });
  it("Should hide the popover.", () => {
    render(
      <Popover
        doShow={false}
        content="testContent"
        targetComponent={<div></div>}
      />
    );
    expect(screen.queryByText("testContent")).toBe(null);
  });
});

describe("Toggling visibility:", () => {
  it("Should show the hidden popover.", () => {
    const { rerender } = render(
      <Popover
        doShow={false}
        content="testContent"
        targetComponent={<div></div>}
      />
    );
    expect(screen.queryByText("testContent")).toBe(null);

    rerender(
      <Popover doShow content="testContent" targetComponent={<div></div>} />
    );
    expect(screen.getByText("testContent")).toBeDefined();
  });
  it("Should hide the shown popover.", async () => {
    const { rerender } = render(
      <Popover doShow content="testContent" targetComponent={<div></div>} />
    );
    expect(screen.getByText("testContent")).toBeDefined();

    rerender(
      <Popover
        doShow={false}
        content="testContent"
        targetComponent={<div></div>}
      />
    );
    await waitForElementToBeRemoved(() => screen.queryByText("testContent"));
    expect(screen.queryByText("testContent")).toBe(null);
  });
  it("Should not toggle by click on 'targetComponent'.", async () => {
    render(
      <Popover
        doShow={false}
        content="testContent"
        targetComponent={<div>test here</div>}
      />
    );
    expect(screen.queryByText("testContent")).toBe(null);
    const targetComponent = screen.getByText("test here");

    await act(async () => {
      await targetComponent.click();
      await targetComponent.click();
    });

    // apparently the popover only toggles after a delay
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(screen.queryByText("testContent")).toBe(null);
  });
});

it("Should render the proper content.", () => {
  render(
    <Popover
      doShow
      content="testContent 123 lorem ipsum"
      targetComponent={<div></div>}
    />
  );
  expect(screen.getByText("testContent 123 lorem ipsum")).toBeDefined();
});

it("Should render the passed in component.", () => {
  render(
    <Popover
      doShow
      content="testContent 123 lorem ipsum"
      targetComponent={<div>testComponentText</div>}
    />
  );
  expect(screen.getByText("testComponentText")).toBeDefined();
});
it("Should position the popover on the passed in component.", () => {
  render(
    <Popover
      doShow={true}
      content="testContent 123 lorem ipsum"
      targetComponent={<div>testComponentText</div>}
    />
  );

  const passedInComponent = screen.getByText("testComponentText");
  expect(
    passedInComponent.parentElement //eslint-disable-line
      ?.getAttribute("aria-describedby")
      ?.includes("popover")
  ).toBeTruthy();
});

it("Should dispose popover on unmount.", () => {
  const { unmount } = render(
    <Popover doShow content="testContent" targetComponent={<div></div>} />
  );
  unmount();

  expect(screen.queryByText("testContent")).toBe(null);
});
