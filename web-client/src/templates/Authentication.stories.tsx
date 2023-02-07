import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuthenticationTitleAndSubtitle from "./Authentication";

export default {
  title: "Templates/Authentication",
  component: AuthenticationTitleAndSubtitle,
} as ComponentMeta<typeof AuthenticationTitleAndSubtitle>;

const Template: ComponentStory<typeof AuthenticationTitleAndSubtitle> = (
  args
) => (
  <div className="w-100 d-flex justify-content-center">
    <AuthenticationTitleAndSubtitle {...args}>
      <div>This is some content that is rendered here</div>
    </AuthenticationTitleAndSubtitle>
  </div>
);

export const Main = Template.bind({});

Main.args = {
  title: "This is a Title",
  subtitle: "This is a Subtitle",
};
