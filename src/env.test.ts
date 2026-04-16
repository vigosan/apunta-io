import { describe, expect, it } from "vitest";
import { validateEnv } from "./env";

describe("validateEnv", () => {
  it("returns typed env when DATABASE_URL is valid", () => {
    const result = validateEnv({
      DATABASE_URL: "postgresql://user:pass@host/db",
    });
    expect(result.DATABASE_URL).toBe("postgresql://user:pass@host/db");
  });

  it("throws when DATABASE_URL is missing", () => {
    expect(() => validateEnv({})).toThrow();
  });

  it("throws when DATABASE_URL is not a valid URL", () => {
    expect(() => validateEnv({ DATABASE_URL: "not-a-url" })).toThrow();
  });

  it("throws with a descriptive message when DATABASE_URL is missing", () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
  });
});
