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
    popover.current = new BsPopover(popoverElement.current ?? "", {
      content: props.content,
      trigger: "manual",
    });

    return function cleanup() {
      popover.current?.dispose();
    };
  }, []);

  useEffect(() => {
    togglePopover();
  }, [props.doShow]);

  return (
    <div ref={popoverElement as React.RefObject<HTMLDivElement>}>
      {props.targetComponent}
    </div>
  );
}
