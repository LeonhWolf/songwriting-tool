import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import RegistrationPending from "./RegistrationPending";

export default {
  title: "Pages/RegistrationPending",
  component: RegistrationPending,
} as ComponentMeta<typeof RegistrationPending>;

const Template: ComponentStory<typeof RegistrationPending> = () => (
  <BrowserRouter>
    <RegistrationPending />
  </BrowserRouter>
);

export const Main = Template.bind({});

Main.args = {};
