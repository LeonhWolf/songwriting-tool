import { ComponentStory, ComponentMeta } from "@storybook/react";

import Toast from "./Toast";

export default {
  title: "Components/Toast",
  component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

export const Info = Template.bind({});
export const Error = Template.bind({});

Info.args = {
  bodyText: "Some body text...",
  severity: "info",
};
Error.args = {
  bodyText: "Some body text...",
  severity: "error",
};
