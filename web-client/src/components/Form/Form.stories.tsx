import Form from "./Form";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Main: Story = {
  render: () => (
    <Form
      doShowValidation={false}
      onValidSubmit={() => {}}
      onValidationChange={() => {}}
      contents={[
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
          doShowIsInsecure: true,
        },
      ]}
    />
  ),
};

export const Invalid: Story = {
  render: () => (
    <Form
      doShowValidation={true}
      onValidSubmit={() => {}}
      onValidationChange={() => {}}
      contents={[
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
          doShowIsInsecure: true,
        },
      ]}
    />
  ),
};
