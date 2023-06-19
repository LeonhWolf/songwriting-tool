import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Offcanvas from "./Offcanvas";

const meta: Meta<typeof Offcanvas> = {
  title: "Components/Offcanvas",
  component: Offcanvas,
};

export default meta;
type Story = StoryObj<typeof Offcanvas>;

const testElement = <div style={{ width: "300px" }}>some content here</div>;
const smallTestElement = <div>some content here</div>;

const ToggleElement = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        toggle
      </button>
      <Offcanvas
        isOpen={isOpen}
        onOpenChange={(isOpenUpdate) => {
          setIsOpen(isOpenUpdate);
        }}
      >
        <div>
          {testElement}
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            toggle
          </button>
        </div>
      </Offcanvas>
    </div>
  );
};

export const Open: Story = {
  render: () => (
    <Offcanvas isOpen={true} onOpenChange={() => {}}>
      {testElement}
    </Offcanvas>
  ),
};

export const Small: Story = {
  render: () => (
    <Offcanvas isOpen={true} onOpenChange={() => {}}>
      {smallTestElement}
    </Offcanvas>
  ),
};

export const Closed: Story = {
  render: () => (
    <Offcanvas isOpen={false} onOpenChange={() => {}}>
      {testElement}
    </Offcanvas>
  ),
};

export const Toggle: Story = {
  render: () => <ToggleElement />,
};
