import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";
import "whatwg-fetch";

import Form from "./Form";
import { IFormProps } from "./Form_Types";
import i18n from "../../i18n/index";

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

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));
jest.spyOn(i18n, "t").mockImplementation(() => "testPopoverContent");

describe("Passing props to label & input:", () => {
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
      isRequired: true,
      invalidMessage: "emailInvalid",
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
  it("Should have proper inputId.", async () => {
    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

    expect(screen.getByPlaceholderText("textPlaceholder").id).toBe("textId");
    expect(screen.getByPlaceholderText("emailPlaceholder").id).toBe("emailId");
    expect(screen.getByPlaceholderText("passwordPlaceholder").id).toBe(
      "passwordId"
    );
  });
  it("Should have proper labelText.", async () => {
    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

    expect(screen.getByText("textLabel")).toBeDefined();
    expect(screen.getByText("emailLabel")).toBeDefined();
    expect(screen.getByText("passwordLabel")).toBeDefined();
  });
  it("Should have proper inputType.", async () => {
    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

    expect(
      screen.getByPlaceholderText("textPlaceholder").getAttribute("type")
    ).toBe("text");
    expect(
      screen.getByPlaceholderText("emailPlaceholder").getAttribute("type")
    ).toBe("email");
    expect(
      screen.getByPlaceholderText("passwordPlaceholder").getAttribute("type")
    ).toBe("password");
  });
  it("Should have proper inputPlaceholder.", async () => {
    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

    expect(screen.getByPlaceholderText("textPlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("emailPlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("passwordPlaceholder")).toBeDefined();
  });
  it("Should have proper 'isRequired'.", async () => {
    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

    // char code 160 is &nbsp;
    expect(screen.getByText("textLabel").textContent).toBe(
      `textLabel${String.fromCharCode(160)}*`
    );
    expect(screen.getByText("emailLabel").textContent).toBe(
      `emailLabel${String.fromCharCode(160)}*`
    );
    expect(screen.getByText("passwordLabel").textContent).toBe(
      `passwordLabel${String.fromCharCode(160)}*`
    );
  });
  it("Should have proper invalidMessage.", async () => {
    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

    setInputValue("emailPlaceholder", "asd");
    setInputValue("passwordPlaceholder", "123");

    await clickSubmitButton();

    expect(screen.getByText("textInvalid")).toBeDefined();
    expect(screen.getByText("emailInvalid")).toBeDefined();
    expect(screen.getByText("passwordInvalid")).toBeDefined();
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

    await act(() => {
      render(<Form contents={formContents} onValidSubmit={() => {}} />);
    });

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
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      expect(screen.queryByText("invalidTestMessage")).toBe(null);

      await clickSubmitButton();
      expect(screen.getByText("invalidTestMessage")).toBeDefined();
    });
    it("Should validate when required & filled (after invalidated).", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

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

      await act(() => {
        render(
          <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
        );
      });

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
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("emailPlaceholder", "test");

      await clickSubmitButton();
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate with 0 chars before '@'.", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("emailPlaceholder", "@test.de");

      await clickSubmitButton();
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate if <2 chars after last '.'.", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("emailPlaceholder", "test@test.d");

      await clickSubmitButton();
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should validate with preceding conditions true.", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("emailPlaceholder", "test@test.de");

      await clickSubmitButton();
      expect(screen.queryByText("invalidEmail")).toBeNull();
    });
  });
  describe("Password:", () => {
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
    it("Should invalidate when length < 8.", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("passwordPlaceholder", "1234567");
      expect(screen.queryByText("passwordInvalid")).toBeNull();

      await clickSubmitButton();
      expect(screen.getByText("passwordInvalid")).toBeDefined();
    });
    it("Should validate when length >= 8.", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("passwordPlaceholder", "12345678");
      expect(screen.queryByText("passwordInvalid")).toBeNull();

      await clickSubmitButton();
      expect(screen.queryByText("passwordInvalid")).toBeNull();
    });
    it("Should show popover when password is insecure.", async () => {
      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });

      setInputValue("passwordPlaceholder", "123456");
      expect(await screen.findByText("testPopoverContent")).toBeDefined();
    });
    it("Should not show popover when password is secure.", async () => {
      jest.spyOn(i18n, "t").mockImplementation(() => "testPopoverContent");

      await act(() => {
        render(<Form contents={formContents} onValidSubmit={() => {}} />);
      });
      setInputValue("passwordPlaceholder", "Klsdw;Df2");

      expect(screen.queryByText("testPopoverContent")).toBe(null);
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

    await act(() => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
    });

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

    await act(() => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
    });

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

    await act(() => {
      render(
        <Form contents={formContents} onValidSubmit={onValidSubmitMock} />
      );
    });

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
