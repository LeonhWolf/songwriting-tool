import express from "express";
import { expressAuthentication } from "./tsoaAuthentication";

jest.mock("express", () => ({
  Request: jest.fn().mockReturnValue({}),
}));

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
  it("Should reject.", () => {
    const request = {
      session: {},
    } as unknown as express.Request;

    expect(
      expressAuthentication(request, "local_session")
    ).rejects.toBeUndefined();
  });
  it("Should redirect to '/login' if not authenticated.", () => {
    const request = {
      res: {
        redirect: jest.fn(),
      },
      session: {},
    } as unknown as express.Request;

    expect(
      expressAuthentication(request, "local_session")
    ).rejects.toBeUndefined();
    expect(request.res?.redirect).toHaveBeenCalledWith("/login");
  });
});
