import { useState } from "react";

import Sidebar from "../components/Sidebar";
import { ReactComponent as HamburgerSVG } from "../assets/SVGs/list.svg";
import Offcanvas from "../components/Offcanvas";
import css from "./Default.module.scss";

type BaseProps = {
  title: string;
  contentPosition: "center" | "left";
  children: React.ReactElement;
};

type SubtitleProps = {
  subtitle: string;
  onSubtitleChange: (newSubtitle: string) => void;
} & BaseProps;
type NoSubtitleProps = {
  subtitle?: undefined;
  onSubtitleChange?: undefined;
} & BaseProps;

export type IProps = NoSubtitleProps | SubtitleProps;

function Default(props: IProps) {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState<boolean>(false);

  return (
    <div id={css["wrapper"]}>
      <div id={css["desktop-sidebar"]} className={css["sidebar"]}>
        <Sidebar />
      </div>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onOpenChange={(isOpenUpdate) => {
          setIsOffcanvasOpen(isOpenUpdate);
        }}
      >
        <div id={css["mobile-sidebar"]} className={css["sidebar"]}>
          <Sidebar />
        </div>
      </Offcanvas>

      <main id={css["main"]}>
        <header id={css["header"]}>
          <div id="title-and-subtitle">
            <h1>{props.title}</h1>
            {props.subtitle && <h5 className="text-muted">{props.subtitle}</h5>}
          </div>
          <button
            id={css["hamburger-button"]}
            onClick={() => {
              setIsOffcanvasOpen(true);
            }}
          >
            <HamburgerSVG />
          </button>
        </header>

        <div
          id="content"
          className={`mt-4 d-flex ${
            props.contentPosition === "center" ? "justify-content-center" : ""
          } ${props.contentPosition === "left" ? "justify-content-start" : ""}`}
        >
          {props.children}
        </div>
      </main>
    </div>
  );
}

export default Default;
