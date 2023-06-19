import { useEffect, useRef } from "react";
import { Offcanvas as OffcanvasBootstrap } from "bootstrap";

interface Props {
  isOpen: boolean;
  children: React.ReactElement;
  onOpenChange: (isOpenUpdate: boolean) => void;
}

const Offcanvas = (props: Props) => {
  const element = useRef<HTMLDivElement | null>(null);
  const bootstrapOffcanvas = useRef<OffcanvasBootstrap | null>(null);
  const isOpen = useRef<boolean>(false);

  const handleOffcanvasHidden = () => {
    isOpen.current = false;
    props.onOpenChange(false);
  };
  const handleOffcanvasShown = () => {
    isOpen.current = true;
    props.onOpenChange(true);
  };

  const updateIsOpen = () => {
    if (props.isOpen === true && isOpen.current === false) {
      bootstrapOffcanvas.current?.show();
      return;
    }
    if (props.isOpen === false && isOpen.current === true) {
      bootstrapOffcanvas.current?.hide();
      return;
    }
  };

  useEffect(() => {
    if (element.current === null)
      return console.error(
        "Offcanvas could not be instantiated. The HTML element is 'null'."
      );
    bootstrapOffcanvas.current = new OffcanvasBootstrap(element.current);

    element.current.addEventListener(
      "hidden.bs.offcanvas",
      handleOffcanvasHidden
    );
    element.current.addEventListener(
      "shown.bs.offcanvas",
      handleOffcanvasShown
    );

    updateIsOpen();

    const elementCopy = element.current;
    return () => {
      elementCopy?.removeEventListener(
        "hidden.bs.offcanvas",
        handleOffcanvasHidden
      );
      elementCopy?.removeEventListener(
        "shown.bs.offcanvas",
        handleOffcanvasShown
      );
    };
  }, []);

  useEffect(() => {
    updateIsOpen();
  }, [props.isOpen]);

  return (
    <div
      ref={element}
      className="offcanvas offcanvas-start"
      style={{ width: "fit-content" }}
    >
      {props.children}
    </div>
  );
};

export default Offcanvas;
