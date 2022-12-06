import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import AuthenticationTitleAndSubtitle from "./AuthenticationTitleAndSubtitle";

it("Should render 'title'.", () => {
  render(
    <AuthenticationTitleAndSubtitle title="test title" subtitle="test subtitle">
      <div>test div</div>
    </AuthenticationTitleAndSubtitle>
  );
  expect(screen.getByText("test title")).toBeDefined();
});
it("Should render 'subtitle'.", () => {
  render(
    <AuthenticationTitleAndSubtitle title="test title" subtitle="test subtitle">
      <div>test div</div>
    </AuthenticationTitleAndSubtitle>
  );
  expect(screen.getByText("test subtitle")).toBeDefined();
});
it("Should render 'content'.", () => {
  render(
    <AuthenticationTitleAndSubtitle title="test title" subtitle="test subtitle">
      <div>test div</div>
    </AuthenticationTitleAndSubtitle>
  );
  expect(screen.getByText("test div")).toBeDefined();
});
