import setupAndDropTestDB from "../utils/testUtils/setupAndDropTestDB";

setupAndDropTestDB();

describe("Create:", () => {
  it.todo("Should create new user with given credentials.");
  it.todo("Should hash and salt password.");
  it.todo("Should reject with a message when sending mail rejects.");
  it.todo("Should add 'accountConfirmation'.");
});
describe("Email already taken:", () => {
  it.todo("Should reject with a message.");
});
