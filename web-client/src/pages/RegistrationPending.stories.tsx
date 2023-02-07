import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import RegistrationPending from "./RegistrationPending";

export default {
  title: "Pages/RegistrationPending",
  component: RegistrationPending,
} as ComponentMeta<typeof RegistrationPending>;

const Template: ComponentStory<typeof RegistrationPending> = () => (
  <div className="w-100 d-flex justify-content-center">
    <BrowserRouter>
      <RegistrationPending />
    </BrowserRouter>
  </div>
);

export const Main = Template.bind({});

Main.args = {};
