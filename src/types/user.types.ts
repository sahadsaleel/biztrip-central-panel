export type UserRole =
  | "Super Admin"
  | "Ops Dispatcher"
  | "Finance & Invoicing"
  | "Sales / CRM"
  | "Fleet Manager"
  | "Support Specialist"
  | "Read Only";

export type AdminSimulatedRole = "SUPER_ADMIN" | "DISPATCHER" | "BILLING_ADMIN" | "SALES_ADMIN";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: "Operations" | "Finance" | "Sales" | "Fleet" | "Management" | "Support";
  status: "Active" | "Inactive" | "Pending";
  lastActive: string;
  phone: string;
  avatar?: string;
}

export interface AdminRoleConfig {
  code: AdminSimulatedRole;
  label: string;
  description: string;
  permissions: string[];
}
