import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LabelAndInput from "./LabelAndInput";

describe("Label:", () => {
  it("Should render the defined label.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel"}
        inputId={"test"}
        inputType="text"
      />
    );
    const inputElement = screen.getByLabelText("testLabel");
    expect(inputElement).toBeDefined();
  });
  it("Should render the proper 'for' attribute.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel"}
        inputId={"testId"}
        inputType="text"
      />
    );
    const inputElement = screen.getByLabelText("testLabel");
    expect(inputElement).toBeDefined();
  });
  it("Should render '*' when required.", async () => {
    render(
      <LabelAndInput
        labelText={"testLabel3"}
        inputId={"testId"}
        inputType="date"
        isRequired={true}
      />
    );
    const labelElement = await screen.findByText("testLabel3");
    // char code 160 is &nbsp;
    expect(labelElement.textContent).toBe(
      `testLabel3${String.fromCharCode(160)}*`
    );
  });
  it("Should not render '*' when not required.", async () => {
    render(
      <LabelAndInput
        labelText={"testLabel3"}
        inputId={"testId"}
        inputType="date"
        isRequired={false}
      />
    );
    const labelElement = await screen.findByText("testLabel3");
    expect(labelElement.textContent).toBe("testLabel3");
  });
});

describe("Input:", () => {
  it("Should render the placeholder:", () => {
    render(
      <LabelAndInput
        labelText={"testLabel"}
        inputId={"test"}
        inputType="text"
        inputPlaceholder="testPlaceholder"
      />
    );
    const inputElement = screen.getByPlaceholderText("testPlaceholder");
    expect(inputElement).toBeDefined();
  });
  it("Should render proper id.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel1"}
        inputId={"testId"}
        inputType="text"
      />
    );
    const inputElement = screen.getByLabelText("testLabel1");
    expect(inputElement.id).toBe("testId");
  });
  it("Should render proper input type.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel2"}
        inputId={"testId"}
        inputType="date"
      />
    );
    const inputElement = screen.getByLabelText("testLabel2");
    expect(inputElement.getAttribute("type")).toBe("date");
  });
});

describe("Invalid Message:", () => {
  describe("Render invalid message:", () => {
    it("Should render invalid div.", () => {
      render(
        <LabelAndInput
          labelText={"testLabel2"}
          inputId={"testId"}
          inputType="text"
          invalidMessage="testMessage"
        />
      );
      const invalidElement = screen.getByText("testMessage");
      expect(invalidElement.textContent).toBe("testMessage");
    });
  });
  it("Should add '.is-invalid' to input.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel2"}
        inputId={"testId"}
        inputType="text"
        invalidMessage="testMessage"
      />
    );
    const invalidElement = screen.getByLabelText("testLabel2");
    expect(invalidElement.classList).toContain("is-invalid");
  });
  describe("Don't render invalid message:", () => {});
  it("Should not render invalid div.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel2"}
        inputId={"testId"}
        inputType="text"
      />
    );
    expect(screen.queryByText("testMessage")).not.toBeInTheDocument();
  });
  it("Should not add '.is-invalid' to input.", () => {
    render(
      <LabelAndInput
        labelText={"testLabel2"}
        inputId={"testId"}
        inputType="text"
      />
    );
    const invalidElement = screen.getByLabelText("testLabel2");
    expect(invalidElement.classList).not.toContain("is-invalid");
  });
});
