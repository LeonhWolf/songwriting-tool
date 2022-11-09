import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import Form from "./Form";
import { IFormProps } from "./Form_Types";
import LabelAndInput from "../LabelAndInput";

const setInputValue = (
  placeholderText: string,
  value: string
): HTMLInputElement => {
  const inputElement = screen.getByPlaceholderText(
    placeholderText
  ) as HTMLInputElement;
  fireEvent.change(inputElement, {
    target: { value },
  });
  expect(inputElement.value).toBe(value);
  return inputElement;
};

const clickSubmitButton = async (): Promise<void> => {
  await act(async () => {
    const submitButton = await screen.findByText("submit");
    await submitButton.click();
  });
};

describe.skip("Passing props to label & input", () => {
  const onValidSubmitMock = jest.fn();
  const formContents: IFormProps["contents"] = [
    {
      inputId: "testId",
      labelText: "testLabel",
      inputType: "text",
      inputPlaceholder: "placeholder",
      isRequired: true,
      invalidMessage: "invalid",
    },
    {
      inputId: "testId2",
      labelText: "testLabel2",
      inputType: "password",
      inputPlaceholder: "placeholder2",
      isRequired: false,
      invalidMessage: "invalid2",
    },
  ];
  describe("LabelAndInput1:", () => {
    it("Should pass 'inputId'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].inputId
      ).toBe("testId");
    });
    it("Should pass 'labelText'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].labelText
      ).toBe("testLabel");
    });
    it("Should pass 'inputType'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].inputType
      ).toBe("text");
    });
    it("Should pass 'inputPlaceholder'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].inputPlaceholder
      ).toBe("placeholder");
    });
    it("Should pass 'isRequired'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].isRequired
      ).toBe(true);
    });
    it("Should pass 'invalidMessage'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[0][0].invalidMessage
      ).toBe("invalid");
    });
  });
  describe("LabelAndInput2:", () => {
    it("Should pass 'inputId'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].inputId
      ).toBe("testId2");
    });
    it("Should pass 'labelText'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].labelText
      ).toBe("testLabel2");
    });
    it("Should pass 'inputType'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].inputType
      ).toBe("date");
    });
    it("Should pass 'inputPlaceholder'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].inputPlaceholder
      ).toBe("placeholder2");
    });
    it("Should pass 'isRequired'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].isRequired
      ).toBe(false);
    });
    it("Should pass 'invalidMessage'.", () => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
      expect(
        (LabelAndInput as jest.MockedFunction<typeof LabelAndInput>).mock
          .calls[1][0].invalidMessage
      ).toBe("invalid2");
    });
  });
});

describe("Form validation:", () => {
  it("Should not invalidate inputs without onSubmit.", async () => {
    const formContents: IFormProps["contents"] = [
      {
        inputId: "testId",
        labelText: "testLabel",
        inputType: "text",
        inputPlaceholder: "placeholder",
        isRequired: true,
        invalidMessage: "invalidTestMessage",
      },
      {
        inputId: "testId2",
        labelText: "testLabel2",
        inputType: "text",
        inputPlaceholder: "placeholder2",
        isRequired: false,
        invalidMessage: "invalidTestMessage2",
      },
    ];

    render(<Form contents={formContents} onValidSubmit={() => {}} />);

    setInputValue("placeholder", "test");
    setInputValue("placeholder2", "test2");

    expect(screen.queryByText("invalidTestMessage")).toBe(null);
    expect(screen.queryByText("invalidTestMessage2")).toBe(null);
  });
  describe("'required':", () => {
    const formContents: IFormProps["contents"] = [
      {
        inputId: "testId",
        labelText: "testLabel",
        inputType: "text",
        inputPlaceholder: "placeholder",
        isRequired: true,
        invalidMessage: "invalidTestMessage",
      },
      {
        inputId: "testId2",
        labelText: "testLabel2",
        inputType: "text",
        inputPlaceholder: "placeholder2",
        isRequired: false,
        invalidMessage: "invalidTestMessage2",
      },
    ];
    it("Should invalidate input when required & empty.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      expect(screen.queryByText("invalidTestMessage")).toBe(null);

      await clickSubmitButton();
      expect(screen.getByText("invalidTestMessage")).toBeDefined();
    });
    it("Should validate when required & filled (after invalidated).", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      expect(screen.queryByText("invalidTestMessage")).toBe(null);
      const inputElement = await screen.findByPlaceholderText("placeholder");

      // invalidate first
      await clickSubmitButton();
      expect(screen.getByText("invalidTestMessage")).toBeDefined();

      fireEvent.change(inputElement, { target: { value: "test" } });
      expect((inputElement as HTMLInputElement).value).toBe("test");

      await clickSubmitButton();
      expect(screen.queryByText("invalidTestMessage")).toBeNull();
    });
    it("Should not emit 'onValidSubmit' when any input is invalid.", async () => {
      const onValidSubmitMock = jest.fn();

      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );

      await clickSubmitButton();
      expect(onValidSubmitMock).not.toHaveBeenCalled();
    });
  });
  describe("Email:", () => {
    const formContents: IFormProps["contents"] = [
      {
        inputId: "testId",
        labelText: "testLabel",
        inputType: "text",
        inputPlaceholder: "placeholder",
        isRequired: false,
        invalidMessage: "invalidTestMessage",
      },
      {
        inputId: "emailId",
        labelText: "emailLabel",
        inputType: "email",
        inputPlaceholder: "emailPlaceholder",
        isRequired: false,
        invalidMessage: "invalidEmail",
      },
    ];
    it("Should invalidate without '@'.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      setInputValue("emailPlaceholder", "test");

      await clickSubmitButton();
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate with 0 chars before '@'.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      setInputValue("emailPlaceholder", "@test.de");

      await clickSubmitButton();
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate if <2 chars after last '.'.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      setInputValue("emailPlaceholder", "test@test.d");

      await clickSubmitButton();
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should validate with preceding conditions true.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      setInputValue("emailPlaceholder", "test@test.de");

      await clickSubmitButton();
      expect(screen.queryByText("invalidEmail")).toBeNull();
    });
  });
  describe("Password:", () => {
    it("Should invalidate when length < 8.", async () => {
      const formContents: IFormProps["contents"] = [
        {
          inputId: "textId",
          labelText: "textLabel",
          inputType: "text",
          inputPlaceholder: "textPlaceholder",
          isRequired: false,
          invalidMessage: "textInvalid",
        },
        {
          inputId: "emailId",
          labelText: "emailLabel",
          inputType: "email",
          inputPlaceholder: "emailPlaceholder",
          isRequired: false,
          invalidMessage: "invalidEmail",
        },
        {
          inputId: "passwordId",
          labelText: "passwordLabel",
          inputType: "password",
          inputPlaceholder: "passwordPlaceholder",
          isRequired: true,
          invalidMessage: "passwordInvalid",
        },
      ];

      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      setInputValue("passwordPlaceholder", "1234567");
      expect(screen.queryByText("passwordInvalid")).toBeNull();

      await clickSubmitButton();
      expect(screen.getByText("passwordInvalid")).toBeDefined();
    });
    it("Should validate when length >= 8.", async () => {
      const formContents: IFormProps["contents"] = [
        {
          inputId: "textId",
          labelText: "textLabel",
          inputType: "text",
          inputPlaceholder: "textPlaceholder",
          isRequired: false,
          invalidMessage: "textInvalid",
        },
        {
          inputId: "emailId",
          labelText: "emailLabel",
          inputType: "email",
          inputPlaceholder: "emailPlaceholder",
          isRequired: false,
          invalidMessage: "invalidEmail",
        },
        {
          inputId: "passwordId",
          labelText: "passwordLabel",
          inputType: "password",
          inputPlaceholder: "passwordPlaceholder",
          isRequired: true,
          invalidMessage: "passwordInvalid",
        },
      ];

      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      setInputValue("passwordPlaceholder", "12345678");
      expect(screen.queryByText("passwordInvalid")).toBeNull();

      await clickSubmitButton();
      expect(screen.queryByText("passwordInvalid")).toBeNull();
    });
  });
  it("Should not emit 'onValidSubmit' with invalid inputs even if not required.", async () => {
    const onValidSubmitMock = jest.fn();
    const formContents: IFormProps["contents"] = [
      {
        inputId: "textId",
        labelText: "textLabel",
        inputType: "text",
        inputPlaceholder: "textPlaceholder",
        isRequired: false,
        invalidMessage: "textInvalid",
      },
      {
        inputId: "emailId",
        labelText: "emailLabel",
        inputType: "email",
        inputPlaceholder: "emailPlaceholder",
        isRequired: false,
        invalidMessage: "invalidEmail",
      },
      {
        inputId: "passwordId",
        labelText: "passwordLabel",
        inputType: "password",
        inputPlaceholder: "passwordPlaceholder",
        isRequired: false,
        invalidMessage: "passwordInvalid",
      },
    ];

    render(<Form contents={formContents} onValidSubmit={onValidSubmitMock} />);

    setInputValue("emailPlaceholder", "ab");
    setInputValue("passwordPlaceholder", "1234567");

    await clickSubmitButton();

    expect(onValidSubmitMock).not.toHaveBeenCalled();
  });
  it("Should emit 'onValidSubmit' when all inputs are valid.", async () => {
    const onValidSubmitMock = jest.fn();
    const formContents: IFormProps["contents"] = [
      {
        inputId: "textId",
        labelText: "textLabel",
        inputType: "text",
        inputPlaceholder: "textPlaceholder",
        isRequired: true,
        invalidMessage: "textInvalid",
      },
      {
        inputId: "emailId",
        labelText: "emailLabel",
        inputType: "email",
        inputPlaceholder: "emailPlaceholder",
        isRequired: false,
        invalidMessage: "invalidEmail",
      },
      {
        inputId: "passwordId",
        labelText: "passwordLabel",
        inputType: "password",
        inputPlaceholder: "passwordPlaceholder",
        isRequired: true,
        invalidMessage: "passwordInvalid",
      },
    ];

    render(<Form contents={formContents} onValidSubmit={onValidSubmitMock} />);

    setInputValue("textPlaceholder", "someText");
    setInputValue("emailPlaceholder", "test@test.com");
    setInputValue("passwordPlaceholder", "12345678");

    await clickSubmitButton();

    const expectedOnValidSubmitArgs: Parameters<
      IFormProps["onValidSubmit"]
    >[0] = [
      {
        inputId: "textId",
        inputValue: "someText",
      },
      {
        inputId: "emailId",
        inputValue: "test@test.com",
      },
      {
        inputId: "passwordId",
        inputValue: "12345678",
      },
    ];
    expect(onValidSubmitMock).toHaveBeenCalledWith(expectedOnValidSubmitArgs);
  });
  it("Should not clear inputs after 'onValidSubmit'.", async () => {
    const onValidSubmitMock = jest.fn();
    const formContents: IFormProps["contents"] = [
      {
        inputId: "textId",
        labelText: "textLabel",
        inputType: "text",
        inputPlaceholder: "textPlaceholder",
        isRequired: true,
        invalidMessage: "textInvalid",
      },
      {
        inputId: "emailId",
        labelText: "emailLabel",
        inputType: "email",
        inputPlaceholder: "emailPlaceholder",
        isRequired: false,
        invalidMessage: "invalidEmail",
      },
      {
        inputId: "passwordId",
        labelText: "passwordLabel",
        inputType: "password",
        inputPlaceholder: "passwordPlaceholder",
        isRequired: true,
        invalidMessage: "passwordInvalid",
      },
    ];

    render(<Form contents={formContents} onValidSubmit={onValidSubmitMock} />);

    const textInputElement = setInputValue("textPlaceholder", "someText");
    const emailInputElement = setInputValue(
      "emailPlaceholder",
      "test@test.com"
    );
    const passwordInputElement = setInputValue(
      "passwordPlaceholder",
      "12345678"
    );

    await clickSubmitButton();

    const expectedOnValidSubmitArgs: Parameters<
      IFormProps["onValidSubmit"]
    >[0] = [
      {
        inputId: "textId",
        inputValue: "someText",
      },
      {
        inputId: "emailId",
        inputValue: "test@test.com",
      },
      {
        inputId: "passwordId",
        inputValue: "12345678",
      },
    ];
    expect(onValidSubmitMock).toHaveBeenCalledWith(expectedOnValidSubmitArgs);

    expect(textInputElement.value).toBe("someText");
    expect(emailInputElement.value).toBe("test@test.com");
    expect(passwordInputElement.value).toBe("12345678");
  });
});
