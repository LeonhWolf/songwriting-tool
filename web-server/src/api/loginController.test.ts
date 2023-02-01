const mockUserId = "mockUserId";
const userDocumentMock = {
  get: jest.fn().mockReturnValue(mockUserId),
};
jest.mock("../services/authorizationService.ts", () => ({
  verifyCredentials: jest.fn().mockResolvedValue(userDocumentMock),
}));

import express, { json } from "express";
import expressSession from "express-session";
import request from "supertest";

import { LoginController } from "./loginController";
import { RegisterRoutes } from "../../tsoa-build/routes";
import tsoaValidation from "../utils/tsoaValidation";
import { ILogin } from "../../../api-types/authentication.types";

// const app = express();
// beforeAll(() => {
//   app.use(json());
//   const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
//   app.use(
//     expressSession({
//       // store: new RedisStore({ client: redisClient }),
//       saveUninitialized: false,
//       resave: false,
//       secret: "Some secret",
//       cookie: {
//         maxAge: sevenDaysInMilliseconds,
//       },
//     })
//   );

//   RegisterRoutes(app);
//   app.use(tsoaValidation);
// });
const requestMock = {
  session: {
    regenerate: jest.fn(),
    save: jest.fn(),
    user: null,
  },
  res: {
    redirect: jest.fn(),
  },
};
beforeEach(() => {
  jest.clearAllMocks();
  requestMock.session.user = null;
});

describe("Success:", () => {
  const correctLoginData: ILogin = {
    email_address: "john@doe.com",
    password: "123",
  };

  it.skip("Should send a '201' and a message.", async () => {
    // const response = await request(app)
    //   .post("/api/login")
    //   .set("Accept", "application/json")
    //   .send(correctLoginData);
  });
  it("Should store user information in session.", async () => {
    const loginController = new LoginController();
    //@ts-ignore
    await loginController.logInUser(correctLoginData, requestMock);

    // expect(request.session.regenerate).toHaveBeenCalledTimes(1);
    // expect(request.session.user).toBeNull();
    // expect(request.session.regenerate).toHaveBeenCalledWith(
    //   expect.any(Function)
    // );
    // expect(request.session.save).toHaveBeenCalledTimes(0);

    // const regenerateCallback = requestMock.session.regenerate.mock.calls[0][0];
    // regenerateCallback();
    // // It should log error
    // expect(userDocumentMock.get).toHaveBeenCalledTimes(1);
    // expect(userDocumentMock.get).toHaveBeenCalledWith("_id");
    // expect(requestMock.session.user).toStrictEqual({ userId: mockUserId });

    // expect(requestMock.session.save).toHaveBeenCalledTimes(1);
    // expect(requestMock.session.save).toHaveBeenCalledWith(expect.any(Function));

    // const saveCallback = requestMock.session.save.mock.calls[0][0];
    // saveCallback();
    // // It should log error
    // expect(requestMock.res.redirect).toHaveBeenCalledTimes(1);
    // expect(requestMock.res.redirect).toHaveBeenCalledWith("/");

    // expect(request.session.save).toHaveBeenCalledTimes(1);

    // expect(app.request.session?.user).toBe(123);
  });
  it("Should call 'session.regenerate()'.", async () => {
    const loginController = new LoginController();
    //@ts-ignore
    await loginController.logInUser(correctLoginData, requestMock);

    expect(requestMock.session.regenerate).toHaveBeenCalledTimes(1);
    expect(requestMock.session.user).toBeNull();
    expect(requestMock.session.regenerate).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(requestMock.session.save).toHaveBeenCalledTimes(0);
  });
  it("Should set 'user' and call 'session.save()'.", async () => {
    const loginController = new LoginController();
    //@ts-ignore
    await loginController.logInUser(correctLoginData, requestMock);

    const regenerateCallback = requestMock.session.regenerate.mock.calls[0][0];
    regenerateCallback();
    // It should log error
    expect(userDocumentMock.get).toHaveBeenCalledTimes(1);
    expect(userDocumentMock.get).toHaveBeenCalledWith("_id");
    expect(requestMock.session.user).toStrictEqual({ userId: mockUserId });

    expect(requestMock.session.save).toHaveBeenCalledTimes(1);
    expect(requestMock.session.save).toHaveBeenCalledWith(expect.any(Function));
  });
  it("Should redirect to '/'.", async () => {
    const loginController = new LoginController();
    //@ts-ignore
    await loginController.logInUser(correctLoginData, requestMock);

    const regenerateCallback = requestMock.session.regenerate.mock.calls[0][0];
    regenerateCallback();

    const saveCallback = requestMock.session.save.mock.calls[0][0];
    saveCallback();
    // It should log error
    expect(requestMock.res.redirect).toHaveBeenCalledTimes(1);
    expect(requestMock.res.redirect).toHaveBeenCalledWith("/");
  });
  it.todo("Should not store user if 'regenerate' throws.");
  it.todo("Should redirect to '/'.");
});

// expect(request.session.regenerate).toHaveBeenCalledTimes(0);
it.todo("Should send a '500' on server error.");
it.todo("Should send a '400' on wrong credentials.");
