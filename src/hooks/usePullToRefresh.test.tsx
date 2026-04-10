import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { usePullToRefresh } from "./usePullToRefresh";

function TestComponent({ onRefresh }: { onRefresh: () => Promise<unknown> }) {
  const { containerRef, pullDistance, refreshing } = usePullToRefresh(onRefresh);
  return (
    <div
      ref={containerRef}
      data-testid="container"
      data-pull={pullDistance}
      data-refreshing={String(refreshing)}
    />
  );
}

describe("usePullToRefresh", () => {
  it("starts with pullDistance 0 and not refreshing", () => {
    render(<TestComponent onRefresh={vi.fn().mockResolvedValue(undefined)} />);
    const el = screen.getByTestId("container");
    expect(el.dataset.pull).toBe("0");
    expect(el.dataset.refreshing).toBe("false");
  });

  it("calls onRefresh when pull exceeds threshold", async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(<TestComponent onRefresh={onRefresh} />);
    const el = screen.getByTestId("container");

    act(() => {
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [{ clientY: 0 } as Touch], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchmove", { touches: [{ clientY: 200 } as Touch], bubbles: true, cancelable: true }));
      el.dispatchEvent(new TouchEvent("touchend", { bubbles: true }));
    });

    expect(onRefresh).toHaveBeenCalledOnce();
    await act(async () => {});
    expect(el.dataset.refreshing).toBe("false");
  });

  it("does not call onRefresh when pull is below threshold", () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(<TestComponent onRefresh={onRefresh} />);
    const el = screen.getByTestId("container");

    act(() => {
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [{ clientY: 0 } as Touch], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchmove", { touches: [{ clientY: 10 } as Touch], bubbles: true, cancelable: true }));
      el.dispatchEvent(new TouchEvent("touchend", { bubbles: true }));
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });
});
