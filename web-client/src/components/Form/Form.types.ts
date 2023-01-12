import { ILabelAndInputProps } from "../LabelAndInput";

type ContentBase = Omit<ILabelAndInputProps, "onValueChange" | "inputType">;
type PasswordContent = ContentBase & {
  inputType: Extract<ILabelAndInputProps["inputType"], "password">;
  doShowIsInsecure: boolean;
};
type DefaultContent = ContentBase & {
  inputType: Extract<ILabelAndInputProps["inputType"], "text" | "email">;
};

type Content = DefaultContent | PasswordContent;

interface IEmitValue extends Pick<ILabelAndInputProps, "inputId"> {
  inputValue: Parameters<ILabelAndInputProps["onValueChange"]>[0];
}

export interface IFormProps {
  contents: Content[];
  doShowValidation: boolean;
  onValidSubmit: (inputs: IEmitValue[]) => void;
  onValidationChange: (isValid: boolean) => void;
}
export type IInputState = Content & {
  value: string;
  isValid: boolean;
  isWeakPassword?: boolean;
};
