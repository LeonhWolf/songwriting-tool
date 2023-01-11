const argon2HashMock = jest.fn().mockResolvedValue("Hash and salt");

jest.mock("argon2", () => ({
  hash: argon2HashMock,
}));

import fakeTimers from "@sinonjs/fake-timers";
import mongoose from "mongoose";

import { IUser, User } from "../models/userModel";
import {
  create,
  findOne,
  findAll,
  deleteOne,
  deleteMany,
  tryConfirmation,
} from "./userService";
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

setupAndDropTestDB({ doDropDbBeforeEach: true });

let clock: fakeTimers.InstalledClock;

beforeAll(() => {
  clock = fakeTimers.install();
});
beforeEach(() => {
  jest.clearAllMocks();
  clock.setSystemTime(new Date("1970-01-01T00:00:00.000Z"));
});

afterAll(() => {
  clock.uninstall();
});

const expectedAccountConfirmation: IAccountConfirmationDb = {
  _id: expect.any(mongoose.Types.ObjectId),
  expires_on: new Date("1970-01-15T00:00:00.000Z"),
};

describe("'create()':", () => {
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
  it("Should return the created user document.", async () => {
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

    const createdUser = await create(newUser);
    expect(createdUser.toObject()).toEqual(expectedUser);
  });
  describe("Mail already taken:", () => {
    const getJohnDoe = (): IUser => ({
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      last_user_edit_on: new Date(),
      app_settings: {
        app_language: "en",
      },
      local_sessions: [],
      password_hash_and_salt: "123",
    });
    const getExpectedJohnDoeDocument = (): IUserDb => ({
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
    });
    const johnDoeDuplicate: Parameters<typeof create>[0] = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      plainPassword: "123456",
      client_language: "en",
    };
    const insertJohnDoe = async () => {
      const johnDoeUser = new User(getJohnDoe());
      await johnDoeUser.save();
      const allUsers = await User.find({}).lean();
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0]).toEqual(getExpectedJohnDoeDocument());
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
      expect(allUsers[0]).toEqual(getExpectedJohnDoeDocument());
    });
  });
});

describe("'findOne()':", () => {
  describe("Find by id:", () => {
    it("Should return the document.", async () => {
      const user1 = new User({
        _id: new mongoose.Types.ObjectId("00000000a93e657f7c040ebb"),
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password_hash_and_salt: "123hashAndSalt",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          app_language: "en",
        },
        local_sessions: [],
      });
      const user2 = new User({
        _id: new mongoose.Types.ObjectId("00000000a93e657f7c040ebc"),
        email_address: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        password_hash_and_salt: "123hashAndSalt",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          app_language: "de",
        },
        local_sessions: [],
      });
      await user2.save();
      await user1.save();

      const getExpectedUser = (): IUserDb => ({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          _id: expect.any(mongoose.Types.ObjectId),
          app_language: "en",
        },
        local_sessions: [],
        password_hash_and_salt: "123hashAndSalt",
      });

      const foundUser = await findOne(
        "id",
        new mongoose.Types.ObjectId("00000000a93e657f7c040ebb")
      );
      expect(foundUser?.toJSON()).toEqual(getExpectedUser());
    });
    it("Should return null if no user found.", async () => {
      expect(
        await findOne(
          "id",
          new mongoose.Types.ObjectId("00000000a93e657f7c040ebb")
        )
      ).toBeNull();
    });
    it("Should reject if find rejects.", async () => {
      jest
        .spyOn(User, "find")
        .mockRejectedValueOnce("Some DB error on 'find'.");

      await expect(
        findOne("id", new mongoose.Types.ObjectId("00000000a93e657f7c040ebb"))
      ).rejects.toBe("Some DB error on 'find'.");
    });
  });
  describe("Find by email:", () => {
    it("Should return the document.", async () => {
      const user1 = new User({
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password_hash_and_salt: "123hashAndSalt",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          app_language: "en",
        },
        local_sessions: [],
      });
      const user2 = new User({
        email_address: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        password_hash_and_salt: "123hashAndSalt",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          app_language: "de",
        },
        local_sessions: [],
      });
      await user2.save();
      await user1.save();

      const getExpectedUser = (): IUserDb => ({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          _id: expect.any(mongoose.Types.ObjectId),
          app_language: "en",
        },
        local_sessions: [],
        password_hash_and_salt: "123hashAndSalt",
      });

      const foundUser = await findOne("emailAddress", "john@doe.com");
      expect(foundUser?.toJSON()).toEqual(getExpectedUser());
    });
    it("Should reject if found users > 1.", async () => {
      const user1 = new User({
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password_hash_and_salt: "123hashAndSalt",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          app_language: "en",
        },
        local_sessions: [],
      });
      const user1Duplicate = new User({
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password_hash_and_salt: "123hashAndSalt",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          app_language: "en",
        },
        local_sessions: [],
      });
      await user1.save();
      await user1Duplicate.save();

      await expect(findOne("emailAddress", "john@doe.com")).rejects.toThrow(
        "User with email address 'john@doe.com' exists multiple times."
      );
    });
    it("Should return null if no user found.", async () => {
      expect(await findOne("emailAddress", "john@doe.com")).toBeNull();
    });
    it("Should reject if find rejects.", async () => {
      jest
        .spyOn(User, "find")
        .mockRejectedValueOnce("Some DB error on 'find'.");

      await expect(
        findOne("emailAddress", "isAccountConfirmationExpired")
      ).rejects.toBe("Some DB error on 'find'.");
    });
  });
});

describe("'findAll()':", () => {
  describe("Find by 'isAccountConfirmationExpired':", () => {
    it("Should return all documents.", async () => {
      const newUser1: Parameters<typeof create>[0] = {
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        plainPassword: "123456",
        client_language: "en",
      };
      const newUser2: Parameters<typeof create>[0] = {
        email_address: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        plainPassword: "654321",
        client_language: "de",
      };
      const newUser3: Parameters<typeof create>[0] = {
        email_address: "jack@doe.com",
        first_name: "Jack",
        last_name: "Doe",
        plainPassword: "112233",
        client_language: "en",
      };
      const accountConfirmation: IAccountConfirmationDb = {
        _id: expect.any(mongoose.Types.ObjectId),
        expires_on: new Date("1970-01-15T00:00:00.000Z"),
      };
      const getExpectedUser1 = (): IUserDb => ({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          _id: expect.any(mongoose.Types.ObjectId),
          app_language: "en",
        },
        account_confirmation: accountConfirmation,
        local_sessions: [],
        password_hash_and_salt: expect.any(String),
      });
      const getExpectedUser2 = (): IUserDb => ({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        email_address: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
        app_settings: {
          _id: expect.any(mongoose.Types.ObjectId),
          app_language: "de",
        },
        account_confirmation: accountConfirmation,
        local_sessions: [],
        password_hash_and_salt: expect.any(String),
      });

      await create(newUser1);
      await create(newUser2);

      clock.setSystemTime(new Date("1970-01-20T00:00:00.000Z"));
      await create(newUser3);

      clock.setSystemTime(new Date("1970-01-15T00:00:00.001Z"));
      const expiredUsers = await findAll("isAccountConfirmationExpired");
      clock.setSystemTime(new Date("1970-01-01T00:00:00.000Z"));

      expect(expiredUsers).toHaveLength(2);
      expect(expiredUsers[0].toObject()).toEqual(getExpectedUser1());
      expect(expiredUsers[1].toObject()).toEqual(getExpectedUser2());
    });
    it("Should return empty array when non found.", async () => {
      const newUser3: Parameters<typeof create>[0] = {
        email_address: "jack@doe.com",
        first_name: "Jack",
        last_name: "Doe",
        plainPassword: "112233",
        client_language: "en",
      };
      await create(newUser3);
      const expiredUsers = await findAll("isAccountConfirmationExpired");
      expect(expiredUsers).toEqual([]);
    });
    it("Should reject if find rejects.", async () => {
      jest
        .spyOn(User, "find")
        .mockRejectedValueOnce("Some DB error on 'find'.");

      await expect(findAll("isAccountConfirmationExpired")).rejects.toBe(
        "Some DB error on 'find'."
      );
    });
  });
  describe("Find by 'id':", () => {
    it("Should return all found by array of filter argument.", async () => {
      const newUser1: Parameters<typeof create>[0] = {
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        plainPassword: "123456",
        client_language: "en",
      };
      const newUser2: Parameters<typeof create>[0] = {
        email_address: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        plainPassword: "654321",
        client_language: "de",
      };
      const newUser3: Parameters<typeof create>[0] = {
        email_address: "jack@doe.com",
        first_name: "Jack",
        last_name: "Doe",
        plainPassword: "112233",
        client_language: "en",
      };
      const getExpectedUser1 = (): IUserDb => ({
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
      });
      const getExpectedUser2 = (): IUserDb => ({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        email_address: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        last_user_edit_on: new Date(),
        app_settings: {
          _id: expect.any(mongoose.Types.ObjectId),
          app_language: "de",
        },
        account_confirmation: expectedAccountConfirmation,
        local_sessions: [],
        password_hash_and_salt: expect.any(String),
      });
      const createdUser1 = await create(newUser1);
      const createdUser2 = await create(newUser2);
      await create(newUser3);
      const createdUser1Id = createdUser1.get("_id") as mongoose.Types.ObjectId;
      const createdUser2Id = createdUser2.get("_id") as mongoose.Types.ObjectId;

      const users = await findAll("id", [createdUser1Id, createdUser2Id]);
      expect(users).toHaveLength(2);
      expect(users[0].toObject()).toEqual(getExpectedUser1());
      expect(users[1].toObject()).toEqual(getExpectedUser2());
    });
    it("Should return empty array when non found.", async () => {
      const newUser1: Parameters<typeof create>[0] = {
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        plainPassword: "123456",
        client_language: "en",
      };
      await create(newUser1);

      const nonExistingUserId = new mongoose.Types.ObjectId(
        "0001e240bb3b909f271115a3"
      );

      const users = await findAll("id", [nonExistingUserId]);
      expect(users).toEqual([]);
    });
    it("Should reject if 'find' rejects.", async () => {
      const newUser1: Parameters<typeof create>[0] = {
        email_address: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        plainPassword: "123456",
        client_language: "en",
      };

      const createdUser1 = await create(newUser1);
      const createdUser1Id = createdUser1.get("_id") as mongoose.Types.ObjectId;

      jest
        .spyOn(User, "find")
        .mockRejectedValueOnce("Some DB error on 'find'.");

      await expect(findAll("id", [createdUser1Id])).rejects.toBe(
        "Some DB error on 'find'."
      );
    });
  });
});

describe("Delete:", () => {
  describe("'deleteOne()':", () => {
    const getExpectedUser = (): IUserDb => ({
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
    });
    const newUser1: Parameters<typeof create>[0] = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      plainPassword: "123456",
      client_language: "en",
    };
    const newUser2: Parameters<typeof create>[0] = {
      email_address: "jane@doe.com",
      first_name: "Jane",
      last_name: "Doe",
      plainPassword: "654321",
      client_language: "de",
    };
    it("Should delete user by id.", async () => {
      await create(newUser1);

      const createdUser2 = await create(newUser2);
      const createdUser2Id = createdUser2.get("_id") as mongoose.Types.ObjectId;

      await deleteOne(createdUser2Id);

      const userDocuments = await User.find({}).lean();
      expect(userDocuments).toHaveLength(1);
      expect(userDocuments[0]).toEqual(getExpectedUser());
    });
    it("Should reject if user with id does not exist.", async () => {
      await create(newUser1);

      const nonExistingUserId = new mongoose.Types.ObjectId(
        "0001e240bb3b909f271115a3"
      );
      await expect(deleteOne(nonExistingUserId)).rejects.toThrow(
        "User cannot be deleted because there is no user with id '0001e240bb3b909f271115a3'."
      );
    });
    it("Should reject if mongoose 'deleteOne' rejects.", async () => {
      await create(newUser1);

      const createdUser2 = await create(newUser2);
      const createdUser2Id = createdUser2.get("_id") as mongoose.Types.ObjectId;

      jest
        .spyOn(User, "deleteOne")
        .mockRejectedValueOnce("Some DB error on 'deleteOne'.");
      await expect(deleteOne(createdUser2Id)).rejects.toBe(
        "Some DB error on 'deleteOne'."
      );
    });
  });
  describe("'deleteMany()':", () => {
    const getExpectedUser3 = (): IUserDb => ({
      __v: expect.any(Number),
      _id: expect.any(mongoose.Types.ObjectId),
      email_address: "jack@doe.com",
      first_name: "Jack",
      last_name: "Doe",
      last_user_edit_on: new Date(),
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "en",
      },
      account_confirmation: expectedAccountConfirmation,
      local_sessions: [],
      password_hash_and_salt: expect.any(String),
    });
    const newUser1: Parameters<typeof create>[0] = {
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      plainPassword: "123456",
      client_language: "en",
    };
    const newUser2: Parameters<typeof create>[0] = {
      email_address: "jane@doe.com",
      first_name: "Jane",
      last_name: "Doe",
      plainPassword: "654321",
      client_language: "de",
    };
    const newUser3: Parameters<typeof create>[0] = {
      email_address: "jack@doe.com",
      first_name: "Jack",
      last_name: "Doe",
      plainPassword: "112233",
      client_language: "en",
    };
    it("Should delete users by id.", async () => {
      const createdUser1 = await create(newUser1);
      const createdUser1Id = createdUser1.get("_id") as mongoose.Types.ObjectId;

      const createdUser2 = await create(newUser2);
      const createdUser2Id = createdUser2.get("_id") as mongoose.Types.ObjectId;

      await create(newUser3);

      await deleteMany([createdUser1Id, createdUser2Id]);

      const userDocuments = await User.find({}).lean();
      expect(userDocuments).toHaveLength(1);
      expect(userDocuments[0]).toEqual(getExpectedUser3());
    });
    it("Should reject if mongoose 'deleteMany' rejects.", async () => {
      const createdUser1 = await create(newUser1);
      const createdUser1Id = createdUser1.get("_id") as mongoose.Types.ObjectId;

      const createdUser2 = await create(newUser2);
      const createdUser2Id = createdUser2.get("_id") as mongoose.Types.ObjectId;

      await create(newUser3);

      jest
        .spyOn(User, "deleteMany")
        .mockRejectedValueOnce("Some DB error on 'deleteMany'.");
      await expect(deleteMany([createdUser1Id, createdUser2Id])).rejects.toBe(
        "Some DB error on 'deleteMany'."
      );
    });
  });
});

describe("'tryConfirmation()':", () => {
  const newUser1: Parameters<typeof create>[0] = {
    email_address: "john@doe.com",
    first_name: "John",
    last_name: "Doe",
    plainPassword: "123456",
    client_language: "en",
  };
  it("Should delete 'account_confirmation' field with proper id.", async () => {
    let createdUser = await create(newUser1);
    const createdUserId = createdUser.get("_id") as mongoose.Types.ObjectId;
    const createdUserConfirmationId = createdUser.get(
      "account_confirmation._id"
    ) as mongoose.Types.ObjectId;

    await tryConfirmation(createdUserConfirmationId);

    createdUser = (await findAll("id", [createdUserId]))[0];
    const expectedUser = {
      __v: 0,
      _id: expect.any(mongoose.Types.ObjectId),
      first_name: "John",
      last_name: "Doe",
      email_address: "john@doe.com",
      password_hash_and_salt: "Hash and salt",
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "en",
      },
      local_sessions: [],
      last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
    };
    expect(createdUser.toJSON()).toEqual(expectedUser);
  });
  it("Should return the confirmed user.", async () => {
    let createdUser = await create(newUser1);
    const createdUserId = createdUser.get("_id") as mongoose.Types.ObjectId;
    const createdUserConfirmationId = createdUser.get(
      "account_confirmation._id"
    ) as mongoose.Types.ObjectId;

    const confirmedUser = await tryConfirmation(createdUserConfirmationId);

    const expectedUser = {
      __v: 0,
      _id: createdUserId,
      first_name: "John",
      last_name: "Doe",
      email_address: "john@doe.com",
      password_hash_and_salt: "Hash and salt",
      app_settings: {
        _id: expect.any(mongoose.Types.ObjectId),
        app_language: "en",
      },
      local_sessions: [],
      last_user_edit_on: new Date("1970-01-01T00:00:00.000Z"),
    };

    expect(confirmedUser.toJSON()).toEqual(expectedUser);
  });
  it("Should reject if confirmation id does not exist.", async () => {
    await create(newUser1);

    const randomObjectId = new mongoose.Types.ObjectId();
    await expect(tryConfirmation(randomObjectId)).rejects.toThrow(
      "User with confirmation id does not exist."
    );
  });
});
