import { ComponentStory, ComponentMeta } from "@storybook/react";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";

import ConfirmRegistration from "./ConfirmRegistration";

export default {
  title: "Pages/ConfirmRegistration",
  component: ConfirmRegistration,
} as ComponentMeta<typeof ConfirmRegistration>;

const Template: ComponentStory<typeof ConfirmRegistration> = () => (
  <BrowserRouter>
    <ConfirmRegistration />
  </BrowserRouter>
);

export const Pending = Template.bind({});
Pending.args = {};

export const Success = Template.bind({});
Success.parameters = {
  msw: {
    handlers: [
      rest.post(
        `${process.env.REACT_APP_BASE_URL}/api/confirm-registration`,
        (req, res, ctx) => {
          return res(ctx.status(200));
        }
      ),
    ],
  },
};

// export const UrlIsInvalid = Template.bind({});
// UrlIsInvalid.parameters = {};

export const IdIsExpired = Template.bind({});
IdIsExpired.parameters = {
  msw: {
    handlers: [
      rest.post(
        `${process.env.REACT_APP_BASE_URL}/api/confirm-registration`,
        (req, res, ctx) => {
          return res(ctx.status(400));
        }
      ),
    ],
  },
};
