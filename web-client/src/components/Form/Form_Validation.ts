import { IInputState } from "./FormTypes";

export const isRequiredValid = (inputState: IInputState): boolean => {
  if (!inputState.isRequired) return true;

  if (!inputState.value) return false;
  if (inputState.value) return true;

  return true;
};
export const isEmailValid = (inputState: IInputState): boolean => {
  if (inputState.inputType !== "email") return true;

  const inputStateValue = inputState.value.split("");

  if (!inputStateValue.includes("@")) return false;
  const isAtSignFirstChar = inputStateValue[0] === "@";
  if (isAtSignFirstChar) return false;

  const hasLessThan2CharsAfterLastDot =
    inputStateValue[inputStateValue.length - 1] === "." ||
    inputStateValue[inputStateValue.length - 2] === ".";
  if (hasLessThan2CharsAfterLastDot) return false;

  return true;
};
export const isPasswordValid = (inputState: IInputState): boolean => {
  if (inputState.inputType !== "password") return true;
  if (inputState.value.length < 8) return false;
  return true;
};
