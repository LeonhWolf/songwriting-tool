import express from "express";
import { expressAuthentication } from "./tsoaAuthentication";

describe("If authenticated:", () => {
  it("Should resolve.", () => {
    const request = {
      session: {
        user: {},
      },
    } as unknown as express.Request;

    expect(
      expressAuthentication(request, "local_session")
    ).resolves.toBeUndefined();
  });
});

describe("If not authenticated:", () => {
  it("Should reject.", async () => {
    const request = {
      session: {},
    } as unknown as express.Request;

    await expect(
      expressAuthentication(request, "local_session")
    ).rejects.toStrictEqual({});
  });
  it("Should redirect to '/login' if not authenticated.", async () => {
    const request = {
      res: {
        redirect: jest.fn(),
      },
      session: {},
    } as unknown as express.Request;

    await expect(
      expressAuthentication(request, "local_session")
    ).rejects.toBeDefined();
    expect(request.res?.redirect).toHaveBeenCalledWith("/login");
  });
});
