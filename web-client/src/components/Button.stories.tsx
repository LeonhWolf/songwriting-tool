import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Main = Template.bind({});
export const Disabled = Template.bind({});

Main.args = {
  text: "ButtonText",
  isDisabled: false,
  onClick: () => {},
};

Disabled.args = {
  text: "ButtonText",
  isDisabled: true,
  onClick: () => {},
};
