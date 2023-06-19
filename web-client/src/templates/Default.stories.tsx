import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RouterProvider } from "react-router-dom";

import DefaultTemplate from "./Default";
import { paths } from "../router";
import { getRouter } from "../utilities/testUtils";

const meta: Meta<typeof DefaultTemplate> = {
  title: "Templates/Default",
  component: DefaultTemplate,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DefaultTemplate>;

interface Props {
  children: React.ReactElement;
}

const RouterWrapper = (props: Props) => {
  const [router, setRouter] = useState<ReturnType<typeof getRouter>>(
    getRouter(
      paths.home.path,
      [],
      <div className="w-100" style={{ height: "100vh" }}>
        {props.children}
      </div>
    )
  );

  return <RouterProvider router={router} />;
};

export const ContentCenter: Story = {
  render: () => (
    <RouterWrapper>
      <DefaultTemplate
        title="This is a title"
        subtitle="This is a Subtitle"
        contentPosition="center"
        onSubtitleChange={() => {}}
      >
        <div>This is some content that is centered.</div>
      </DefaultTemplate>
    </RouterWrapper>
  ),
};

export const ContentLeft: Story = {
  render: () => (
    <RouterWrapper>
      <DefaultTemplate
        title="This is a title"
        subtitle="This is a Subtitle"
        contentPosition="left"
        onSubtitleChange={() => {}}
      >
        <div>This is some content that is left.</div>
      </DefaultTemplate>
    </RouterWrapper>
  ),
};

export const NoSubtitle: Story = {
  render: () => (
    <RouterWrapper>
      <DefaultTemplate
        title="This is a title"
        subtitle=""
        contentPosition="left"
        onSubtitleChange={() => {}}
      >
        <div>This is some content that is left.</div>
      </DefaultTemplate>
    </RouterWrapper>
  ),
};
