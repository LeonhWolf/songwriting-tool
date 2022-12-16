import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";
import "whatwg-fetch";

import Form from "./Form";
import { IFormProps } from "./Form.types";
import i18n from "../../i18n/index";
import { setInputValue } from "../../utils/testUtils";

const getRerenderAndRender = async (initialElement: React.ReactElement) => {
  let rerenderOutside: (
    ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  ) => void = () => {};

  /*eslint-disable*/
  await act(() => {
    const { rerender } = render(initialElement);
    rerenderOutside = rerender;
  });

  return rerenderOutside;
};

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

jest.spyOn(i18n, "t").mockImplementation(() => "testPopoverContent");

beforeEach(() => {
  jest.clearAllMocks();
});

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
    /*eslint-disable*/
    await act(() => {
      render(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
    });

    expect(screen.getByPlaceholderText("textPlaceholder").id).toBe("textId");
    expect(screen.getByPlaceholderText("emailPlaceholder").id).toBe("emailId");
    expect(screen.getByPlaceholderText("passwordPlaceholder").id).toBe(
      "passwordId"
    );
  });
  it("Should have proper labelText.", async () => {
    /*eslint-disable*/
    await act(() => {
      render(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
    });

    expect(screen.getByText("textLabel")).toBeDefined();
    expect(screen.getByText("emailLabel")).toBeDefined();
    expect(screen.getByText("passwordLabel")).toBeDefined();
  });
  it("Should have proper inputType.", async () => {
    /*eslint-disable*/
    await act(() => {
      render(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
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
    /*eslint-disable*/
    await act(() => {
      render(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
    });

    expect(screen.getByPlaceholderText("textPlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("emailPlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("passwordPlaceholder")).toBeDefined();
  });
  it("Should have proper 'isRequired'.", async () => {
    /*eslint-disable*/
    await act(() => {
      render(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
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
    /*eslint-disable*/
    const rerender = await getRerenderAndRender(
      <Form
        contents={formContents}
        onValidSubmit={() => {}}
        doShowValidation={false}
        onValidationChange={() => {}}
      />
    );

    setInputValue("emailPlaceholder", "asd");
    setInputValue("passwordPlaceholder", "123");

    rerender(
      <Form
        contents={formContents}
        onValidSubmit={() => {}}
        doShowValidation={true}
        onValidationChange={() => {}}
      />
    );

    expect(screen.getByText("textInvalid")).toBeDefined();
    expect(screen.getByText("emailInvalid")).toBeDefined();
    expect(screen.getByText("passwordInvalid")).toBeDefined();
  });
});

describe("Form validation:", () => {
  it("Should not invalidate inputs when 'doShowValidation' is 'false'.", async () => {
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

    /*eslint-disable*/
    const rerender = await getRerenderAndRender(
      <Form
        contents={formContents}
        onValidSubmit={() => {}}
        doShowValidation={false}
        onValidationChange={() => {}}
      />
    );

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
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
      expect(screen.queryByText("invalidTestMessage")).toBe(null);

      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
      expect(screen.getByText("invalidTestMessage")).toBeDefined();
    });
    it("Should validate when required & filled (after invalidated).", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      expect(screen.queryByText("invalidTestMessage")).toBe(null);
      const inputElement = await screen.findByPlaceholderText("placeholder");

      // invalidate first
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );

      expect(screen.getByText("invalidTestMessage")).toBeDefined();

      fireEvent.change(inputElement, { target: { value: "test" } });
      expect((inputElement as HTMLInputElement).value).toBe("test");

      expect(screen.queryByText("invalidTestMessage")).toBeNull();
    });
    it("Should not emit 'onValidSubmit' when any input is invalid.", async () => {
      const onValidSubmitMock = jest.fn();
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={onValidSubmitMock}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
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
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("emailPlaceholder", "test");
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate with 0 chars before '@'.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("emailPlaceholder", "@test.de");
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should invalidate if <2 chars after last '.'.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("emailPlaceholder", "test@test.d");
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
      expect(screen.getByText("invalidEmail")).toBeDefined();
    });
    it("Should validate with preceding conditions true.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("emailPlaceholder", "test@test.de");
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
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
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("passwordPlaceholder", "1234567");
      expect(screen.queryByText("passwordInvalid")).toBeNull();
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
      expect(screen.getByText("passwordInvalid")).toBeDefined();
    });
    it("Should validate when length >= 8.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("passwordPlaceholder", "12345678");
      expect(screen.queryByText("passwordInvalid")).toBeNull();
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={() => {}}
        />
      );
      expect(screen.queryByText("passwordInvalid")).toBeNull();
    });
    it("Should show popover when password is insecure.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      setInputValue("passwordPlaceholder", "123456");
      expect(await screen.findByText("testPopoverContent")).toBeDefined();
    });
    it("Should not show popover when password is secure.", async () => {
      jest.spyOn(i18n, "t").mockImplementation(() => "testPopoverContent");

      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );
      setInputValue("passwordPlaceholder", "Klsdw;Df2");
      expect(screen.queryByText("testPopoverContent")).toBe(null);
    });
    it("Should catch if 'fetch' rejects.", async () => {
      (
        global.fetch as jest.MockedFunction<typeof global.fetch>
      ).mockRejectedValueOnce(new Error("Some reason why fetch rejected."));

      jest.spyOn(console, "error").mockImplementationOnce(() => {});

      await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={() => {}}
        />
      );

      expect(console.error).toHaveBeenCalledWith(
        "File '200-most-common-passwords.txt' could not be loaded.",
        new Error("Some reason why fetch rejected.")
      );
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
        isRequired: true,
        invalidMessage: "passwordInvalid",
      },
    ];

    /*eslint-disable*/
    const rerender = await getRerenderAndRender(
      <Form
        contents={formContents}
        onValidSubmit={onValidSubmitMock}
        doShowValidation={false}
        onValidationChange={() => {}}
      />
    );

    setInputValue("emailPlaceholder", "ab");
    setInputValue("passwordPlaceholder", "1234567");

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

    /*eslint-disable*/
    const rerender = await getRerenderAndRender(
      <Form
        contents={formContents}
        onValidSubmit={onValidSubmitMock}
        doShowValidation={false}
        onValidationChange={() => {}}
      />
    );

    setInputValue("textPlaceholder", "someText");
    setInputValue("emailPlaceholder", "test@test.com");
    setInputValue("passwordPlaceholder", "12345678");

    rerender(
      <Form
        contents={formContents}
        onValidSubmit={onValidSubmitMock}
        doShowValidation={true}
        onValidationChange={() => {}}
      />
    );

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

    /*eslint-disable*/
    const rerender = await getRerenderAndRender(
      <Form
        contents={formContents}
        onValidSubmit={onValidSubmitMock}
        doShowValidation={false}
        onValidationChange={() => {}}
      />
    );

    const textInputElement = setInputValue("textPlaceholder", "someText");
    const emailInputElement = setInputValue(
      "emailPlaceholder",
      "test@test.com"
    );
    const passwordInputElement = setInputValue(
      "passwordPlaceholder",
      "12345678"
    );

    rerender(
      <Form
        contents={formContents}
        onValidSubmit={onValidSubmitMock}
        doShowValidation={true}
        onValidationChange={() => {}}
      />
    );

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
  describe("'onValidationChange':", () => {
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
    const onValidationChangeSpy = jest.fn();
    it("Should emit if form validates && 'doShowValidation===true'.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={onValidationChangeSpy}
        />
      );

      setInputValue("textPlaceholder", "someText");
      setInputValue("emailPlaceholder", "test@test.com");
      setInputValue("passwordPlaceholder", "12345678");

      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={onValidationChangeSpy}
        />
      );

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(true);
    });
    it("Should emit if form invalidates && 'doShowValidation===true'.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={onValidationChangeSpy}
        />
      );

      setInputValue("textPlaceholder", "someText");
      setInputValue("emailPlaceholder", "test@test.com");
      setInputValue("passwordPlaceholder", "12345678");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(true);

      onValidationChangeSpy.mockClear();

      setInputValue("emailPlaceholder", "@");
      rerender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={true}
          onValidationChange={onValidationChangeSpy}
        />
      );

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(false);
    });
    it("Should emit if form validates && 'doShowValidation===false'.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={onValidationChangeSpy}
        />
      );

      setInputValue("textPlaceholder", "someText");
      setInputValue("emailPlaceholder", "test@test.com");
      setInputValue("passwordPlaceholder", "12345678");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(true);
    });
    it("Should emit if form invalidates && 'doShowValidation===false'.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={onValidationChangeSpy}
        />
      );

      setInputValue("textPlaceholder", "someText");
      setInputValue("emailPlaceholder", "test@test.com");
      setInputValue("passwordPlaceholder", "12345678");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(true);

      onValidationChangeSpy.mockClear();

      setInputValue("passwordPlaceholder", "1");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(false);
    });
    it("Should not emit if already invalid invalidated again.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={onValidationChangeSpy}
        />
      );

      setInputValue("passwordPlaceholder", "1");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(0);
    });
    it("Should not emit if already valid validated again.", async () => {
      /*eslint-disable*/
      const rerender = await getRerenderAndRender(
        <Form
          contents={formContents}
          onValidSubmit={() => {}}
          doShowValidation={false}
          onValidationChange={onValidationChangeSpy}
        />
      );

      setInputValue("textPlaceholder", "someText");
      setInputValue("emailPlaceholder", "test@test.com");
      setInputValue("passwordPlaceholder", "12345678");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
      expect(onValidationChangeSpy).toHaveBeenCalledWith(true);

      setInputValue("passwordPlaceholder", "1222334566");

      expect(onValidationChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
