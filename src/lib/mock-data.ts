export type Stage = "New" | "Contacted" | "Qualified" | "Converted";
export const STAGES: Stage[] = ["New", "Contacted", "Qualified", "Converted"];
export const OWNERS = ["Riya Mehta", "Arjun Nair", "Karan Shah", "Unassigned"];
export const SOURCES = ["Website", "Referral", "Cold Call", "Trade Show", "LinkedIn"];

export interface Enquiry {
  id: string;
  company: string;
  contact: string;
  origin: string;
  destination: string;
  value: number; // lakhs per month
  source: string;
  owner: string;
  stage: Stage;
  lastContact: string;
  nextFollowUp: string;
  createdAt: string;
}

export const enquiries: Enquiry[] = [
  { id: "ENQ-1042", company: "Vertex Retail Supply", contact: "Neha Kapoor", origin: "Delhi", destination: "Jaipur", value: 4.2, source: "Website", owner: "Riya Mehta", stage: "New", lastContact: "2026-10-08", nextFollowUp: "2026-10-10", createdAt: "2026-10-08" },
  { id: "ENQ-1041", company: "Nova Cold Chain", contact: "Rahul Iyer", origin: "Mumbai", destination: "Surat", value: 9.8, source: "Referral", owner: "Arjun Nair", stage: "Contacted", lastContact: "2026-10-07", nextFollowUp: "2026-10-09", createdAt: "2026-10-05" },
  { id: "ENQ-1040", company: "Bluestone Cements", contact: "Suresh Reddy", origin: "Hyderabad", destination: "Warangal", value: 15.4, source: "Trade Show", owner: "Karan Shah", stage: "Qualified", lastContact: "2026-10-06", nextFollowUp: "2026-10-11", createdAt: "2026-10-01" },
  { id: "ENQ-1039", company: "Trident Pharma Distribution", contact: "Anita Thomas", origin: "Kochi", destination: "Coimbatore", value: 2.6, source: "LinkedIn", owner: "Unassigned", stage: "New", lastContact: "2026-10-05", nextFollowUp: "2026-10-09", createdAt: "2026-09-30" },
  { id: "ENQ-1038", company: "Arya Agro Exports", contact: "Vikram Singh", origin: "Kochi", destination: "Delhi", value: 7.1, source: "Cold Call", owner: "Riya Mehta", stage: "Qualified", lastContact: "2026-10-04", nextFollowUp: "2026-10-12", createdAt: "2026-09-28" },
  { id: "ENQ-1037", company: "Orbit Electronics", contact: "Pooja Desai", origin: "Pune", destination: "Bengaluru", value: 5.5, source: "Website", owner: "Unassigned", stage: "Contacted", lastContact: "2026-10-03", nextFollowUp: "2026-10-09", createdAt: "2026-09-26" },
  { id: "ENQ-1036", company: "Sahyadri Textiles", contact: "Manoj Patil", origin: "Ahmedabad", destination: "Mumbai", value: 3.9, source: "Referral", owner: "Arjun Nair", stage: "Contacted", lastContact: "2026-10-02", nextFollowUp: "2026-10-14", createdAt: "2026-09-22" },
  { id: "ENQ-1035", company: "Sharma Logistics Pvt Ltd", contact: "Amit Sharma", origin: "Delhi", destination: "Lucknow", value: 11.2, source: "Referral", owner: "Karan Shah", stage: "Converted", lastContact: "2026-09-29", nextFollowUp: "—", createdAt: "2026-09-15" },
];

export type TripStatus = "Scheduled" | "In Progress" | "Delayed" | "Completed" | "Cancelled";
export const TRIP_STATUSES: TripStatus[] = ["Scheduled", "In Progress", "Delayed", "Completed", "Cancelled"];
export type SLA = "On Track" | "At Risk" | "Breached";
export const DRIVERS = ["Ramesh Kumar", "Sunil Yadav", "Harpreet Singh", "Mohammed Rafi", "Prakash Rao", "Deepak Joshi"];

export interface Trip {
  id: string;
  customer: string;
  type: "FTL" | "PTL" | "Express";
  origin: string;
  destination: string;
  pickup: string;
  eta: string;
  driver: string;
  vehicle: string;
  status: TripStatus;
  sla: SLA;
  progress: number;
}

export const trips: Trip[] = [
  { id: "TRP-2318", customer: "Sharma Logistics Pvt Ltd", type: "FTL", origin: "Delhi", destination: "Lucknow", pickup: "2026-10-08", eta: "2026-10-09", driver: "Ramesh Kumar", vehicle: "DL 01 AB 4521", status: "In Progress", sla: "On Track", progress: 64 },
  { id: "TRP-2317", customer: "Nova Cold Chain", type: "Express", origin: "Mumbai", destination: "Surat", pickup: "2026-10-08", eta: "2026-10-09", driver: "Sunil Yadav", vehicle: "MH 04 CK 8812", status: "Delayed", sla: "At Risk", progress: 41 },
  { id: "TRP-2316", customer: "Bluestone Cements", type: "FTL", origin: "Hyderabad", destination: "Warangal", pickup: "2026-10-07", eta: "2026-10-08", driver: "Prakash Rao", vehicle: "TS 09 EZ 3307", status: "Delayed", sla: "Breached", progress: 78 },
  { id: "TRP-2315", customer: "Vertex Retail Supply", type: "PTL", origin: "Delhi", destination: "Jaipur", pickup: "2026-10-09", eta: "2026-10-10", driver: "Harpreet Singh", vehicle: "HR 26 DK 1190", status: "In Progress", sla: "On Track", progress: 22 },
  { id: "TRP-2314", customer: "Trident Pharma Distribution", type: "Express", origin: "Kochi", destination: "Coimbatore", pickup: "2026-10-10", eta: "2026-10-10", driver: "Mohammed Rafi", vehicle: "KL 07 BQ 6650", status: "Scheduled", sla: "On Track", progress: 0 },
  { id: "TRP-2313", customer: "Arya Agro Exports", type: "FTL", origin: "Kochi", destination: "Delhi", pickup: "2026-10-06", eta: "2026-10-11", driver: "Deepak Joshi", vehicle: "KL 01 AX 2234", status: "In Progress", sla: "At Risk", progress: 55 },
  { id: "TRP-2312", customer: "Sharma Logistics Pvt Ltd", type: "PTL", origin: "Chandigarh", destination: "Delhi", pickup: "2026-10-05", eta: "2026-10-06", driver: "Ramesh Kumar", vehicle: "CH 01 TT 7781", status: "Completed", sla: "On Track", progress: 100 },
  { id: "TRP-2311", customer: "Nova Cold Chain", type: "FTL", origin: "Pune", destination: "Nashik", pickup: "2026-10-11", eta: "2026-10-11", driver: "Unassigned", vehicle: "—", status: "Scheduled", sla: "On Track", progress: 0 },
  { id: "TRP-2310", customer: "Bluestone Cements", type: "FTL", origin: "Chennai", destination: "Bengaluru", pickup: "2026-10-08", eta: "2026-10-09", driver: "Prakash Rao", vehicle: "TN 22 HL 9043", status: "In Progress", sla: "On Track", progress: 70 },
];

export interface Account {
  id: string;
  name: string;
  gstin: string;
  contact: string;
  limit: number; // lakhs
  outstanding: number;
  overdue: number;
  status: "Active" | "On Hold" | "Blocked";
}

export const accounts: Account[] = [
  { id: "ACC-001", name: "Sharma Logistics Pvt Ltd", gstin: "07AABCS1429B1Z5", contact: "Amit Sharma", limit: 50, outstanding: 46.5, overdue: 12.4, status: "Active" },
  { id: "ACC-002", name: "Nova Cold Chain", gstin: "27AADCN5521K1Z2", contact: "Rahul Iyer", limit: 35, outstanding: 31.2, overdue: 8.1, status: "On Hold" },
  { id: "ACC-003", name: "Bluestone Cements", gstin: "36AAECB7710L1Z9", contact: "Suresh Reddy", limit: 60, outstanding: 38.4, overdue: 0, status: "Active" },
  { id: "ACC-004", name: "Vertex Retail Supply", gstin: "08AAFCV3302M1Z1", contact: "Neha Kapoor", limit: 20, outstanding: 18.9, overdue: 4.6, status: "Active" },
  { id: "ACC-005", name: "Trident Pharma Distribution", gstin: "32AAGCT9910P1Z7", contact: "Anita Thomas", limit: 15, outstanding: 7.0, overdue: 0, status: "Active" },
];

export const fmtL = (v: number) => `₹${v.toFixed(1)} L`;
export const utilisation = (a: Account) => Math.round((a.outstanding / a.limit) * 100);

export type AccountEventType = "Invoice Raised" | "Payment Received" | "Credit Limit Changed" | "Status Changed" | "Reminder Sent";

export interface AccountEvent {
  id: string;
  accountId: string;
  date: string;
  type: AccountEventType;
  detail: string;
  amount?: number; // lakhs, positive = debit, negative = credit
}

export const accountEvents: AccountEvent[] = [
  { id: "EVT-01", accountId: "ACC-001", date: "2026-10-08", type: "Invoice Raised", detail: "INV-2081 · Delhi → Lucknow FTL", amount: 3.4 },
  { id: "EVT-02", accountId: "ACC-001", date: "2026-10-06", type: "Payment Received", detail: "NEFT · UTR HDFC0001234", amount: -6.0 },
  { id: "EVT-03", accountId: "ACC-001", date: "2026-10-02", type: "Reminder Sent", detail: "Overdue reminder for ₹12.4 L" },
  { id: "EVT-04", accountId: "ACC-001", date: "2026-09-20", type: "Credit Limit Changed", detail: "Limit raised ₹40 L → ₹50 L" },
  { id: "EVT-05", accountId: "ACC-002", date: "2026-10-07", type: "Status Changed", detail: "Placed On Hold — overdue ₹8.1 L" },
  { id: "EVT-06", accountId: "ACC-002", date: "2026-10-05", type: "Invoice Raised", detail: "INV-2079 · Mumbai → Surat Express", amount: 2.1 },
  { id: "EVT-07", accountId: "ACC-002", date: "2026-09-28", type: "Payment Received", detail: "UPI · Ref 88231045", amount: -4.5 },
  { id: "EVT-08", accountId: "ACC-003", date: "2026-10-06", type: "Invoice Raised", detail: "INV-2077 · Hyderabad → Warangal FTL", amount: 5.2 },
  { id: "EVT-09", accountId: "ACC-003", date: "2026-10-01", type: "Payment Received", detail: "RTGS · UTR SBIN0098712", amount: -10.0 },
  { id: "EVT-10", accountId: "ACC-004", date: "2026-10-04", type: "Reminder Sent", detail: "Overdue reminder for ₹4.6 L" },
  { id: "EVT-11", accountId: "ACC-004", date: "2026-09-30", type: "Invoice Raised", detail: "INV-2072 · Delhi → Jaipur PTL", amount: 1.8 },
  { id: "EVT-12", accountId: "ACC-005", date: "2026-10-03", type: "Payment Received", detail: "NEFT · UTR ICICI005566", amount: -3.0 },
  { id: "EVT-13", accountId: "ACC-005", date: "2026-09-25", type: "Credit Limit Changed", detail: "Limit raised ₹10 L → ₹15 L" },
];
