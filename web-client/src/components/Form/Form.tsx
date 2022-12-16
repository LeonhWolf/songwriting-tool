import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import "../../i18n";
import Popover from "../Popover";
import LabelAndInput from "../LabelAndInput";
import {
  isRequiredValid,
  isEmailValid,
  isPasswordValid,
} from "./Form_Validation";

import { IFormProps, IInputState } from "./Form.types";

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
        isValid: !!!content.isRequired,
      };
      return inputState;
    })
  );
  const [isFormValidState, setIsFormValidState] = useState<boolean>(false);

  useEffect(() => {
    fetch(mostCommonPasswordsTxtFile)
      .then((result) => result.text())
      .then((textResult) => {
        const passwords = JSON.parse(textResult);
        setWeakPasswords(passwords);
      })
      .catch((error) => {
        console.error(
          "File '200-most-common-passwords.txt' could not be loaded.",
          error
        );
      });
  }, []);
  useEffect(() => {
    if (props.doShowValidation) handleValidateStateChange();
  }, [props.doShowValidation]);
  useEffect(() => {
    handleValidateStateChange();
  }, [inputStates]);

  const isWeakPassword = (password: string): boolean => {
    if (!weakPasswords) return false;
    if (weakPasswords.includes(password)) return true;
    return false;
  };

  const getUpdatedValueAndIsValid = (
    updatedValue: string,
    inputId: string
  ): typeof inputStates => {
    const updatedInputStates = inputStates.map((inputState) => {
      if (inputState.inputId !== inputId) return inputState;

      const updatedInputState = { ...inputState, value: updatedValue };
      const isValid =
        isRequiredValid(updatedInputState) &&
        isEmailValid(updatedInputState) &&
        isPasswordValid(updatedInputState);
      updatedInputState["isValid"] = isValid;

      return updatedInputState;
    });

    return updatedInputStates;
  };

  const handleOnValueChange = (updatedValue: string, inputId: string) => {
    const updatedInputStates = getUpdatedValueAndIsValid(updatedValue, inputId);

    setInputStates(updatedInputStates);
  };

  const areInputsValid = (): boolean => {
    let areAllInputsValid = true;
    inputStates.forEach((inputState) => {
      if (!inputState.isValid) areAllInputsValid = false;
    });

    return areAllInputsValid;
  };

  const getOnlyIdsAndInputValues = (): Parameters<
    typeof props.onValidSubmit
  >[0] => {
    const idsAndInputValues = inputStates.map((inputState) => {
      return { inputId: inputState.inputId, inputValue: inputState.value };
    });

    return idsAndInputValues;
  };

  const handleValidateStateChange = () => {
    const areAllInputsValid = areInputsValid();

    if (isFormValidState !== areAllInputsValid) {
      props.onValidationChange(areAllInputsValid);
      setIsFormValidState(areAllInputsValid);
    }

    if (!areAllInputsValid) return;

    const idsAndInputValues = getOnlyIdsAndInputValues();
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
                    inputState.isValid || !props.doShowValidation
                      ? undefined
                      : inputState.invalidMessage
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
              inputState.isValid || !props.doShowValidation
                ? undefined
                : inputState.invalidMessage
            }
            onValueChange={handleOnValueChange}
          />
        );
      })}
    </form>
  );
}
