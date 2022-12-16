import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import { addToast } from "./redux/toastsSlice";

import App from "./App";

export default {
  title: "App",
  component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export const Toasts = Template.bind({});

Toasts.args = {};
Toasts.play = async () => {
  store.dispatch(
    addToast({ bodyText: "Toast 1 body text.", severity: "info" })
  );
  store.dispatch(
    addToast({ bodyText: "Toast 2 body text.", severity: "error" })
  );
  store.dispatch(
    addToast({ bodyText: "Toast 3 body text.", severity: "info" })
  );
};
