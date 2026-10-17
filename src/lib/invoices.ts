export type InvoiceStatus =
  "Draft" | "Issued" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled";
export const INVOICE_STATUSES: InvoiceStatus[] = [
  "Draft",
  "Issued",
  "Partially Paid",
  "Paid",
  "Overdue",
  "Cancelled",
];

export interface AdminSignOff {
  adminId: string;
  adminName: string;
  adminEmail: string;
  role: string;
  signedAt: string;
  note?: string | undefined;
}

export interface TwoStepSignOff {
  signOff1?: AdminSignOff | undefined;
  signOff2?: AdminSignOff | undefined;
  status: "Pending First Approval" | "Pending Second Approval" | "Fully Approved";
}

export interface Invoice {
  id: string;
  customer: string;
  trip: string;
  issued: string;
  due: string;
  amount: number; // rupees
  paid: number;
  status: InvoiceStatus;
  signOff?: TwoStepSignOff | undefined;
  gstin?: string | undefined;
  paymentMethod?: string | undefined;
  notes?: string | undefined;
}

export const invoices: Invoice[] = [
  {
    id: "INV-24-0187",
    customer: "Sharma Logistics Pvt Ltd",
    trip: "TRP-2312",
    issued: "2026-09-12",
    due: "2026-09-27",
    amount: 1240000,
    paid: 0,
    status: "Overdue",
  },
  {
    id: "INV-24-0188",
    customer: "Nova Cold Chain",
    trip: "TRP-2317",
    issued: "2026-09-20",
    due: "2026-10-05",
    amount: 865000,
    paid: 400000,
    status: "Partially Paid",
  },
  {
    id: "INV-24-0189",
    customer: "Bluestone Cements",
    trip: "TRP-2310",
    issued: "2026-09-25",
    due: "2026-10-10",
    amount: 1520000,
    paid: 1520000,
    status: "Paid",
  },
  {
    id: "INV-24-0190",
    customer: "Vertex Retail Supply",
    trip: "TRP-2315",
    issued: "2026-10-01",
    due: "2026-10-16",
    amount: 412000,
    paid: 0,
    status: "Issued",
  },
  {
    id: "INV-24-0191",
    customer: "Trident Pharma Distribution",
    trip: "TRP-2314",
    issued: "2026-10-08",
    due: "2026-10-23",
    amount: 268000,
    paid: 0,
    status: "Draft",
  },
  {
    id: "INV-24-0192",
    customer: "Arya Agro Exports",
    trip: "TRP-2313",
    issued: "2026-10-03",
    due: "2026-10-18",
    amount: 735000,
    paid: 735000,
    status: "Paid",
  },
  {
    id: "INV-24-0193",
    customer: "Sharma Logistics Pvt Ltd",
    trip: "TRP-2318",
    issued: "2026-10-05",
    due: "2026-10-20",
    amount: 980000,
    paid: 0,
    status: "Issued",
  },
  {
    id: "INV-24-0194",
    customer: "Nova Cold Chain",
    trip: "TRP-2311",
    issued: "2026-09-02",
    due: "2026-09-17",
    amount: 154000,
    paid: 0,
    status: "Cancelled",
  },
];

export const inr = (v: number) => "₹" + v.toLocaleString("en-IN");

export function applyPayment(inv: Invoice, amount: number): Invoice {
  const paid = Math.min(inv.amount, inv.paid + Math.max(0, amount));
  return {
    ...inv,
    paid,
    status: paid >= inv.amount ? "Paid" : paid > 0 ? "Partially Paid" : inv.status,
  };
}
