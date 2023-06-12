import { Preview } from "@storybook/react";
import { initialize as initializeMSW, mswLoader } from "msw-storybook-addon";

import "../src/styles/bootstrap.scss";

initializeMSW();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const preview: Preview = {
  loaders: [mswLoader],
};
export default preview;
