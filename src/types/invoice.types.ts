export type InvoiceStatus =
  "Draft" | "Issued" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled";

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
  amount: number; // in rupees
  paid: number;
  status: InvoiceStatus;
  signOff?: TwoStepSignOff | undefined;
  gstin?: string | undefined;
  paymentMethod?: string | undefined;
  notes?: string | undefined;
}

export interface SignOffInput {
  invoiceId: string;
  step: 1 | 2;
  adminId: string;
  adminName: string;
  adminEmail: string;
  role: string;
  note?: string | undefined;
}
