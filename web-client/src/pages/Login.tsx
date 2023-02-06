import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";
import Form from "../components/Form/Form";
import { IFormProps } from "../components/Form/Form.types";
import i18n from "../i18n/index";
import { loginUser } from "../services/authenticationService";
import { path as registrationPath } from "./Register";

const formContents: IFormProps["contents"] = [
  {
    inputId: "email",
    labelText: i18n.t("login.email.labelText"),
    inputType: "email",
    isRequired: true,
    inputPlaceholder: i18n.t("login.email.placeholder"),
    invalidMessage: i18n.t("form.inputMissingMessage", {
      inputTitle: i18n.t("login.email.text"),
    }),
  },
  {
    inputId: "password",
    labelText: i18n.t("login.password.labelText"),
    inputType: "password",
    isRequired: true,
    inputPlaceholder: i18n.t("login.password.placeholder"),
    invalidMessage: i18n.t("form.inputMissingMessage", {
      inputTitle: i18n.t("login.password.text"),
    }),
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
      .then()
      .catch((error) => {
        console.error(`User could not be logged in: ${error}`);
      });
  };

  return (
    <AuthenticationTitleAndSubtitle
      title={t("login.title")}
      subtitle={t("login.subtitle")}
    >
      <div>
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
          className="btn btn-primary w-100"
          onClick={() => {
            setDoShowValidationState(!doShowValidationState);
            handleLoginClick();
          }}
        >
          {t("login.loginButtonText")}
        </button>
        <div className="d-flex justify-content-center">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" />
            <label className="form-check-label">
              {t("login.rememberMeText")}
            </label>
          </div>
          <a href="">{t("login.forgotPasswordText")}</a>
        </div>
        <div className="d-flex justify-content-start">
          <p className="text-muted me-2">{t("login.noAccountText")}</p>
          <Link to={registrationPath}>{t("login.signUpText")}</Link>
        </div>
      </div>
    </AuthenticationTitleAndSubtitle>
  );
}
