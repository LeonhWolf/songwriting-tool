import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Collapse from "./Collapse";

const meta: Meta<typeof Collapse> = {
  title: "Components/Collapse",
  component: Collapse,
};

export default meta;
type Story = StoryObj<typeof Collapse>;

const CollapseElement = () => {
  return (
    <div
      className="p-3"
      style={{ border: "solid black 1px", width: "fit-content" }}
    >
      some collapsable content
    </div>
  );
};

const CollapseWrapper = (props: { doShowInitially: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.doShowInitially);

  return (
    <div>
      <button
        className="mb-2 btn btn-primary"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        toggle
      </button>
      <Collapse doShow={isOpen}>
        <CollapseElement />
      </Collapse>
    </div>
  );
};

export const Shown: Story = {
  render: () => <CollapseWrapper doShowInitially={true} />,
};
export const Hidden: Story = {
  render: () => <CollapseWrapper doShowInitially={false} />,
};
