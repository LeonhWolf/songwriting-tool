import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "./Form";

export default {
  title: "Form",
  component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = (args) => (
  <form className="needs-validation" noValidate>
    <Form {...args} />
  </form>
);

export const Main = Template.bind({});
Main.args = {
  contents: [
    {
      inputId: "name",
      labelText: "Name",
      inputType: "text",
      isRequired: true,
    },
    {
      inputId: "email",
      labelText: "Email",
      inputType: "text",
      isRequired: true,
    },
    {
      inputId: "test",
      labelText: "Test",
      inputType: "text",
    },
    {
      inputId: "password",
      labelText: "Password",
      inputType: "password",
      isRequired: true,
    },
  ],
};

export const Invalid = Template.bind({});
Invalid.args = {
  contents: [
    {
      inputId: "name",
      labelText: "Name",
      inputType: "text",
      isRequired: true,
      invalidMessage: "Please provide a name",
    },
    {
      inputId: "email",
      labelText: "Email",
      inputType: "email",
      isRequired: true,
      invalidMessage: "Please provide an email",
    },
    {
      inputId: "test",
      labelText: "Test",
      inputType: "text",
    },
    {
      inputId: "password",
      labelText: "Password",
      inputType: "password",
      isRequired: true,
      invalidMessage: "Please provide a password",
    },
  ],
};
