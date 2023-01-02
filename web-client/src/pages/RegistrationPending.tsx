import { useTranslation } from "react-i18next";

import "../i18n/index";
import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";

export const path = "/registration-pending";

export default function RegistrationPending() {
  const { t } = useTranslation();

  return (
    <AuthenticationTitleAndSubtitle
      title={t("registrationPending.title")}
      subtitle={t("registrationPending.subtitle")}
    >
      <>
        <p className="mb-0">{t("registrationPending.bodyText1")}</p>
        <p>{t("registrationPending.bodyText2")}</p>
      </>
    </AuthenticationTitleAndSubtitle>
  );
}
