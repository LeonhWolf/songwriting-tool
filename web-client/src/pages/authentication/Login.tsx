import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthenticationTemplate from "../../templates/Authentication";
import Form from "../../components/Form/Form";
import { IFormProps } from "../../components/Form/Form.types";
import i18n from "../../i18n";
import { loginUser } from "../../services/authenticationService";
import { paths } from "../../navigation/router";

export const name = "login";

const formContents: IFormProps["contents"] = [
  {
    inputId: "email",
    labelText: i18n.t("login.email.labelText"),
    inputType: "email",
    isRequired: true,
    inputPlaceholder: i18n.t("login.email.placeholder") ?? "",
    invalidMessage:
      i18n.t("form.inputMissingMessage", {
        inputTitle: i18n.t("login.email.text"),
      }) ?? "",
  },
  {
    inputId: "password",
    labelText: i18n.t("login.password.labelText"),
    inputType: "password",
    isRequired: true,
    inputPlaceholder: i18n.t("login.password.placeholder") ?? "",
    invalidMessage:
      i18n.t("form.inputMissingMessage", {
        inputTitle: i18n.t("login.password.text"),
      }) ?? "",
    doShowIsInsecure: false,
  },
];

export default function Login() {
  const { t } = useTranslation();

  const [isFormValidState, setIsFormValidState] = useState<boolean>(false);
  const [doShowValidationState, setDoShowValidationState] =
    useState<boolean>(false);
  const [formDataState, setFormDataState] =
    useState<Parameters<IFormProps["onValidSubmit"]>[0]>();
  const [areCredentialsWrongState, setAreCredentialsWrongState] =
    useState<boolean>(false);

  const handleLoginClick = (): void => {
    if (!isFormValidState) return;

    const emailAddress = formDataState?.find(
      (formInput) => formInput.inputId === formContents[0].inputId
    )?.inputValue;
    const password = formDataState?.find(
      (formInput) => formInput.inputId === formContents[1].inputId
    )?.inputValue;

    if (!emailAddress || !password)
      return console.error(
        "Login request cannot be sent. 'emailAddress' or 'password' input value is undefined."
      );
    loginUser(emailAddress, password)
      .then((response) => {
        if (response.status !== 400 && areCredentialsWrongState)
          setAreCredentialsWrongState(false);

        if (response.status === 400) setAreCredentialsWrongState(true);
      })
      .catch((error) => {
        console.error(`User could not be logged in: ${error}`);
      });
  };

  return (
    <AuthenticationTemplate
      title={t("login.title")}
      subtitle={t("login.subtitle")}
    >
      <div id="wrapper" className="w-100">
        {areCredentialsWrongState && (
          <p id="wrong-credentials" className="text-danger w-100">
            {t("login.wrongCredentials")}
          </p>
        )}

        <Form
          contents={formContents}
          doShowValidation={doShowValidationState}
          onValidSubmit={(validFormState) => {
            setFormDataState(validFormState);
          }}
          onValidationChange={(isValid) => {
            setIsFormValidState(isValid);
          }}
        />
        <button
          id="login-button"
          className="btn btn-primary w-100 mt-3"
          onClick={() => {
            setDoShowValidationState(!doShowValidationState);
            handleLoginClick();
          }}
        >
          {t("login.loginButtonText")}
        </button>

        <div
          id="forgot-password-and-sign-up"
          className="d-flex flex-column align-items-start mt-3"
        >
          <a href="">{t("login.forgotPasswordText")}</a>

          <div
            id="sign-up-text-and-link"
            className="d-flex justify-content-start"
          >
            <p className="text-muted me-2 mb-0">{t("login.noAccountText")}</p>
            <Link to={paths.register.path}>{t("login.signUpText")}</Link>
          </div>
        </div>
      </div>
    </AuthenticationTemplate>
  );
}
