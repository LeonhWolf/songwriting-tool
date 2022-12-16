import { useEffect, useRef } from "react";
import { Toast as BsToast } from "bootstrap";

import { store } from "../redux/store";
import { removeToast } from "../redux/toastsSlice";

export interface IToastProps {
  id: string;
  bodyText: string;
  severity: "info" | "error";
}

const getToastColorClasses = (severity: IToastProps["severity"]): string => {
  if (severity === "info") return "bg-white";
  if (severity === "error") return "bg-danger text-white";
  return "";
};
const getCloseBtnColorClasses = (severity: IToastProps["severity"]): string => {
  if (severity === "info") return "";
  if (severity === "error") return "btn-close-white";
  return "";
};

export default function Toast(props: IToastProps) {
  const toast = useRef<BsToast>();
  const toastElement = useRef<HTMLElement>();
  const disposeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    toast.current = new BsToast(toastElement.current ?? "", {
      autohide: false,
    });
    toast.current.show();

    if (disposeTimer.current) return;
    disposeTimer.current = setTimeout(() => {
      disposeThisToast();
    }, 5000);

    return () => {
      toast.current?.dispose();
    };
  }, []);

  const disposeThisToast = (): void => {
    if (disposeTimer.current) {
      clearTimeout(disposeTimer.current);
    }
    store.dispatch(removeToast(props.id));
  };

  return (
    <div
      ref={toastElement as React.RefObject<HTMLDivElement>}
      className={`toast ${getToastColorClasses(
        props.severity
      )} d-flex justify-content-between align-items-center`}
    >
      <div className="toast-body">{props.bodyText}</div>
      <button
        type="button"
        className={`btn-close ${getCloseBtnColorClasses(
          props.severity
        )} toast-body`}
        onClick={() => {
          disposeThisToast();
        }}
      ></button>
    </div>
  );
}
