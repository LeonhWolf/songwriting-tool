import { useRef, useEffect } from "react";
import { Collapse as BootstrapCollapse } from "bootstrap";

interface Props {
  doShow: boolean;
  children: React.ReactElement;
}

const Collapse = (props: Props) => {
  const collapseElement = useRef<HTMLDivElement | null>(null);
  const collapseBootstrapInstance = useRef<BootstrapCollapse | null>(null);

  const updateCollapseVisibility = () => {
    if (props.doShow === true) {
      collapseBootstrapInstance.current?.show();
      return;
    }
    if (props.doShow === false) {
      collapseBootstrapInstance.current?.hide();
      return;
    }
  };

  useEffect(() => {
    updateCollapseVisibility();
  }, [props.doShow]);

  useEffect(() => {
    if (collapseElement.current === null)
      return console.error(
        "Collapse could not be instantiated. The HTML element could not be found."
      );

    collapseBootstrapInstance.current = new BootstrapCollapse(
      collapseElement.current,
      { toggle: false }
    );

    updateCollapseVisibility();
  }, []);

  return (
    <div ref={collapseElement} className="collapse">
      {props.children}
    </div>
  );
};

export default Collapse;
