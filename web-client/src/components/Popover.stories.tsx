import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Popover from "./Popover";

export default {
  title: "Popover",
  component: Popover,
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = (args) => (
  <Popover {...args} />
);

export const Main = Template.bind({});

Main.args = {
  targetComponent: (
    <p style={{ width: "fit-content" }}>Some text that needs a popover</p>
  ),
  doShow: true,
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias adipisci beatae vero odio eaque eum mollitia dignissimos est autem tempore!",
};
