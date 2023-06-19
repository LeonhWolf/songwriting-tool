import { render, screen } from "@testing-library/react";

import Collapse from "./Collapse";
import { flushPendingPromises } from "../utilities/testUtils";

it("Should not show collapse.", async () => {
  const testElement = <div>test text</div>;
  const { container } = render(
    <Collapse doShow={false}>{testElement}</Collapse>
  );

  // Sadly, I can't change the transition time for the element
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(container.children[0].classList.contains("show")).toBe(false); // eslint-disable-line
});
it("Should show collapse.", async () => {
  const testElement = <div>test text</div>;
  const { container } = render(
    <Collapse doShow={true}>{testElement}</Collapse>
  );

  expect(screen.getByText("test text")).toBeDefined();
  // Sadly, I can't change the transition time for the element
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(container.children[0].classList.contains("show")).toBe(true); // eslint-disable-line
});
it("Should hide when showing.", async () => {
  const testElement = <div>test text</div>;
  const { container, rerender } = render(
    <Collapse doShow={true}>{testElement}</Collapse>
  );

  // Sadly, I can't change the transition time for the element
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(container.children[0].classList.contains("show")).toBe(true); // eslint-disable-line

  rerender(<Collapse doShow={false}>{testElement}</Collapse>);
  // Sadly, I can't change the transition time for the element
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(container.children[0].classList.contains("show")).toBe(false); // eslint-disable-line
});
it("Should show when hidden.", async () => {
  const testElement = <div>test text</div>;
  const { container, rerender } = render(
    <Collapse doShow={false}>{testElement}</Collapse>
  );

  // Sadly, I can't change the transition time for the element
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(container.children[0].classList.contains("show")).toBe(false); // eslint-disable-line

  rerender(<Collapse doShow={true}>{testElement}</Collapse>);
  // Sadly, I can't change the transition time for the element
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(container.children[0].classList.contains("show")).toBe(true); // eslint-disable-line
});
it("Should dispose element.", () => {
  const testElement = <div>test text</div>;
  const { unmount } = render(<Collapse doShow={false}>{testElement}</Collapse>);

  expect(screen.getByText("test text")).toBeDefined();
  unmount();
  expect(screen.queryByText("test text")).toBeNull();
});
