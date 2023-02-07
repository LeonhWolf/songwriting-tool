import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import AuthenticationTemplate from "./Authentication";

it("Should render 'title'.", () => {
  render(
    <AuthenticationTemplate title="test title" subtitle="test subtitle">
      <div>test div</div>
    </AuthenticationTemplate>
  );
  expect(screen.getByText("test title")).toBeDefined();
});
it("Should render 'subtitle'.", () => {
  render(
    <AuthenticationTemplate title="test title" subtitle="test subtitle">
      <div>test div</div>
    </AuthenticationTemplate>
  );
  expect(screen.getByText("test subtitle")).toBeDefined();
});
it("Should render 'content'.", () => {
  render(
    <AuthenticationTemplate title="test title" subtitle="test subtitle">
      <div>test div</div>
    </AuthenticationTemplate>
  );
  expect(screen.getByText("test div")).toBeDefined();
});
