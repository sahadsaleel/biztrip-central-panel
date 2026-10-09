import { describe, it, expect } from "vitest";
import { applyPayment, type Invoice } from "./invoices";

const base: Invoice = { id: "X", customer: "C", trip: "T", issued: "", due: "", amount: 1000, paid: 0, status: "Issued" };

describe("simulated invoice payment", () => {
  it("partial payment marks Partially Paid", () => {
    expect(applyPayment(base, 400)).toMatchObject({ paid: 400, status: "Partially Paid" });
  });
  it("full payment marks Paid and never exceeds the invoice amount", () => {
    expect(applyPayment(base, 5000)).toMatchObject({ paid: 1000, status: "Paid" });
  });
});
