import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import Register from "./Register";

export default {
  title: "Pages/Register",
  component: Register,
} as ComponentMeta<typeof Register>;

const Template: ComponentStory<typeof Register> = () => (
  <BrowserRouter>
    <Register />
  </BrowserRouter>
);

export const Main = Template.bind({});

Main.args = {};
