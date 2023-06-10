import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DefaultTemplate from "./Default";

describe("Title and subtitle:", () => {
  it("Should render the title.", () => {
    render(
      <DefaultTemplate title="Page Title" contentPosition="center">
        <div>123</div>
      </DefaultTemplate>
    );
    expect(screen.getByText("Page Title")).toBeDefined();
  });
  it("Should render the subtitle.", () => {
    render(
      <DefaultTemplate
        title="Page Title"
        subtitle="Page Subtitle"
        contentPosition="center"
        onSubtitleChange={() => {}}
      >
        <div>123</div>
      </DefaultTemplate>
    );
    expect(screen.getByText("Page Subtitle")).toBeDefined();
  });
  it.todo("Should emit 'onSubtitleChange'.");
});

describe("Breadcrumbs:", () => {
  it.todo("Should display home.");
  it.todo("Should display route.");
  it.todo("Should display nested route.");
});

it("Should display the children element.", () => {
  render(
    <DefaultTemplate
      title="Page Title"
      subtitle="Page Subtitle"
      contentPosition="center"
      onSubtitleChange={() => {}}
    >
      <div>
        <p>123</p>
        <p>456</p>
      </div>
    </DefaultTemplate>
  );
  expect(screen.getByText("123")).toBeDefined();
  expect(screen.getByText("456")).toBeDefined();
});
// describe("Tiles:", () => {
//   describe("'Daily Exercise':", () => {
//     it.todo("Should display tile.");
//     it.todo("Should navigate on click.");
//   });
//   describe("'Archive':", () => {
//     it.todo("Should display tile.");
//     it.todo("Should navigate on click.");
//   });
// });
