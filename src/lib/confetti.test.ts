import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

import { fireConfetti } from "./confetti";
import confetti from "canvas-confetti";

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
