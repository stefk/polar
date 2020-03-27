import { isValidExpr } from "../lib";

describe("isValidExpr", () => {
  it("accepts expr if evaluable for x", () => {
    const validExprs = [
      "1",
      "x",
      "x + x",
      "sin(x)",
      "y = x^2"
    ];

    validExprs.forEach(expr =>
      expect(isValidExpr(expr)).toBe(true)
    );
  });

  it("rejects expr if malformed or with unresolved symbols", () => {
    const invalidExprs = [
      "x - y",
      "abc",
      "xyz(x)",
      "x^"
    ];

    invalidExprs.forEach(expr =>
      expect(isValidExpr(expr)).toBe(false)
    );
  });

  it("rejects expr if not evaluable to number", () => {
    const invalidExprs = [
      "",
      "true"
    ];

    invalidExprs.forEach(expr =>
      expect(isValidExpr(expr)).toBe(false)
    );
  });
});

