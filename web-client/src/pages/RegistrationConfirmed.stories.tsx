import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import RegistrationConfirmed from "./RegistrationConfirmed";

export default {
  title: "RegistrationConfirmed",
  component: RegistrationConfirmed,
} as ComponentMeta<typeof RegistrationConfirmed>;

const Template: ComponentStory<typeof RegistrationConfirmed> = () => (
  <BrowserRouter>
    <RegistrationConfirmed />
  </BrowserRouter>
);

export const Main = Template.bind({});

Main.args = {};
