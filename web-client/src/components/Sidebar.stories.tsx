import { RouterProvider } from "react-router-dom";

import Sidebar from "./Sidebar";
import { paths } from "../router";
import { getRouter } from "../utilities/testUtils";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Home: Story = {
  render: () => (
    <RouterProvider router={getRouter(paths.home.path, [], <Sidebar />)} />
  ),
};

export const DailyExercise: Story = {
  render: () => (
    <RouterProvider
      router={getRouter(paths.dailyExercise.path, [], <Sidebar />)}
    />
  ),
};

export const UserSettings: Story = {
  render: () => (
    <RouterProvider
      router={getRouter(paths.userSettings.path, [], <Sidebar />)}
    />
  ),
};
