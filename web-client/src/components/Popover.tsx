import React, { useRef, useEffect } from "react";
import { Popover as BsPopover } from "bootstrap";

interface IProps {
  targetComponent: React.ReactElement;
  doShow: boolean;
  content: string;
}

export default function Popover(props: IProps): React.ReactElement {
  const popover = useRef<BsPopover>();
  const popoverElement = useRef<HTMLElement>();

  const togglePopover = () => {
    if (props.doShow) {
      popover.current?.show();
      return;
    }
    popover.current?.hide();
  };

  useEffect(() => {
    if (!popover.current) {
      popover.current = new BsPopover(popoverElement.current ?? "", {
        content: props.content,
      });
    }

    togglePopover();
  }, [props.doShow]);

  useEffect(() => {
    return function cleanup() {
      popover.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={popoverElement as React.RefObject<HTMLDivElement>}
      style={{ width: "fit-content" }}
    >
      {props.targetComponent}
    </div>
  );
}
