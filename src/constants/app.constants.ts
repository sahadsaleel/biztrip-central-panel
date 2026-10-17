import type { AdminRoleConfig, AdminSimulatedRole } from "@/types/user.types";
import type { CommissionSplit } from "@/types/company.types";

export const APP_NAME = "HireD Admin Portal";
export const COMPANY_NAME = "HireD Logistics & Freight Network";

export const DEFAULT_COMMISSION_SPLIT: CommissionSplit = {
  platformPercentage: 15,
  companyPercentage: 70,
  driverPercentage: 15,
  lastUpdated: "2026-10-01",
  updatedBy: "System Default",
};

export const SIMULATED_ADMIN_ROLES: AdminRoleConfig[] = [
  {
    code: "SUPER_ADMIN",
    label: "Super Admin",
    description:
      "Full system permissions, user administration, financial approval & commission splits",
    permissions: ["all"],
  },
  {
    code: "DISPATCHER",
    label: "Ops Dispatcher",
    description: "Trip scheduling, driver assignment, vehicle routing and SLA monitoring",
    permissions: ["trips:write", "drivers:read", "enquiries:read"],
  },
  {
    code: "BILLING_ADMIN",
    label: "Billing / Finance Admin",
    description:
      "Invoice generation, payment reconciliations, sign-off workflow & credit monitoring",
    permissions: ["invoices:write", "accounts:write", "signoff:manage"],
  },
  {
    code: "SALES_ADMIN",
    label: "Sales / CRM Admin",
    description: "Manual order intake, enquiry qualification, client onboarding & conversion",
    permissions: ["enquiries:write", "accounts:read"],
  },
];

export const VEHICLE_CLASSES = [
  "Tata Ace",
  "14ft Eicher",
  "20ft Container",
  "32ft Multi-Axle",
  "Trailer 40ft",
] as const;

export const FUEL_TYPES = ["Diesel", "CNG", "Electric"] as const;

export const REJECTION_REASONS = [
  "Out of operational route coverage",
  "Vehicle class capacity unavailable",
  "Commercial rate disagreement",
  "Customer cancelled request",
  "Credit limit breached / Payment overdue",
  "Invalid cargo classification / Hazmat not supported",
  "Other operational constraints",
] as const;

export const KYC_DOCUMENT_TYPES = [
  "Commercial Driving Licence",
  "Aadhaar Card",
  "Police Clearance Certificate",
  "Commercial Badge",
] as const;
