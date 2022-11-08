import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import Form from "./Form";
import { IFormProps } from "./FormTypes";
import LabelAndInput from "../LabelAndInput";

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

    const inputElement1 = await screen.findByPlaceholderText("placeholder");
    const inputElement2 = await screen.findByPlaceholderText("placeholder2");

    fireEvent.change(inputElement1, { target: { value: "test" } });
    fireEvent.change(inputElement2, { target: { value: "test2" } });
    expect((inputElement1 as HTMLInputElement).value).toBe("test");
    expect((inputElement2 as HTMLInputElement).value).toBe("test2");

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

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

      expect(screen.getByText("invalidTestMessage")).toBeDefined();
    });
    it("Should validate when required & filled (after invalidated).", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      expect(screen.queryByText("invalidTestMessage")).toBe(null);
      const inputElement = await screen.findByPlaceholderText("placeholder");

      // invalidate first
      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });
      expect(screen.getByText("invalidTestMessage")).toBeDefined();

      fireEvent.change(inputElement, { target: { value: "test" } });
      expect((inputElement as HTMLInputElement).value).toBe("test");

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

      expect(screen.queryByText("invalidTestMessage")).toBeNull();
    });
    it("Should not emit 'onValidSubmit' when any input is invalid.", async () => {
      const onValidSubmitMock = jest.fn();

      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

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

      const emailInputElement = screen.getByPlaceholderText("emailPlaceholder");
      fireEvent.change(emailInputElement, { target: { value: "test" } });
      expect((emailInputElement as HTMLInputElement).value).toBe("test");

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate with 0 chars before '@'.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      const emailInputElement = screen.getByPlaceholderText("emailPlaceholder");
      fireEvent.change(emailInputElement, { target: { value: "@test.de" } });
      expect((emailInputElement as HTMLInputElement).value).toBe("@test.de");

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate if <2 chars after last '.'.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      const emailInputElement = screen.getByPlaceholderText("emailPlaceholder");
      fireEvent.change(emailInputElement, { target: { value: "test@test.d" } });
      expect((emailInputElement as HTMLInputElement).value).toBe("test@test.d");

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should validate with preceding conditions true.", async () => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);

      const emailInputElement = screen.getByPlaceholderText("emailPlaceholder");
      fireEvent.change(emailInputElement, {
        target: { value: "test@test.de" },
      });
      expect((emailInputElement as HTMLInputElement).value).toBe(
        "test@test.de"
      );

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

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

      const passwordInputElement = screen.getByPlaceholderText(
        "passwordPlaceholder"
      );
      fireEvent.change(passwordInputElement, {
        target: { value: "1234567" },
      });
      expect((passwordInputElement as HTMLInputElement).value).toBe("1234567");

      await act(async () => {
        const submitButton = await screen.findByText("submit");
        await submitButton.click();
      });

      expect(screen.getByText("passwordInvalid")).toBeDefined();
    });
  });
  it.todo(
    "Should not emit 'onValidSubmit' when invalid inputs are not required."
  );
  it.todo("Should emit 'onValidSubmit' when all inputs are valid.");
});
