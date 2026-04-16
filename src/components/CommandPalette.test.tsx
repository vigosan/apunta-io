import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Action } from "./CommandPalette";
import { CommandPalette } from "./CommandPalette";

const actions: Action[] = [
  { id: "copy", label: "Copiar enlace", onSelect: vi.fn() },
  {
    id: "public",
    label: "Hacer pública",
    onSelect: vi.fn(),
  },
  {
    id: "rename",
    label: "Cambiar nombre",
    onSelect: vi.fn(),
  },
];

describe("CommandPalette", () => {
  it("does not render when closed", () => {
    render(<CommandPalette open={false} onClose={vi.fn()} actions={actions} />);
    expect(
      screen.queryByTestId("command-palette-input")
    ).not.toBeInTheDocument();
  });

  it("renders all actions when open", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} actions={actions} />);
    expect(screen.getByTestId("command-palette-input")).toBeInTheDocument();
    expect(screen.getByTestId("command-action-copy")).toBeInTheDocument();
    expect(screen.getByTestId("command-action-public")).toBeInTheDocument();
    expect(screen.getByTestId("command-action-rename")).toBeInTheDocument();
  });

  it("filters actions by query", async () => {
    render(<CommandPalette open={true} onClose={vi.fn()} actions={actions} />);
    await userEvent.type(screen.getByTestId("command-palette-input"), "enla");
    expect(screen.getByTestId("command-action-copy")).toBeInTheDocument();
    expect(
      screen.queryByTestId("command-action-public")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("command-action-rename")
    ).not.toBeInTheDocument();
  });

  it("shows empty state when no actions match", async () => {
    render(<CommandPalette open={true} onClose={vi.fn()} actions={actions} />);
    await userEvent.type(screen.getByTestId("command-palette-input"), "xyz");
    expect(screen.getByTestId("command-empty")).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<CommandPalette open={true} onClose={onClose} actions={actions} />);
    await userEvent.click(screen.getByTestId("command-palette-input"));
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onSelect and onClose when action is clicked", async () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        actions={[{ id: "test", label: "Test", onSelect }]}
      />
    );
    await userEvent.click(screen.getByTestId("command-action-test"));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("cancels focus rAF on rapid open/close", () => {
    const cancelRafSpy = vi.spyOn(globalThis, "cancelAnimationFrame");
    const { rerender } = render(
      <CommandPalette open={false} onClose={vi.fn()} actions={actions} />
    );
    act(() => {
      rerender(
        <CommandPalette open={true} onClose={vi.fn()} actions={actions} />
      );
    });
    act(() => {
      rerender(
        <CommandPalette open={false} onClose={vi.fn()} actions={actions} />
      );
    });
    expect(cancelRafSpy).toHaveBeenCalled();
    cancelRafSpy.mockRestore();
  });

  it("calls onSelect and onClose when Enter is pressed on the first action", async () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        actions={[{ id: "test", label: "Test", onSelect }]}
      />
    );
    await userEvent.click(screen.getByTestId("command-palette-input"));
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
