import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Popover from "./Popover";

export default {
  title: "Components/Popover",
  component: Popover,
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = (args) => (
  <Popover {...args} />
);

export const Main = Template.bind({});
export const Hidden = Template.bind({});

Main.args = {
  targetComponent: (
    <p style={{ width: "fit-content" }}>Some text that needs a popover</p>
  ),
  doShow: true,
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias adipisci beatae vero odio eaque eum mollitia dignissimos est autem tempore!",
};
Hidden.args = {
  targetComponent: (
    <p style={{ width: "fit-content" }}>Some text without a popover</p>
  ),
  doShow: false,
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias adipisci beatae vero odio eaque eum mollitia dignissimos est autem tempore!",
};
