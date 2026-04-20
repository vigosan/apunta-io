import { describe, expect, it } from "vitest";
import { getPartialPlace, parsePlaces } from "./places";

describe("parsePlaces", () => {
  it("returns empty places and full text when no @places", () => {
    expect(parsePlaces("comprar leche")).toEqual({
      display: "comprar leche",
      places: [],
    });
  });

  it("extracts a single place", () => {
    expect(parsePlaces("visitar @Barcelona")).toEqual({
      display: "visitar",
      places: ["Barcelona"],
    });
  });

  it("extracts a multi-word place", () => {
    expect(parsePlaces("comer en @Nueva York")).toEqual({
      display: "comer en",
      places: ["Nueva York"],
    });
  });

  it("extracts multiple places", () => {
    expect(parsePlaces("viajar @París @Roma")).toEqual({
      display: "viajar",
      places: ["París", "Roma"],
    });
  });

  it("preserves original casing of places", () => {
    expect(parsePlaces("ir a @Buenos Aires")).toEqual({
      display: "ir a",
      places: ["Buenos Aires"],
    });
  });

  it("handles places with accented characters", () => {
    const { places } = parsePlaces("visitar @Montañas");
    expect(places).toContain("Montañas");
  });

  it("handles place in the middle of text", () => {
    const { display, places } = parsePlaces("comer @Tokio hoy");
    expect(places).toContain("Tokio hoy");
    expect(display).toBe("comer");
  });

  it("place at the end with trailing space stops correctly", () => {
    const { display, places } = parsePlaces("restaurante en @Buenos Aires ");
    expect(places).toContain("Buenos Aires");
    expect(display).toBe("restaurante en");
  });
});

describe("getPartialPlace", () => {
  it("returns null when no @ present", () => {
    expect(getPartialPlace("comprar leche")).toBeNull();
  });

  it("returns null when @ is not at the end", () => {
    expect(getPartialPlace("@Barcelona y más texto")).toBeNull();
  });

  it("returns empty string for bare @ at end", () => {
    expect(getPartialPlace("algo @")).toBe("");
  });

  it("returns the partial word after @", () => {
    expect(getPartialPlace("visitar @Bar")).toBe("Bar");
  });

  it("preserves casing of the partial", () => {
    expect(getPartialPlace("ir a @Madr")).toBe("Madr");
  });

  it("returns null when completed place is followed by space", () => {
    expect(getPartialPlace("visitar @Barcelona ")).toBeNull();
  });
});
