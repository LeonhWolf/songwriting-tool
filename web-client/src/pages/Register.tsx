import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import i18n from "../i18n/index";
import AuthenticationTitleAndSubtitle from "../components/AuthenticationTitleAndSubtitle";
import Form from "../components/Form/Form";
import { IFormProps } from "../components/Form/Form.types";
import Button from "../components/Button";
import { registerUser } from "../services/authenticationService";
import { SupportedLanguages } from "../../../api-types/i18n.types";
import { path as registrationPendingPath } from "./RegistrationPending";

export const path = "/register";

const formContents: IFormProps["contents"] = [
  {
    inputId: "firstName",
    labelText: i18n.t("register.firstName.labelText"),
    inputType: "text",
    isRequired: true,
    inputPlaceholder: i18n.t("register.firstName.placeholder"),
    invalidMessage: i18n.t("form.inputMissingMessage", {
      inputTitle: i18n.t("register.firstName.text"),
    }),
  },
  {
    inputId: "lastName",
    labelText: i18n.t("register.lastName.labelText"),
    inputType: "text",
    isRequired: true,
    inputPlaceholder: i18n.t("register.lastName.placeholder"),
    invalidMessage: i18n.t("form.inputMissingMessage", {
      inputTitle: i18n.t("register.lastName.text"),
    }),
  },
  {
    inputId: "email",
    labelText: i18n.t("register.email.labelText"),
    inputType: "email",
    isRequired: true,
    inputPlaceholder: i18n.t("register.email.placeholder"),
    invalidMessage: i18n.t("form.inputMissingMessage", {
      inputTitle: i18n.t("register.email.text"),
    }),
  },
  {
    inputId: "password",
    labelText: i18n.t("register.password.labelText"),
    inputType: "password",
    isRequired: true,
    inputPlaceholder: i18n.t("register.password.placeholder"),
    invalidMessage: `${i18n.t("form.inputMissingMessage", {
      inputTitle: i18n.t("register.password.text"),
    })} (${i18n.t("form.passwordTooShort")})`,
    doShowIsInsecure: true,
  },
];

const getClientLanguage = (): SupportedLanguages => {
  const navigatorLanguage = navigator.language;
  const navigatorLanguageFirstTwoChars = navigatorLanguage.slice(0, 2);
  if (navigatorLanguageFirstTwoChars === "de") return "de";
  return "en";
};

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formState, setFormState] =
    useState<Parameters<IFormProps["onValidSubmit"]>[0]>();
  const [isRegisterPendingState, setIsRegisterPendingState] =
    useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [doValidateForm, setDoValidateForm] = useState<boolean>(false);

  const handleSignUpClick = async () => {
    if (!doValidateForm) setDoValidateForm(true);
    if (!isFormValid) return;
    if (!isRegisterPendingState) setIsRegisterPendingState(true);

    if (!formState) return;
    const firstName = formState[0].inputValue;
    const lastName = formState[1].inputValue;
    const emailAddress = formState[2].inputValue;
    const plainPassword = formState[3].inputValue;
    const clientLanguage = getClientLanguage();

    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email_address: emailAddress,
        plainPassword: plainPassword,
        client_language: clientLanguage,
      });
      setIsRegisterPendingState(false);
      navigate(registrationPendingPath);
    } catch (error) {}
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
        <div className="mt-3 mb-3">
          <Button
            text={t("register.buttonText")}
            isDisabled={false}
            onClick={handleSignUpClick}
          />
        </div>
        <p>
          {t("register.accountAlready")}{" "}
          <Link to="/login">{t("register.logIn")}</Link>
        </p>
      </>
    </AuthenticationTitleAndSubtitle>
  );
};

export default Register;
