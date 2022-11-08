import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "../i18n/index";
import LabelAndInput from "../components/LabelAndInput";
import { ILabelAndInputProps } from "../components/LabelAndInput";
import Button from "../components/Button";

type IInputTexts = Pick<
  ILabelAndInputProps,
  "inputId" | "labelText" | "inputPlaceholder" | "invalidMessage"
>;

const getTranslationStrings = (key: string, t: Function): IInputTexts => {
  const labelTextTranslation = t(`register.${key}.labelText`);
  return {
    inputId: labelTextTranslation,
    labelText: labelTextTranslation,
    inputPlaceholder: t(`register.${key}.placeholder`),
    invalidMessage: t("inputMissingMessage", {
      inputTitle: labelTextTranslation,
    }),
  };
};

const Register = (props: any) => {
  const { t, i18n } = useTranslation();
  const inputContents: ILabelAndInputProps[] = [
    // {
    //   ...getTranslationStrings("firstName", t),
    //   inputType: "text",
    //   isRequired: true,
    // },
    // {
    //   ...getTranslationStrings("lastName", t),
    //   inputType: "text",
    //   isRequired: true,
    // },
    // {
    //   ...getTranslationStrings("email", t),
    //   inputType: "text",
    //   isRequired: true,
    // },
    // {
    //   ...getTranslationStrings("password", t),
    //   inputType: "password",
    //   isRequired: true,
    // },
  ];

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center h-100">
      <h2 className="mb-2">{t("register.title")}</h2>
      <p className="text-muted mb-5">{t("register.subtitle")}</p>

      <div style={{ maxWidth: "350px", width: "350px" }}>
        <div
          id="inputs"
          className="d-flex flex-column mb-3"
          style={{ rowGap: "10px" }}
        >
          {/* {inputContents.map((inputContent) => {
            return (
              <LabelAndInput
                key={inputContent.labelText}
                inputId={inputContent.labelText}
                labelText={inputContent.labelText}
                inputType={inputContent.inputType}
                inputPlaceholder={inputContent.inputPlaceholder}
                isRequired={inputContent.isRequired}
                invalidMessage={inputContent.invalidMessage}
              />
            );
          })} */}
        </div>
        <div className="d-grid w-100 mb-4">
          {/* <Button
            text={t("register.buttonText")}
            clicked={() => {
              console.log("hi");
            }}
          /> */}
        </div>
        <div
          id="already-account"
          className="d-flex flex-row align-items-center justify-content-center"
        >
          <p className="m-0 text-muted">{t("register.accountAlready")}&nbsp;</p>
          <Link to="/login">{t("register.logIn")}</Link>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {};

export default Register;
