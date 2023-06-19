import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import "../i18n/index";
import Default from "../templates/Default";
import { paths } from "../router";
import css from "./Home.module.scss";
import Breadcrumb from "../components/Breadcrumb";
import { ReactComponent as EditSVG } from "../assets/SVGs/pencil-square.svg";
import { ReactComponent as ArchiveSVG } from "../assets/SVGs/archive.svg";

interface TileNavigationProps {
  text: string;
  link: string;
  SvgElement: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  dataTestId: string;
}
const TileNavigation = (props: TileNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={css["tile-navigation"]}
      onClick={() => {
        navigate(props.link);
      }}
    >
      <div className="d-flex flex-column align-items-center justify-content-between h-100">
        <div data-testid={props.dataTestId}>{props.text}</div>

        <props.SvgElement />
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();

  return (
    <Default title={"Home"} contentPosition="left">
      <div>
        <div
          data-testid={
            process.env.NODE_ENV !== "production"
              ? "home-breadcrumb"
              : undefined
          }
        >
          breadcrumb
        </div>
        {/* TODO */}
        {/* <Breadcrumb/> */}
        <div
          id="tiles-navigation"
          className="d-flex"
          style={{ columnGap: "25px" }}
        >
          <TileNavigation
            text={t("home.tiles.dailyExercise")}
            link={paths.dailyExercise.path}
            SvgElement={EditSVG}
            dataTestId="tile-daily-exercise"
          />
          <TileNavigation
            text={t("home.tiles.archive")}
            link={paths.archive.path}
            SvgElement={ArchiveSVG}
            dataTestId="tile-archive"
          />
        </div>
      </div>
    </Default>
  );
};

export default Home;
