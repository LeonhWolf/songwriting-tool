import { useState } from "react";
import { useTranslation } from "react-i18next";

import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";
import Form from "../components/Form/Form";
import { IFormProps } from "../components/Form/Form.types";
import i18n from "../i18n/index";

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
  const [doShowValidationState, setDoShowValidationState] =
    useState<boolean>(false);

  return (
    <AuthenticationTitleAndSubtitle
      title={t("login.title")}
      subtitle={t("login.subtitle")}
    >
      <div>
        <Form
          contents={formContents}
          doShowValidation={doShowValidationState}
          onValidSubmit={() => {}}
          onValidationChange={() => {}}
        />
        <button
          className="btn btn-primary w-100"
          onClick={() => {
            setDoShowValidationState(!doShowValidationState);
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
        <div className="d-flex justify-content-center">
          <p className="text-muted">{t("login.noAccountText")}</p>
          <a href="">{t("login.signUpText")}</a>
        </div>
      </div>
    </AuthenticationTitleAndSubtitle>
  );
}
