import { ComponentStory, ComponentMeta } from "@storybook/react";

import Breadcrumb from "./Breadcrumb";

export default {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>;

const Template: ComponentStory<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args} />
);

export const Main = Template.bind({});
export const Disabled = Template.bind({});

Main.args = {
  text: "BreadcrumbText",
  isDisabled: false,
  onClick: () => {},
};

Disabled.args = {
  text: "BreadcrumbText",
  isDisabled: true,
  onClick: () => {},
};
