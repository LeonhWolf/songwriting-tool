import { ILabelAndInputProps } from "../LabelAndInput";

type Contents = Omit<ILabelAndInputProps, "onValueChange" | "inputType"> & {
  inputType: Extract<
    ILabelAndInputProps["inputType"],
    "text" | "email" | "password"
  >;
};

interface IEmitValue extends Pick<ILabelAndInputProps, "inputId"> {
  inputValue: Parameters<ILabelAndInputProps["onValueChange"]>[0];
}

export interface IFormProps {
  contents: Contents[];
  onValidSubmit: (inputs: IEmitValue[]) => void;
}
export interface IInputState extends Contents {
  value: string;
  isValid: boolean;
  isWeakPassword?: boolean;
}
