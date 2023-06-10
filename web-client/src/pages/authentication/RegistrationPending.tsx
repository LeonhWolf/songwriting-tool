import { useTranslation } from "react-i18next";

import i18n from "../../i18n";
import AuthenticationTemplate from "../../templates/Authentication";

export const name = "registration-pending";

export default function RegistrationPending() {
  const { t } = useTranslation();

  return (
    <AuthenticationTemplate
      title={t("registrationPending.title")}
      subtitle={t("registrationPending.subtitle")}
    >
      <>
        <p className="mb-0">{t("registrationPending.bodyText1")}</p>
        <p>{t("registrationPending.bodyText2")}</p>
      </>
    </AuthenticationTemplate>
  );
}
