import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";
import { confirmRegistration } from "../services/authenticationService";

export default function ConfirmRegistration() {
  const isRequestPending = useRef<boolean>(false);
  const [isRegistrationConfirmedState, setIsRegistrationConfirmedState] =
    useState<boolean>(false);
  const [isIdInvalidState, setIsIdInvalidState] = useState<boolean>(false);
  const [isUrlInvalidState, setIsUrlInvalidState] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParametersString = document.URL.split("?")[1];
    const queryParameters = new URLSearchParams(queryParametersString);
    const confirmationId = queryParameters.get("id");
    if (!confirmationId) {
      setIsUrlInvalidState(true);
      return;
    }

    if (isRequestPending.current) return;
    isRequestPending.current = true;

    confirmRegistration({ confirmation_id: confirmationId })
      .then((response) => {
        if (response.status === 400) {
          setIsIdInvalidState(true);
          return;
        }
        if (response.status === 500) return;

        setIsRegistrationConfirmedState(true);
        isRequestPending.current = false;

        setTimeout(() => {
          navigate("/");
        }, 5000);
      })
      .catch((error) => {});
  }, []);

  const getBodyText = (): string => {
    if (isUrlInvalidState) return t("confirmRegistration.urlIsInvalid");
    if (isIdInvalidState) return t("confirmRegistration.idIsExpired");
    if (isRegistrationConfirmedState) return t("confirmRegistration.success");
    return t("confirmRegistration.bodyText");
  };

  return (
    <>
      <AuthenticationTitleAndSubtitle
        title={t("confirmRegistration.title")}
        subtitle={t("confirmRegistration.subtitle")}
      >
        <p>{getBodyText()}</p>
      </AuthenticationTitleAndSubtitle>
    </>
  );
}
