import type { Meta, StoryObj } from "@storybook/react";

import DefaultTemplate from "./Default";

const meta: Meta<typeof DefaultTemplate> = {
  title: "Templates/Default",
  component: DefaultTemplate,
};

export default meta;
type Story = StoryObj<typeof DefaultTemplate>;

export const ContentCenter: Story = {
  render: () => (
    <div className="w-100">
      <DefaultTemplate
        title="This is a title"
        subtitle="This is a Subtitle"
        contentPosition="center"
        onSubtitleChange={() => {}}
      >
        <div>This is some content that is centered.</div>
      </DefaultTemplate>
    </div>
  ),
};

export const ContentLeft: Story = {
  render: () => (
    <div className="w-100">
      <DefaultTemplate
        title="This is a title"
        subtitle="This is a Subtitle"
        contentPosition="left"
        onSubtitleChange={() => {}}
      >
        <div>This is some content that is left.</div>
      </DefaultTemplate>
    </div>
  ),
};

export const NoSubtitle: Story = {
  render: () => (
    <div className="w-100">
      <DefaultTemplate
        title="This is a title"
        subtitle=""
        contentPosition="left"
        onSubtitleChange={() => {}}
      >
        <div>This is some content that is left.</div>
      </DefaultTemplate>
    </div>
  ),
};
