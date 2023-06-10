import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import Home from "./Home";

export default {
  title: "Pages/Home",
  component: Home,
} as ComponentMeta<typeof Home>;

const Template: ComponentStory<typeof Home> = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

export const Main = Template.bind({});

Main.args = {};
