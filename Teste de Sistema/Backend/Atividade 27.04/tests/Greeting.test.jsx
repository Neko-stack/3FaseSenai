import { render, screen } from "@testing-library/react";
import { Greeting } from "../src/components/Greeting";

describe("Greeting", () => {
  it("deve renderizar a saudação com o nome recebido por props", () => {
    render(<Greeting name="João" />);

    expect(screen.getByText("Olá, João")).toBeInTheDocument();
  });

  it("deve funcionar com outro nome", () => {
    render(<Greeting name="Maria" />);

    expect(screen.getByText("Olá, Maria")).toBeInTheDocument();
  });
});