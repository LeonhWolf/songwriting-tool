import { RouterProvider } from "react-router-dom";
import type { Meta, StoryObj } from "@storybook/react";

import { paths } from "../router";
import { getRouter } from "../utilities/testUtils";

const meta: Meta<typeof paths.home.element> = {
  title: "Pages/Home",
  //@ts-ignore
  component: paths.home.element,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof paths.home.element>;

export const Main: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <RouterProvider router={getRouter(paths.home.path)} />
    </div>
  ),
};
