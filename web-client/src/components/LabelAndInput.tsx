import React, { HTMLInputTypeAttribute } from "react";

export interface ILabelAndInputProps {
  inputId: string;
  labelText: string;
  inputType: HTMLInputTypeAttribute;
  inputPlaceholder?: string;
  isRequired?: boolean;
  invalidMessage?: string;
}

const LabelAndInput = (props: ILabelAndInputProps) => {
  return (
    <div>
      <label htmlFor={props.inputId} className="form-label">
        {props.labelText}
        {props.isRequired && <p className="text-danger d-inline">&nbsp;*</p>}
      </label>
      <input
        type={props.inputType}
        id={props.inputId}
        className={`form-control ${!!props.invalidMessage ? "is-invalid" : ""}`}
        placeholder={props.inputPlaceholder}
      />
      {props.invalidMessage && (
        <div className="invalid-feedback">{props.invalidMessage}</div>
      )}
    </div>
  );
};

export default LabelAndInput;
