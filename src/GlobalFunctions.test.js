import { validate } from "./GlobalFunctions";

describe("validate() utility", () => {
  const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test-password';

  test("valid and invalid email", () => {
    const msg = jest.fn();

    expect(validate("email", "user@example.com", msg)).toBe(true);
    expect(msg).toHaveBeenLastCalledWith("");

    expect(validate("email", "bad-email", msg)).toBe(false);
    expect(msg).toHaveBeenLastCalledWith("Invalid Email.");
  });

  test("valid and invalid password", () => {
    const msg = jest.fn();

    // valid: meets requirements
    expect(validate("password", "Aa1@abcd", msg)).toBe(true);
    expect(msg).toHaveBeenLastCalledWith("");

    // invalid: too simple
    expect(validate("password", "abc", msg)).toBe(false);
    expect(msg).toHaveBeenLastCalledWith(expect.stringContaining("Password must be at least 6 characters"));
  });

  test("verifyPassword matches and mismatches", () => {
    const msg = jest.fn();

    expect(validate("verifyPassword", TEST_PASSWORD, msg, TEST_PASSWORD)).toBe(true);
    expect(msg).toHaveBeenLastCalledWith("");

    expect(validate("verifyPassword", "nope", msg, TEST_PASSWORD)).toBe(false);
    expect(msg).toHaveBeenLastCalledWith("Password doesn't match");
  });
});
