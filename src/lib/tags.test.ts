import { describe, it, expect } from "vitest";
import { parseTags } from "./tags";

describe("parseTags", () => {
  it("returns empty tags and full text when no hashtags", () => {
    expect(parseTags("comprar leche")).toEqual({ display: "comprar leche", tags: [] });
  });

  it("extracts a single tag", () => {
    expect(parseTags("viaje a París #viajes")).toEqual({ display: "viaje a París", tags: ["viajes"] });
  });

  it("extracts multiple tags", () => {
    expect(parseTags("esto es un item #etiqueta1 #etiqueta2")).toEqual({
      display: "esto es un item",
      tags: ["etiqueta1", "etiqueta2"],
    });
  });

  it("lowercases tags", () => {
    expect(parseTags("algo #Urgente")).toEqual({ display: "algo", tags: ["urgente"] });
  });

  it("handles tags in the middle of text", () => {
    const { display, tags } = parseTags("comprar #super leche");
    expect(tags).toContain("super");
    expect(display).toBe("comprar leche");
  });

  it("handles accented characters in tags", () => {
    const { tags } = parseTags("algo #montaña");
    expect(tags).toContain("montaña");
  });
});
