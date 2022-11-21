const argon2HashMock = jest.fn().mockResolvedValue("Hash and salt");

import fakeTimers from "@sinonjs/fake-timers";
import mongoose from "mongoose";

import { IUser, User } from "../models/userModel";
import { create } from "./userService";
import setupAndDropTestDB from "../utils/testUtils/setupAndDropTestDB";

type IAppSettingsDb = IUser["app_settings"] & {
  _id: mongoose.Types.ObjectId;
};
type IAccountConfirmationDb = IUser["account_confirmation"] & {
  _id: mongoose.Types.ObjectId;
};
interface IUserDb extends IUser {
  __v: number;
  _id: mongoose.Types.ObjectId;
  app_settings: IAppSettingsDb;
  account_confirmation?: IAccountConfirmationDb;
}

jest.mock("argon2", () => ({
  hash: argon2HashMock,
}));

setupAndDropTestDB({ doDropDbBeforeEach: true });

let clock: fakeTimers.InstalledClock;

beforeAll(() => {
  clock = fakeTimers.install();
});
beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  clock.uninstall();
});

const expectedAccountConfirmation: IAccountConfirmationDb = {
  _id: expect.any(mongoose.Types.ObjectId),
  expires_on: new Date("1970-01-15T00:00:00.000Z"),
};

describe("Create:", () => {
  it("Should create new user with given credentials.", async () => {
    const newUser: Parameters<typeof create>[0] = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      plainPassword: "123456",
      client_language: "en",
    };
    const expectedUser: IUserDb = {
      __v: expect.any(Number),
      _id: expect.any(mongoose.Types.ObjectId),
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      last_user_edit_on: new Date(),
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "en",
      },
      account_confirmation: expectedAccountConfirmation,
      local_sessions: [],
      password_hash_and_salt: expect.any(String),
    };

    await create(newUser);

    const userDocuments = await User.find({}).lean();
    expect(userDocuments).toHaveLength(1);
    expect(userDocuments[0]).toEqual(expectedUser);
  });
  it("Should hash and salt password.", async () => {
    argon2HashMock.mockResolvedValueOnce("Mocked hash and salt");

    const newUser: Parameters<typeof create>[0] = {
      email_address: "jane@doe.com",
      first_name: "Jane",
      last_name: "Doe",
      plainPassword: "654321",
      client_language: "de",
    };
    const expectedUser: IUserDb = {
      __v: expect.any(Number),
      _id: expect.any(mongoose.Types.ObjectId),
      email_address: "jane@doe.com",
      first_name: "Jane",
      last_name: "Doe",
      password_hash_and_salt: "Mocked hash and salt",
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "de",
      },
      local_sessions: [],
      account_confirmation: expectedAccountConfirmation,
      last_user_edit_on: new Date(),
    };

    await create(newUser);

    expect(argon2HashMock).toHaveBeenCalledTimes(1);
    expect(argon2HashMock).toHaveBeenCalledWith("654321", {
      timeCost: 2,
      parallelism: 1,
    });

    const userDocuments = await User.find({}).lean();
    expect(userDocuments).toHaveLength(1);
    expect(userDocuments[0]).toEqual(expectedUser);
  });
  it("Should reject if 'save()' rejects.", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValueOnce(
        new Error("Some reason for rejecting user.save()")
      );
    const newUser: Parameters<typeof create>[0] = {
      email_address: "",
      first_name: "Jane",
      last_name: "Doe",
      plainPassword: "654321",
      client_language: "de",
    };
    await expect(create(newUser)).rejects.toThrow(
      "Some reason for rejecting user.save()"
    );
  });
  it("Should reject if 'hash()' rejects.", async () => {
    argon2HashMock.mockRejectedValueOnce(
      new Error("Some reason for rejecting user.hash()")
    );
    const newUser: Parameters<typeof create>[0] = {
      email_address: "",
      first_name: "Jane",
      last_name: "Doe",
      plainPassword: "654321",
      client_language: "de",
    };
    await expect(create(newUser)).rejects.toThrow(
      "Some reason for rejecting user.hash()"
    );
  });
  it("Should add 'accountConfirmation' (expires in 14 days).", async () => {
    const newUser: Parameters<typeof create>[0] = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      plainPassword: "...",
      client_language: "en",
    };
    const expectedUser: IUserDb = {
      __v: expect.any(Number),
      _id: expect.any(mongoose.Types.ObjectId),
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      last_user_edit_on: new Date(),
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "en",
      },
      account_confirmation: expectedAccountConfirmation,
      local_sessions: [],
      password_hash_and_salt: expect.any(String),
    };

    await create(newUser);

    const userDocuments = await User.find({}).lean();
    expect(userDocuments).toHaveLength(1);
    expect(userDocuments[0]).toEqual(expectedUser);
  });
  describe("Mail already taken:", () => {
    const johnDoe: IUser = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      last_user_edit_on: new Date(),
      app_settings: {
        app_language: "en",
      },
      local_sessions: [],
      password_hash_and_salt: "123",
    };
    const expectedJohnDoeDocument: IUserDb = {
      __v: expect.any(Number),
      _id: expect.any(mongoose.Types.ObjectId),
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      last_user_edit_on: new Date(),
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "en",
      },
      local_sessions: [],
      password_hash_and_salt: expect.any(String),
    };
    const johnDoeDuplicate: Parameters<typeof create>[0] = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      plainPassword: "123456",
      client_language: "en",
    };
    const insertJohnDoe = async () => {
      const johnDoeUser = new User(johnDoe);
      await johnDoeUser.save();
      const allUsers = await User.find({}).lean();
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0]).toEqual(expectedJohnDoeDocument);
    };
    it("Should reject.", async () => {
      await insertJohnDoe();
      await expect(create(johnDoeDuplicate)).rejects.toThrow(
        "User with email 'john@doe.com' already exists."
      );
    });
    it("Should not insert a new user into the DB.", async () => {
      await insertJohnDoe();
      await expect(create(johnDoeDuplicate)).rejects.toThrow(
        "User with email 'john@doe.com' already exists."
      );
      const allUsers = await User.find({}).lean();
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0]).toEqual(expectedJohnDoeDocument);
    });
  });
});
