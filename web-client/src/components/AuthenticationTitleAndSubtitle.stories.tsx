import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuthenticationTitleAndSubtitle from "./AuthenticationTitleAndSubtitle";

export default {
  title: "AuthenticationTitleAndSubtitle",
  component: AuthenticationTitleAndSubtitle,
} as ComponentMeta<typeof AuthenticationTitleAndSubtitle>;

const Template: ComponentStory<typeof AuthenticationTitleAndSubtitle> = (
  args
) => (
  <AuthenticationTitleAndSubtitle {...args}>
    <div>This is some content that is rendered here</div>
  </AuthenticationTitleAndSubtitle>
);

export const Main = Template.bind({});

Main.args = {
  title: "This is a Title",
  subtitle: "This is a Subtitle",
};
