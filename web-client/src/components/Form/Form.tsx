import React, { useState } from "react";

import LabelAndInput from "../LabelAndInput";
import Button from "../Button";
import {
  isRequiredValid,
  isEmailValid,
  isPasswordValid,
} from "./Form_Validation";

import { IFormProps, IInputState } from "./Form_Types";

export default function Form(props: IFormProps) {
  const initialInputStates = props.contents.map((content) => {
    const inputState: IInputState = {
      ...content,
      inputId: content.inputId,
      value: "",
      isValid: true,
    };
    return inputState;
  });

  const [inputStates, setInputStates] =
    useState<IInputState[]>(initialInputStates);

  const handleOnValueChange = (updatedValue: string, inputId: string) => {
    const updatedInputStates = inputStates.map((inputValue) => {
      if (inputValue.inputId === inputId) {
        return { ...inputValue, value: updatedValue };
      }
      return inputValue;
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
