import { validate } from "./GlobalFunctions";

describe("validate() utility", () => {
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

    expect(validate("verifyPassword", "secret", msg, "secret")).toBe(true);
    expect(msg).toHaveBeenLastCalledWith("");

    expect(validate("verifyPassword", "nope", msg, "secret")).toBe(false);
    expect(msg).toHaveBeenLastCalledWith("Password doesn't match");
  });
});
