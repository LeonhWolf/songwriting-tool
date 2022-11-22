const readFileMock = jest.fn().mockResolvedValue("Mocked read html string");
const ejsRenderMock = jest.fn().mockReturnValue("Mocked render result.");

import { getInterpolatedEmailString } from "./emailTemplateService";

jest.mock("fs/promises", () => ({
  __esModule: true,
  default: {
    readFile: readFileMock,
  },
}));
jest.mock("ejs", () => ({
  __esModule: true,
  default: {
    render: ejsRenderMock,
  },
}));

it("Should read html file.", async () => {
  const result = await getInterpolatedEmailString("registerConfirmation", {
    name: "Mr. Doe",
    confirmationLink: "confirmation",
    expiresOnDate: "expiration date",
  });
  expect(readFileMock).toHaveBeenCalledWith(
    `${__dirname}/../assets/register-confirmation-mail.ejs`,
    "utf-8"
  );
});
it("Should call 'render' with proper arguments.", async () => {
  const result = await getInterpolatedEmailString("registerConfirmation", {
    name: "Mr. Doe",
    confirmationLink: "confirmation",
    expiresOnDate: "expiration date",
  });
  expect(ejsRenderMock).toHaveBeenCalledWith("Mocked read html string", {
    name: "Mr. Doe",
    confirmationLink: "confirmation",
    expiresOnDate: "expiration date",
  });
});
it("Should return 'render' result.", async () => {
  const result = await getInterpolatedEmailString("registerConfirmation", {
    name: "Mr. Doe",
    confirmationLink: "confirmation",
    expiresOnDate: "expiration date",
  });
  expect(ejsRenderMock).toHaveBeenCalled();
  expect(result).toBe("Mocked render result.");
});

it("Should reject if 'readFile' rejects.", async () => {
  readFileMock.mockRejectedValueOnce("Some reason for rejecting.");
  await expect(
    getInterpolatedEmailString("registerConfirmation", {
      name: "Mr. Doe",
      confirmationLink: "confirmation",
      expiresOnDate: "expiration date",
    })
  ).rejects.toBe("Some reason for rejecting.");
});
