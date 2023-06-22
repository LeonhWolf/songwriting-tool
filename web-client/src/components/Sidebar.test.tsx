import { runTests as runSidebarTests } from "./Sidebar.test.helper";
import { paths } from "../router";

// Without it the mobile Offcanvas leads to having each sidebar nav item twice on the page.
jest.mock("../components/Offcanvas.tsx", () => () => {
  <div></div>;
});

describe("Sidebar:", () => {
  runSidebarTests(paths.dailyExercise.path);
});
