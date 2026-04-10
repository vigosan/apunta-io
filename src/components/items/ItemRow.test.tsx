import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemRow } from "./ItemRow";

const baseItem = { id: "i1", listId: "l1", text: "Comprar leche", done: false, position: 0, createdAt: new Date(), updatedAt: new Date() };

describe("ItemRow", () => {
  it("renders item text", () => {
    render(<ItemRow item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByTestId("item-text-i1")).toHaveTextContent("Comprar leche");
  });

  it("calls onToggle when checkbox button is clicked", async () => {
    const onToggle = vi.fn();
    render(<ItemRow item={baseItem} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />);
    await userEvent.click(screen.getByTestId("item-checkbox-i1"));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("shows line-through when item is done", () => {
    render(<ItemRow item={{ ...baseItem, done: true }} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByTestId("item-text-i1")).toHaveClass("line-through");
  });

  it("calls onDelete when delete button clicked", async () => {
    const onDelete = vi.fn();
    render(<ItemRow item={baseItem} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />);
    await userEvent.click(screen.getByTestId("item-delete-i1"));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("enters edit mode on double click and calls onEdit on blur", async () => {
    const onEdit = vi.fn();
    render(<ItemRow item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />);
    await userEvent.dblClick(screen.getByTestId("item-text-i1"));
    const input = screen.getByTestId("item-edit-input-i1");
    await userEvent.clear(input);
    await userEvent.type(input, "Comprar pan");
    await userEvent.tab();
    expect(onEdit).toHaveBeenCalledWith("Comprar pan");
  });
});
