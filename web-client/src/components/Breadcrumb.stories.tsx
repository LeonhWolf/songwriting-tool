import { RouterProvider } from "react-router-dom";

import Breadcrumb from "./Breadcrumb";
import { getRouter, additionalPaths } from "./Breadcrumb.test.helper";
import { paths } from "../navigation/router";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Home: Story = {
  render: () => <RouterProvider router={getRouter(paths.home.path)} />,
};

export const OneLayerNesting: Story = {
  render: () => (
    <RouterProvider router={getRouter(additionalPaths.nestedFirstLevel.path)} />
  ),
};

export const TwoLayerNesting: Story = {
  render: () => (
    <RouterProvider
      router={getRouter(additionalPaths.nestedSecondLevel.path)}
    />
  ),
};
