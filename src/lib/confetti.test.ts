import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

import confetti from "canvas-confetti";
import { fireConfetti } from "./confetti";

describe("fireConfetti", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fires confetti from bottom-left and bottom-right", () => {
    fireConfetti();
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it("shoots from origin x=0 (left) and x=1 (right)", () => {
    fireConfetti();
    const calls = vi.mocked(confetti).mock.calls;
    const origins = calls.map((c) => c[0]?.origin?.x);
    expect(origins).toContain(0);
    expect(origins).toContain(1);
  });
});
