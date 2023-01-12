import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import Login from "./Login";

export default {
  title: "Pages/Login",
  component: Login,
} as ComponentMeta<typeof Login>;

const Template: ComponentStory<typeof Login> = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);

export const Main = Template.bind({});

Main.args = {};
