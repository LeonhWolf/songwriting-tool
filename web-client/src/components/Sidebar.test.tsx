import Sidebar from "./Sidebar";

import { runTests as runSidebarTests } from "./Sidebar.test.helper";

describe("Sidebar:", () => {
  runSidebarTests(<Sidebar />);
});
