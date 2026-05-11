import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Counter } from "../src/components/Counter";

describe("Counter", () => {
  it("deve incrementar o contador ao clicar", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    expect(screen.getByText("Contador: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Incrementar" }));

    expect(screen.getByText("Contador: 1")).toBeInTheDocument();
  });

  it("deve incrementar múltiplas vezes", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const button = screen.getByRole("button", { name: "Incrementar" });

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(screen.getByText("Contador: 3")).toBeInTheDocument();
  });
});