export type CompanyStatus = "Active" | "On Hold" | "Blocked";

export interface CommissionSplit {
  platformPercentage: number;
  companyPercentage: number;
  driverPercentage: number;
  lastUpdated?: string | undefined;
  updatedBy?: string | undefined;
}

export interface Account {
  id: string;
  name: string;
  gstin: string;
  contact: string;
  limit: number; // in lakhs
  outstanding: number;
  overdue: number;
  status: CompanyStatus;
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  fleetCount?: number | undefined;
  primaryRoutes?: string[] | undefined;
  commissionSplit?: CommissionSplit | undefined;
}

export type Company = Account;

export type AccountEventType =
  | "Invoice Raised"
  | "Payment Received"
  | "Credit Limit Changed"
  | "Status Changed"
  | "Reminder Sent"
  | "Commission Split Updated";

export interface AccountEvent {
  id: string;
  accountId: string;
  date: string;
  type: AccountEventType;
  description: string;
  detail?: string | undefined;
  amount?: number | undefined;
}
