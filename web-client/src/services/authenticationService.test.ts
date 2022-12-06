import React from "react";
import "whatwg-fetch";

import { INewUser } from "../../../api-types/authentication.types";
import { registerUser } from "./authenticationService";

const mockBaseUrl = "http://base-url.com";
// global.location["origin"] = jest.fn(({
//   origin: mockBaseUrl,
// }));
jest.spyOn(window, "location", "get").mockReturnValue({
  ...window.location,
  origin: mockBaseUrl,
});

const mockResponse = new Response();
mockResponse.text = () =>
  new Promise<string>((resolve) => {
    resolve(JSON.stringify(["123456", "123"]));
  });
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

describe("'registerUser()':", () => {
  const newUser: INewUser = {
    first_name: "Jane",
    last_name: "Doe",
    email_address: "jane@doe.com",
    plainPassword: "112233",
    client_language: "en",
  };
  it("Should send 'post' to '/register'.", async () => {
    await registerUser(newUser);
    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
  });
  // '/registration-confirmed' should only be reachable through redirect
  it.todo("Should redirect to '/registration-confirmed' on success.");
  it.todo("Should show toast if 'fetch' rejects.");
  it.todo("Should catch if 'fetch' rejects.");
  it.todo("Should show toast if status !== '200'.");
});
