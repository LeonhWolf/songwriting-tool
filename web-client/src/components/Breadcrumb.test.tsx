import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import Breadcrumb from "./Breadcrumb";

const history = createMemoryHistory();
history.push = jest.fn();
// const renderWithAct = async (): Promise<void> => {
//   /*eslint-disable*/
//   await act(() => {
//     render(
//       <Router location={history.location} navigator={history}>
//         <Login />
//       </Router>
//     );
//   });
// };

describe("Render:", () => {
  it("Should render home.", () => {
    const { baseElement } = render(
      <Router location="/" navigator={history}>
        <Breadcrumb />
      </Router>
    );
    const breadcrumbItems = baseElement.querySelectorAll(
      ".breadcrumb-item.active"
    );
    expect(breadcrumbItems.length).toBe(1);
  });
  it.todo("Should render route.");
  it.todo("Should render nested route.");
});

describe("Navigate on click:", () => {
  it.todo("Should navigate to parent route.");
  it.todo("Should navigate to route above parent route.");
  it.todo("Should not navigate active route.");
});
