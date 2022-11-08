import React, { useState } from "react";

import LabelAndInput from "../LabelAndInput";
import Button from "../Button";
import {
  isRequiredValid,
  isEmailValid,
  isPasswordValid,
} from "./Form_Validation";

import { IFormProps, IInputState } from "./FormTypes";

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

  const validateInputs = (): void => {
    const updatedInputStates = inputStates.map((inputState) => {
      const isValid =
        isRequiredValid(inputState) &&
        isEmailValid(inputState) &&
        isPasswordValid(inputState);
      return { ...inputState, isValid };
    });
    setInputStates(updatedInputStates);
  };

  const handleSubmit = () => {
    validateInputs();
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
