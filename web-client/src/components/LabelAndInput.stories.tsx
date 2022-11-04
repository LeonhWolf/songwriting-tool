import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import LabelAndInput from "./LabelAndInput";

export default {
  title: "LabelAndInput",
  component: LabelAndInput,
} as ComponentMeta<typeof LabelAndInput>;

const Template: ComponentStory<typeof LabelAndInput> = (args) => (
  <form className="needs-validation" noValidate>
    <LabelAndInput {...args} />
  </form>
);

export const Main = Template.bind({});
Main.args = {
  inputId: "testInput",
  labelText: "testInput",
  inputType: "text",
  inputPlaceholder: "type here",
  isRequired: false,
};

export const Required = Template.bind({});
Required.args = {
  inputId: "testInput",
  labelText: "testInput",
  inputType: "text",
  inputPlaceholder: "type here",
  isRequired: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  inputId: "testInput",
  labelText: "testInput",
  inputType: "text",
  inputPlaceholder: "type here",
  invalidMessage: "some invalid message",
};
