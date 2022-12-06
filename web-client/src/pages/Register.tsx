import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import i18n from "../i18n/index";
import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";
import Form from "../components/Form/Form";
import { IFormProps } from "../components/Form/Form.types";
import Button from "../components/Button";
import { registerUser } from "../services/authenticationService";
import { SupportedLanguages } from "../../../api-types/i18n.types";

const formContents: IFormProps["contents"] = [
  {
    inputId: "firstName",
    labelText: i18n.t("register.firstName.labelText"),
    inputType: "text",
    isRequired: true,
    inputPlaceholder: i18n.t("register.firstName.placeholder"),
  },
  {
    inputId: "lastName",
    labelText: i18n.t("register.lastName.labelText"),
    inputType: "text",
    isRequired: true,
    inputPlaceholder: i18n.t("register.lastName.placeholder"),
  },
  {
    inputId: "email",
    labelText: i18n.t("register.email.labelText"),
    inputType: "email",
    isRequired: true,
    inputPlaceholder: i18n.t("register.email.placeholder"),
  },
  {
    inputId: "password",
    labelText: i18n.t("register.password.labelText"),
    inputType: "password",
    isRequired: true,
    inputPlaceholder: i18n.t("register.password.placeholder"),
  },
];

const getClientLanguage = (): SupportedLanguages => {
  const navigatorLanguage = navigator.language;
  const navigatorLanguageFirstTwoChars = navigatorLanguage.slice(0, 2);
  if (navigatorLanguageFirstTwoChars === "de") return "de";
  return "en";
};

const Register = (props: any) => {
  const { t, i18n } = useTranslation();
  const [formState, setFormState] =
    useState<Parameters<IFormProps["onValidSubmit"]>[0]>();
  const [isRegisterPendingState, setIsRegisterPendingState] =
    useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [doValidateForm, setDoValidateForm] = useState<boolean>(false);

  const handleSignUpClick = () => {
    if (!doValidateForm) setDoValidateForm(true);
    if (!isFormValid) return;
    if (!isRegisterPendingState) setIsRegisterPendingState(true);

    if (!formState) return;
    const firstName = formState[0].inputValue;
    const lastName = formState[1].inputValue;
    const emailAddress = formState[2].inputValue;
    const plainPassword = formState[3].inputValue;
    const clientLanguage = getClientLanguage();

    registerUser({
      first_name: firstName,
      last_name: lastName,
      email_address: emailAddress,
      plainPassword: plainPassword,
      client_language: clientLanguage,
    }).then(() => {
      setIsRegisterPendingState(false);
    });
  };

  return (
    <AuthenticationTitleAndSubtitle
      title={t("register.title")}
      subtitle={t("register.subtitle")}
    >
      <>
        <Form
          contents={formContents}
          onValidSubmit={(validFormState) => {
            setFormState(validFormState);
          }}
          doShowValidation={doValidateForm}
          onValidationChange={(isValid) => {
            setIsFormValid(isValid);
          }}
        />
        <Button text={t("register.buttonText")} onClick={handleSignUpClick} />
        <p>
          {t("register.accountAlready")}{" "}
          <Link to="/login">{t("register.logIn")}</Link>
        </p>
      </>
    </AuthenticationTitleAndSubtitle>
  );
};

export default Register;
