import { RouterProvider } from "react-router-dom";
import type { Meta, StoryObj } from "@storybook/react";

import { paths } from "../navigation/router";
import { getRouter } from "../utils/testUtils";

const meta: Meta<typeof paths.home.element> = {
  title: "Pages/Home",
  //@ts-ignore
  component: paths.home.element,
};

export default meta;
type Story = StoryObj<typeof paths.home.element>;

export const Main: Story = {
  render: () => <RouterProvider router={getRouter(paths.home.path)} />,
};
