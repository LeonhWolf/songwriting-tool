import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";

import i18next from "../i18n/";

import Login from "./Login";

export default {
  title: "Pages/Login",
  component: Login,
} as ComponentMeta<typeof Login>;

const Template: ComponentStory<typeof Login> = () => (
  <div className="w-100 d-flex justify-content-center">
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  </div>
);

export const Default = Template.bind({});

Default.args = {};

export const WrongCredentials = Template.bind({});

WrongCredentials.args = {};
WrongCredentials.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const emailPlaceholderText = i18next.t("login.email.placeholder");
  const emailInput = canvas.getByPlaceholderText(emailPlaceholderText);
  await userEvent.type(emailInput, "john@doe.com", { delay: 100 });

  const passwordPlaceholderText = i18next.t("login.password.placeholder");
  const passwordInput = canvas.getByPlaceholderText(passwordPlaceholderText);
  await userEvent.type(passwordInput, "112233449", { delay: 100 });

  const loginButtonText = i18next.t("login.loginButtonText");
  const loginButton = canvas.getByText(loginButtonText);
  await userEvent.click(loginButton);
};
WrongCredentials.parameters = {
  msw: {
    handlers: [
      rest.post(
        `${process.env.REACT_APP_BASE_URL}/api/login`,
        (req, res, ctx) => {
          return res(ctx.status(400));
        }
      ),
    ],
  },
};
