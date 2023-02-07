import { ComponentStory, ComponentMeta } from "@storybook/react";

import DefaultTemplate from "./Default";

export default {
  title: "Templates/Default",
  component: DefaultTemplate,
} as ComponentMeta<typeof DefaultTemplate>;

const Template: ComponentStory<typeof DefaultTemplate> = (args) => (
  <div className="w-100 d-flex justify-content-center">
    <DefaultTemplate {...args}>
      <div>This is some content that is rendered here</div>
    </DefaultTemplate>
  </div>
);

export const Main = Template.bind({});

Main.args = {
  title: "This is a Title",
  subtitle: "This is a Subtitle",
};
