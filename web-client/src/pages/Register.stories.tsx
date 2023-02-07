import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import Register from "./Register";

export default {
  title: "Pages/Register",
  component: Register,
} as ComponentMeta<typeof Register>;

const Template: ComponentStory<typeof Register> = () => (
  <div className="w-100 d-flex justify-content-center">
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  </div>
);

export const Main = Template.bind({});

Main.args = {};
