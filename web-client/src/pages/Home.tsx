import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "../i18n/index";
import Default from "../templates/Default";
import { paths } from "../navigation/router";

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
        <Link to={paths.dailyExercise.path}>
          {t("home.tiles.dailyExercise")}
        </Link>
        <Link to={paths.archive.path}>{t("home.tiles.archive")}</Link>
      </div>
    </Default>
  );
};

export default Home;
