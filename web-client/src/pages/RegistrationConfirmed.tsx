import { useTranslation } from "react-i18next";

import "../i18n/index";
import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";

export default function RegistrationConfirmed() {
  const { t } = useTranslation();

  return (
    <AuthenticationTitleAndSubtitle
      title={t("registrationConfirmed.title")}
      subtitle={t("registrationConfirmed.subtitle")}
    >
      <>
        <p className="text-center mb-0">
          {t("registrationConfirmed.bodyText1")}
        </p>
        <p className="text-center">{t("registrationConfirmed.bodyText2")}</p>
      </>
    </AuthenticationTitleAndSubtitle>
  );
}
