import { formatCurrency } from "../src/functions/formatCurrency";

describe("formatCurrency", () => {
  it("deve formatar número como moeda brasileira", () => {
    const result = formatCurrency(10.5);

    expect(result.replace(/\s/g, " ")).toBe("R$ 10,50");
  });
});