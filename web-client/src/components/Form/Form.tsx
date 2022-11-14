import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import "../../i18n";
import Popover from "../Popover";
import LabelAndInput from "../LabelAndInput";
import Button from "../Button";
import {
  isRequiredValid,
  isEmailValid,
  isPasswordValid,
} from "./Form_Validation";

import { IFormProps, IInputState } from "./Form_Types";

const mostCommonPasswordsTxtFile = require("../../assets/200-most-common-passwords.txt");

export default function Form(props: IFormProps) {
  const { t, i18n } = useTranslation();
  const [weakPasswords, setWeakPasswords] = useState<string[]>();
  const [inputStates, setInputStates] = useState<IInputState[]>(
    props.contents.map((content) => {
      const inputState: IInputState = {
        ...content,
        inputId: content.inputId,
        value: "",
        isValid: true,
      };
      return inputState;
    })
  );

  useEffect(() => {
    fetch(mostCommonPasswordsTxtFile)
      .then((result) => result.text())
      .then((textResult) => {
        const passwords = JSON.parse(textResult);
        setWeakPasswords(passwords);
      });
  }, []);

  const isWeakPassword = (password: string): boolean => {
    if (!weakPasswords) return false;
    if (weakPasswords.includes(password)) return true;
    return false;
  };

  const handleOnValueChange = (updatedValue: string, inputId: string) => {
    const updatedInputStates = inputStates.map((inputValue) => {
      let updatedInputState = inputValue;
      if (inputValue.inputId !== inputId) return inputValue;
      if (inputValue.inputId === inputId) {
        updatedInputState = { ...inputValue, value: updatedValue };
      }
      if (inputValue.inputType === "password") {
      }
      return updatedInputState;
    });

    setInputStates(updatedInputStates);
  };

  const validateInputs = (): boolean => {
    let areAllInputsValid = true;

    const updatedInputStates = inputStates.map((inputState) => {
      const isValid =
        isRequiredValid(inputState) &&
        isEmailValid(inputState) &&
        isPasswordValid(inputState);

      if (!isValid) areAllInputsValid = false;
      return { ...inputState, isValid };
    });
    setInputStates(updatedInputStates);

    return areAllInputsValid;
  };

  const handleSubmit = () => {
    const areAllInputsValid = validateInputs();
    if (!areAllInputsValid) return;

    const idsAndInputValues = inputStates.map((inputState) => {
      return { inputId: inputState.inputId, inputValue: inputState.value };
    });
    props.onValidSubmit(idsAndInputValues);
  };

  return (
    <form className="d-flex flex-column" style={{ rowGap: "10px" }}>
      {inputStates.map((inputState) => {
        if (inputState.inputType === "password") {
          return (
            <Popover
              key={inputState.inputId}
              doShow={isWeakPassword(inputState.value)}
              content={t("form.weakPassword")}
              targetComponent={
                <LabelAndInput
                  inputId={inputState.inputId}
                  labelText={inputState.labelText}
                  inputType={inputState.inputType}
                  inputPlaceholder={inputState.inputPlaceholder}
                  isRequired={inputState.isRequired}
                  invalidMessage={
                    inputState.isValid ? undefined : inputState.invalidMessage
                  }
                  onValueChange={handleOnValueChange}
                />
              }
            />
          );
        }
        return (
          <LabelAndInput
            key={inputState.inputId}
            inputId={inputState.inputId}
            labelText={inputState.labelText}
            inputType={inputState.inputType}
            inputPlaceholder={inputState.inputPlaceholder}
            isRequired={inputState.isRequired}
            invalidMessage={
              inputState.isValid ? undefined : inputState.invalidMessage
            }
            onValueChange={handleOnValueChange}
          />
        );
      })}
      <Button text="submit" onClick={handleSubmit} />
    </form>
  );
}
