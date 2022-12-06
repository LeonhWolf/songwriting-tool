import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import Register from "./Register";

export default {
  title: "Register",
  component: Register,
} as ComponentMeta<typeof Register>;

const Template: ComponentStory<typeof Register> = (args) => (
  <BrowserRouter>
    <Register {...args} />
  </BrowserRouter>
);

export const Main = Template.bind({});

Main.args = {};
