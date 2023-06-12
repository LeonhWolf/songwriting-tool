import Breadcrumb from "./Breadcrumb";
import { TestRouter, additionalPaths } from "./Breadcrumb.test.helper";
import { paths } from "../navigation/router";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Home: Story = {
  render: () => <TestRouter initialPath={paths.home.path} />,
};

export const OneLayerNesting: Story = {
  render: () => (
    <TestRouter initialPath={additionalPaths.nestedFirstLevel.path} />
  ),
};

export const TwoLayerNesting: Story = {
  render: () => (
    <TestRouter initialPath={additionalPaths.nestedSecondLevel.path} />
  ),
};
