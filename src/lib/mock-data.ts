export type Stage = "New" | "Contacted" | "Qualified" | "Converted" | "Rejected";
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
  phone?: string | undefined;
  cargoType?: string | undefined;
  vehicleRequirement?: string | undefined;
  notes?: string | undefined;
  rejectionReason?: string | undefined;
  rejectedAt?: string | undefined;
}

export const enquiries: Enquiry[] = [
  {
    id: "ENQ-1042",
    company: "Vertex Retail Supply",
    contact: "Neha Kapoor",
    origin: "Delhi",
    destination: "Jaipur",
    value: 4.2,
    source: "Website",
    owner: "Riya Mehta",
    stage: "New",
    lastContact: "2026-10-08",
    nextFollowUp: "2026-10-10",
    createdAt: "2026-10-08",
  },
  {
    id: "ENQ-1041",
    company: "Nova Cold Chain",
    contact: "Rahul Iyer",
    origin: "Mumbai",
    destination: "Surat",
    value: 9.8,
    source: "Referral",
    owner: "Arjun Nair",
    stage: "Contacted",
    lastContact: "2026-10-07",
    nextFollowUp: "2026-10-09",
    createdAt: "2026-10-05",
  },
  {
    id: "ENQ-1040",
    company: "Bluestone Cements",
    contact: "Suresh Reddy",
    origin: "Hyderabad",
    destination: "Warangal",
    value: 15.4,
    source: "Trade Show",
    owner: "Karan Shah",
    stage: "Qualified",
    lastContact: "2026-10-06",
    nextFollowUp: "2026-10-11",
    createdAt: "2026-10-01",
  },
  {
    id: "ENQ-1039",
    company: "Trident Pharma Distribution",
    contact: "Anita Thomas",
    origin: "Kochi",
    destination: "Coimbatore",
    value: 2.6,
    source: "LinkedIn",
    owner: "Unassigned",
    stage: "New",
    lastContact: "2026-10-05",
    nextFollowUp: "2026-10-09",
    createdAt: "2026-09-30",
  },
  {
    id: "ENQ-1038",
    company: "Arya Agro Exports",
    contact: "Vikram Singh",
    origin: "Kochi",
    destination: "Delhi",
    value: 7.1,
    source: "Cold Call",
    owner: "Riya Mehta",
    stage: "Qualified",
    lastContact: "2026-10-04",
    nextFollowUp: "2026-10-12",
    createdAt: "2026-09-28",
  },
  {
    id: "ENQ-1037",
    company: "Orbit Electronics",
    contact: "Pooja Desai",
    origin: "Pune",
    destination: "Bengaluru",
    value: 5.5,
    source: "Website",
    owner: "Unassigned",
    stage: "Contacted",
    lastContact: "2026-10-03",
    nextFollowUp: "2026-10-09",
    createdAt: "2026-09-26",
  },
  {
    id: "ENQ-1036",
    company: "Sahyadri Textiles",
    contact: "Manoj Patil",
    origin: "Ahmedabad",
    destination: "Mumbai",
    value: 3.9,
    source: "Referral",
    owner: "Arjun Nair",
    stage: "Contacted",
    lastContact: "2026-10-02",
    nextFollowUp: "2026-10-14",
    createdAt: "2026-09-22",
  },
  {
    id: "ENQ-1035",
    company: "Sharma Logistics Pvt Ltd",
    contact: "Amit Sharma",
    origin: "Delhi",
    destination: "Lucknow",
    value: 11.2,
    source: "Referral",
    owner: "Karan Shah",
    stage: "Converted",
    lastContact: "2026-09-29",
    nextFollowUp: "—",
    createdAt: "2026-09-15",
  },
];

export type TripStatus = "Scheduled" | "In Progress" | "Delayed" | "Completed" | "Cancelled";
export const TRIP_STATUSES: TripStatus[] = [
  "Scheduled",
  "In Progress",
  "Delayed",
  "Completed",
  "Cancelled",
];
export type SLA = "On Track" | "At Risk" | "Breached";
export const DRIVERS = [
  "Ramesh Kumar",
  "Sunil Yadav",
  "Harpreet Singh",
  "Mohammed Rafi",
  "Prakash Rao",
  "Deepak Joshi",
];

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
  {
    id: "TRP-2318",
    customer: "Sharma Logistics Pvt Ltd",
    type: "FTL",
    origin: "Delhi",
    destination: "Lucknow",
    pickup: "2026-10-08",
    eta: "2026-10-09",
    driver: "Ramesh Kumar",
    vehicle: "DL 01 AB 4521",
    status: "In Progress",
    sla: "On Track",
    progress: 64,
  },
  {
    id: "TRP-2317",
    customer: "Nova Cold Chain",
    type: "Express",
    origin: "Mumbai",
    destination: "Surat",
    pickup: "2026-10-08",
    eta: "2026-10-09",
    driver: "Sunil Yadav",
    vehicle: "MH 04 CK 8812",
    status: "Delayed",
    sla: "At Risk",
    progress: 41,
  },
  {
    id: "TRP-2316",
    customer: "Bluestone Cements",
    type: "FTL",
    origin: "Hyderabad",
    destination: "Warangal",
    pickup: "2026-10-07",
    eta: "2026-10-08",
    driver: "Prakash Rao",
    vehicle: "TS 09 EZ 3307",
    status: "Delayed",
    sla: "Breached",
    progress: 78,
  },
  {
    id: "TRP-2315",
    customer: "Vertex Retail Supply",
    type: "PTL",
    origin: "Delhi",
    destination: "Jaipur",
    pickup: "2026-10-09",
    eta: "2026-10-10",
    driver: "Harpreet Singh",
    vehicle: "HR 26 DK 1190",
    status: "In Progress",
    sla: "On Track",
    progress: 22,
  },
  {
    id: "TRP-2314",
    customer: "Trident Pharma Distribution",
    type: "Express",
    origin: "Kochi",
    destination: "Coimbatore",
    pickup: "2026-10-10",
    eta: "2026-10-10",
    driver: "Mohammed Rafi",
    vehicle: "KL 07 BQ 6650",
    status: "Scheduled",
    sla: "On Track",
    progress: 0,
  },
  {
    id: "TRP-2313",
    customer: "Arya Agro Exports",
    type: "FTL",
    origin: "Kochi",
    destination: "Delhi",
    pickup: "2026-10-06",
    eta: "2026-10-11",
    driver: "Deepak Joshi",
    vehicle: "KL 01 AX 2234",
    status: "In Progress",
    sla: "At Risk",
    progress: 55,
  },
  {
    id: "TRP-2312",
    customer: "Sharma Logistics Pvt Ltd",
    type: "PTL",
    origin: "Chandigarh",
    destination: "Delhi",
    pickup: "2026-10-05",
    eta: "2026-10-06",
    driver: "Ramesh Kumar",
    vehicle: "CH 01 TT 7781",
    status: "Completed",
    sla: "On Track",
    progress: 100,
  },
  {
    id: "TRP-2311",
    customer: "Nova Cold Chain",
    type: "FTL",
    origin: "Pune",
    destination: "Nashik",
    pickup: "2026-10-11",
    eta: "2026-10-11",
    driver: "Unassigned",
    vehicle: "—",
    status: "Scheduled",
    sla: "On Track",
    progress: 0,
  },
  {
    id: "TRP-2310",
    customer: "Bluestone Cements",
    type: "FTL",
    origin: "Chennai",
    destination: "Bengaluru",
    pickup: "2026-10-08",
    eta: "2026-10-09",
    driver: "Prakash Rao",
    vehicle: "TN 22 HL 9043",
    status: "In Progress",
    sla: "On Track",
    progress: 70,
  },
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
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  fleetCount?: number | undefined;
  primaryRoutes?: string[] | undefined;
  commissionSplit?:
    | {
        platformPercentage: number;
        companyPercentage: number;
        driverPercentage: number;
        lastUpdated?: string | undefined;
        updatedBy?: string | undefined;
      }
    | undefined;
}

export const accounts: Account[] = [
  {
    id: "ACC-001",
    name: "Sharma Logistics Pvt Ltd",
    gstin: "07AABCS1429B1Z5",
    contact: "Amit Sharma",
    limit: 50,
    outstanding: 46.5,
    overdue: 12.4,
    status: "Active",
  },
  {
    id: "ACC-002",
    name: "Nova Cold Chain",
    gstin: "27AADCN5521K1Z2",
    contact: "Rahul Iyer",
    limit: 35,
    outstanding: 31.2,
    overdue: 8.1,
    status: "On Hold",
  },
  {
    id: "ACC-003",
    name: "Bluestone Cements",
    gstin: "36AAECB7710L1Z9",
    contact: "Suresh Reddy",
    limit: 60,
    outstanding: 38.4,
    overdue: 0,
    status: "Active",
  },
  {
    id: "ACC-004",
    name: "Vertex Retail Supply",
    gstin: "08AAFCV3302M1Z1",
    contact: "Neha Kapoor",
    limit: 20,
    outstanding: 18.9,
    overdue: 4.6,
    status: "Active",
  },
  {
    id: "ACC-005",
    name: "Trident Pharma Distribution",
    gstin: "32AAGCT9910P1Z7",
    contact: "Anita Thomas",
    limit: 15,
    outstanding: 7.0,
    overdue: 0,
    status: "Active",
  },
];

export const fmtL = (v: number) => `₹${v.toFixed(1)} L`;
export const utilisation = (a: Account) => Math.round((a.outstanding / a.limit) * 100);

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
  description?: string;
  detail: string;
  amount?: number; // lakhs, positive = debit, negative = credit
}

export const accountEvents: AccountEvent[] = [
  {
    id: "EVT-01",
    accountId: "ACC-001",
    date: "2026-10-08",
    type: "Invoice Raised",
    detail: "INV-2081 · Delhi → Lucknow FTL",
    amount: 3.4,
  },
  {
    id: "EVT-02",
    accountId: "ACC-001",
    date: "2026-10-06",
    type: "Payment Received",
    detail: "NEFT · UTR HDFC0001234",
    amount: -6.0,
  },
  {
    id: "EVT-03",
    accountId: "ACC-001",
    date: "2026-10-02",
    type: "Reminder Sent",
    detail: "Overdue reminder for ₹12.4 L",
  },
  {
    id: "EVT-04",
    accountId: "ACC-001",
    date: "2026-09-20",
    type: "Credit Limit Changed",
    detail: "Limit raised ₹40 L → ₹50 L",
  },
  {
    id: "EVT-05",
    accountId: "ACC-002",
    date: "2026-10-07",
    type: "Status Changed",
    detail: "Placed On Hold — overdue ₹8.1 L",
  },
  {
    id: "EVT-06",
    accountId: "ACC-002",
    date: "2026-10-05",
    type: "Invoice Raised",
    detail: "INV-2079 · Mumbai → Surat Express",
    amount: 2.1,
  },
  {
    id: "EVT-07",
    accountId: "ACC-002",
    date: "2026-09-28",
    type: "Payment Received",
    detail: "UPI · Ref 88231045",
    amount: -4.5,
  },
  {
    id: "EVT-08",
    accountId: "ACC-003",
    date: "2026-10-06",
    type: "Invoice Raised",
    detail: "INV-2077 · Hyderabad → Warangal FTL",
    amount: 5.2,
  },
  {
    id: "EVT-09",
    accountId: "ACC-003",
    date: "2026-10-01",
    type: "Payment Received",
    detail: "RTGS · UTR SBIN0098712",
    amount: -10.0,
  },
  {
    id: "EVT-10",
    accountId: "ACC-004",
    date: "2026-10-04",
    type: "Reminder Sent",
    detail: "Overdue reminder for ₹4.6 L",
  },
  {
    id: "EVT-11",
    accountId: "ACC-004",
    date: "2026-09-30",
    type: "Invoice Raised",
    detail: "INV-2072 · Delhi → Jaipur PTL",
    amount: 1.8,
  },
  {
    id: "EVT-12",
    accountId: "ACC-005",
    date: "2026-10-03",
    type: "Payment Received",
    detail: "NEFT · UTR ICICI005566",
    amount: -3.0,
  },
  {
    id: "EVT-13",
    accountId: "ACC-005",
    date: "2026-09-25",
    type: "Credit Limit Changed",
    detail: "Limit raised ₹10 L → ₹15 L",
  },
];

/* -------------------------------------------------------------------------- */
/* DRIVERS & FLEET                                                            */
/* -------------------------------------------------------------------------- */

export type KYCStatus = "Verified" | "Pending Review" | "Rejected" | "Under Verification";

export interface KYCDocument {
  id: string;
  type: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  verified: boolean;
  fileUrl?: string | undefined;
  previewUrl?: string | undefined;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  assignedVehicle: string;
  currentTrip: string;
  availability: "Available" | "On Trip" | "Off Duty" | "Inactive";
  licenseExpiry: string;
  experienceYears: number;
  rating: number;
  kycStatus?: KYCStatus | undefined;
  kycDocuments?: KYCDocument[] | undefined;
  vehicleClassPermits?: string[] | undefined;
  rejectionReason?: string | undefined;
  reviewedBy?: string | undefined;
  reviewedAt?: string | undefined;
}

export const drivers: Driver[] = [
  {
    id: "DRV-101",
    name: "Ramesh Kumar",
    phone: "+91 98110 44210",
    assignedVehicle: "DL 01 AB 4521",
    currentTrip: "TRP-2318",
    availability: "On Trip",
    licenseExpiry: "2028-04-15",
    experienceYears: 8,
    rating: 4.8,
  },
  {
    id: "DRV-102",
    name: "Sunil Yadav",
    phone: "+91 98220 77144",
    assignedVehicle: "MH 04 CK 8812",
    currentTrip: "TRP-2317",
    availability: "On Trip",
    licenseExpiry: "2027-11-20",
    experienceYears: 6,
    rating: 4.5,
  },
  {
    id: "DRV-103",
    name: "Prakash Rao",
    phone: "+91 94440 22918",
    assignedVehicle: "TS 09 EZ 3307",
    currentTrip: "TRP-2316",
    availability: "On Trip",
    licenseExpiry: "2026-12-10",
    experienceYears: 10,
    rating: 4.9,
  },
  {
    id: "DRV-104",
    name: "Harpreet Singh",
    phone: "+91 98140 66320",
    assignedVehicle: "HR 26 DK 1190",
    currentTrip: "TRP-2315",
    availability: "On Trip",
    licenseExpiry: "2029-01-25",
    experienceYears: 7,
    rating: 4.7,
  },
  {
    id: "DRV-105",
    name: "Mohammed Rafi",
    phone: "+91 98470 55190",
    assignedVehicle: "KL 07 BQ 6650",
    currentTrip: "TRP-2314",
    availability: "Available",
    licenseExpiry: "2027-08-30",
    experienceYears: 5,
    rating: 4.6,
  },
  {
    id: "DRV-106",
    name: "Deepak Joshi",
    phone: "+91 98200 11488",
    assignedVehicle: "KL 01 AX 2234",
    currentTrip: "TRP-2313",
    availability: "On Trip",
    licenseExpiry: "2028-09-14",
    experienceYears: 9,
    rating: 4.7,
  },
  {
    id: "DRV-107",
    name: "Gurpreet Dhillon",
    phone: "+91 98720 33110",
    assignedVehicle: "PB 10 CG 5512",
    currentTrip: "—",
    availability: "Available",
    licenseExpiry: "2028-06-18",
    experienceYears: 6,
    rating: 4.8,
  },
  {
    id: "DRV-108",
    name: "Vikas Patil",
    phone: "+91 98230 99420",
    assignedVehicle: "MH 12 QX 4401",
    currentTrip: "—",
    availability: "Available",
    licenseExpiry: "2027-03-22",
    experienceYears: 4,
    rating: 4.4,
  },
  {
    id: "DRV-109",
    name: "Manoj Tiwari",
    phone: "+91 94150 88290",
    assignedVehicle: "UP 32 BK 7719",
    currentTrip: "—",
    availability: "Available",
    licenseExpiry: "2026-11-05",
    experienceYears: 11,
    rating: 4.9,
  },
  {
    id: "DRV-110",
    name: "Suresh Babu",
    phone: "+91 98480 11928",
    assignedVehicle: "AP 09 TY 2290",
    currentTrip: "—",
    availability: "Available",
    licenseExpiry: "2029-05-12",
    experienceYears: 5,
    rating: 4.5,
  },
  {
    id: "DRV-111",
    name: "Anand Verma",
    phone: "+91 98100 55432",
    assignedVehicle: "RJ 14 GB 9012",
    currentTrip: "—",
    availability: "Off Duty",
    licenseExpiry: "2027-10-18",
    experienceYears: 3,
    rating: 4.3,
  },
  {
    id: "DRV-112",
    name: "Kishore Sen",
    phone: "+91 98300 44109",
    assignedVehicle: "WB 02 CZ 3318",
    currentTrip: "—",
    availability: "Inactive",
    licenseExpiry: "2026-08-15",
    experienceYears: 12,
    rating: 4.1,
  },
];

export interface Vehicle {
  id: string;
  regNumber: string;
  type: "20ft Container" | "32ft Multi-Axle" | "14ft Eicher" | "Tata Ace" | "Trailer 40ft";
  capacity: string;
  assignedDriver: string;
  currentTrip: string;
  availability: "Available" | "On Trip" | "Maintenance" | "Inactive";
  documentExpiry: string;
  fuelType: "Diesel" | "CNG" | "Electric";
}

export const vehicles: Vehicle[] = [
  {
    id: "VEH-201",
    regNumber: "DL 01 AB 4521",
    type: "32ft Multi-Axle",
    capacity: "18 Tonnes",
    assignedDriver: "Ramesh Kumar",
    currentTrip: "TRP-2318",
    availability: "On Trip",
    documentExpiry: "2027-05-20",
    fuelType: "Diesel",
  },
  {
    id: "VEH-202",
    regNumber: "MH 04 CK 8812",
    type: "20ft Container",
    capacity: "9 Tonnes",
    assignedDriver: "Sunil Yadav",
    currentTrip: "TRP-2317",
    availability: "On Trip",
    documentExpiry: "2027-09-12",
    fuelType: "Diesel",
  },
  {
    id: "VEH-203",
    regNumber: "TS 09 EZ 3307",
    type: "32ft Multi-Axle",
    capacity: "22 Tonnes",
    assignedDriver: "Prakash Rao",
    currentTrip: "TRP-2316",
    availability: "On Trip",
    documentExpiry: "2026-11-28",
    fuelType: "Diesel",
  },
  {
    id: "VEH-204",
    regNumber: "HR 26 DK 1190",
    type: "14ft Eicher",
    capacity: "5 Tonnes",
    assignedDriver: "Harpreet Singh",
    currentTrip: "TRP-2315",
    availability: "On Trip",
    documentExpiry: "2028-03-10",
    fuelType: "CNG",
  },
  {
    id: "VEH-205",
    regNumber: "KL 07 BQ 6650",
    type: "20ft Container",
    capacity: "9 Tonnes",
    assignedDriver: "Mohammed Rafi",
    currentTrip: "TRP-2314",
    availability: "Available",
    documentExpiry: "2027-12-04",
    fuelType: "Diesel",
  },
  {
    id: "VEH-206",
    regNumber: "KL 01 AX 2234",
    type: "32ft Multi-Axle",
    capacity: "20 Tonnes",
    assignedDriver: "Deepak Joshi",
    currentTrip: "TRP-2313",
    availability: "On Trip",
    documentExpiry: "2027-08-15",
    fuelType: "Diesel",
  },
  {
    id: "VEH-207",
    regNumber: "PB 10 CG 5512",
    type: "Trailer 40ft",
    capacity: "30 Tonnes",
    assignedDriver: "Gurpreet Dhillon",
    currentTrip: "—",
    availability: "Available",
    documentExpiry: "2028-02-18",
    fuelType: "Diesel",
  },
  {
    id: "VEH-208",
    regNumber: "MH 12 QX 4401",
    type: "14ft Eicher",
    capacity: "6 Tonnes",
    assignedDriver: "Vikas Patil",
    currentTrip: "—",
    availability: "Available",
    documentExpiry: "2027-04-30",
    fuelType: "CNG",
  },
  {
    id: "VEH-209",
    regNumber: "UP 32 BK 7719",
    type: "Tata Ace",
    capacity: "1.5 Tonnes",
    assignedDriver: "Manoj Tiwari",
    currentTrip: "—",
    availability: "Maintenance",
    documentExpiry: "2026-10-31",
    fuelType: "CNG",
  },
  {
    id: "VEH-210",
    regNumber: "WB 02 CZ 3318",
    type: "20ft Container",
    capacity: "8.5 Tonnes",
    assignedDriver: "Kishore Sen",
    currentTrip: "—",
    availability: "Inactive",
    documentExpiry: "2026-07-10",
    fuelType: "Diesel",
  },
];

/* -------------------------------------------------------------------------- */
/* USERS & ROLES                                                              */
/* -------------------------------------------------------------------------- */

export type UserRole =
  "Super Admin" | "Admin / Ops" | "Finance" | "Sales / CRM" | "Trip Manager" | "Read Only";

export const USER_ROLES: UserRole[] = [
  "Super Admin",
  "Admin / Ops",
  "Finance",
  "Sales / CRM",
  "Trip Manager",
  "Read Only",
];

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: "Operations" | "Fleet" | "Sales" | "Finance" | "Executive";
  status: "Active" | "Pending" | "Inactive";
  lastActive: string;
  phone: string;
}

export const usersList: AppUser[] = [
  {
    id: "USR-001",
    name: "Rohan Malhotra",
    email: "rohan.m@hired.in",
    role: "Super Admin",
    department: "Executive",
    status: "Active",
    lastActive: "Just now",
    phone: "+91 98111 00001",
  },
  {
    id: "USR-002",
    name: "Aditi Sen",
    email: "aditi.sen@hired.in",
    role: "Admin / Ops",
    department: "Operations",
    status: "Active",
    lastActive: "5 mins ago",
    phone: "+91 98111 00002",
  },
  {
    id: "USR-003",
    name: "Karan Shah",
    email: "karan.s@hired.in",
    role: "Sales / CRM",
    department: "Sales",
    status: "Active",
    lastActive: "15 mins ago",
    phone: "+91 98111 00003",
  },
  {
    id: "USR-004",
    name: "Riya Mehta",
    email: "riya.m@hired.in",
    role: "Sales / CRM",
    department: "Sales",
    status: "Active",
    lastActive: "1 hour ago",
    phone: "+91 98111 00004",
  },
  {
    id: "USR-005",
    name: "Arjun Nair",
    email: "arjun.n@hired.in",
    role: "Sales / CRM",
    department: "Sales",
    status: "Active",
    lastActive: "2 hours ago",
    phone: "+91 98111 00005",
  },
  {
    id: "USR-006",
    name: "Pooja Varma",
    email: "pooja.v@hired.in",
    role: "Finance",
    department: "Finance",
    status: "Active",
    lastActive: "35 mins ago",
    phone: "+91 98111 00006",
  },
  {
    id: "USR-007",
    name: "Vikram Batra",
    email: "vikram.b@hired.in",
    role: "Trip Manager",
    department: "Fleet",
    status: "Active",
    lastActive: "4 hours ago",
    phone: "+91 98111 00007",
  },
  {
    id: "USR-008",
    name: "Sneha Reddy",
    email: "sneha.r@hired.in",
    role: "Trip Manager",
    department: "Operations",
    status: "Active",
    lastActive: "Yesterday",
    phone: "+91 98111 00008",
  },
  {
    id: "USR-009",
    name: "Siddharth Roy",
    email: "siddharth.r@hired.in",
    role: "Read Only",
    department: "Executive",
    status: "Active",
    lastActive: "2 days ago",
    phone: "+91 98111 00009",
  },
  {
    id: "USR-010",
    name: "Gaurav Chawla",
    email: "gaurav.c@hired.in",
    role: "Finance",
    department: "Finance",
    status: "Pending",
    lastActive: "Invited 1d ago",
    phone: "+91 98111 00010",
  },
  {
    id: "USR-011",
    name: "Meera Krishnan",
    email: "meera.k@hired.in",
    role: "Sales / CRM",
    department: "Sales",
    status: "Pending",
    lastActive: "Invited 3d ago",
    phone: "+91 98111 00011",
  },
  {
    id: "USR-012",
    name: "Devendra Rawat",
    email: "devendra.r@hired.in",
    role: "Trip Manager",
    department: "Operations",
    status: "Inactive",
    lastActive: "3 weeks ago",
    phone: "+91 98111 00012",
  },
];

/* -------------------------------------------------------------------------- */
/* NOTIFICATIONS                                                              */
/* -------------------------------------------------------------------------- */

export type NotificationCategory = "Trips" | "Enquiries" | "Credit" | "Invoices" | "Fleet";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  severity: "info" | "warning" | "danger" | "success";
  linkTo: string;
  time?: string;
  link?: string;
}

export const notificationsList: AppNotification[] = [
  {
    id: "NOTIF-001",
    title: "Trip Delayed Beyond SLA",
    message: "TRP-2316 (Hyderabad → Warangal) breached SLA by 3 hours due to highway congestion.",
    category: "Trips",
    timestamp: "10 mins ago",
    read: false,
    severity: "danger",
    linkTo: "/trips",
  },
  {
    id: "NOTIF-002",
    title: "Credit Utilisation Alert (93%)",
    message:
      "Sharma Logistics Pvt Ltd has exceeded 90% credit limit. Balance: ₹46.5 L of ₹50 L limit.",
    category: "Credit",
    timestamp: "35 mins ago",
    read: false,
    severity: "warning",
    linkTo: "/accounts",
  },
  {
    id: "NOTIF-003",
    title: "High Value Lead Follow-up Due",
    message: "Bluestone Cements enquiry for ₹15.4 L/mo is scheduled for follow-up today.",
    category: "Enquiries",
    timestamp: "1 hour ago",
    read: false,
    severity: "info",
    linkTo: "/enquiries",
  },
  {
    id: "NOTIF-004",
    title: "Invoice Overdue Notice",
    message: "INV-24-0187 for ₹12.4 L from Sharma Logistics Pvt Ltd is 19 days overdue.",
    category: "Invoices",
    timestamp: "3 hours ago",
    read: true,
    severity: "danger",
    linkTo: "/invoicing",
  },
  {
    id: "NOTIF-005",
    title: "Vehicle Document Expiring Soon",
    message: "Vehicle UP 32 BK 7719 fitness certificate expires in 15 days.",
    category: "Fleet",
    timestamp: "Yesterday",
    read: true,
    severity: "warning",
    linkTo: "/fleet",
  },
  {
    id: "NOTIF-006",
    title: "New B2B Lead Received",
    message: "Vertex Retail Supply submitted new enquiry for Delhi → Jaipur regular corridor.",
    category: "Enquiries",
    timestamp: "2 days ago",
    read: true,
    severity: "success",
    linkTo: "/enquiries",
  },
];

/* -------------------------------------------------------------------------- */
/* ACTIVITY LOGS                                                              */
/* -------------------------------------------------------------------------- */

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  module:
    "Trips" | "Enquiries" | "Accounts" | "Invoicing" | "Invoices" | "Users" | "Fleet" | "Settings";
  action: string;
  recordId: string;
  description: string;
  badgeTone: "info" | "success" | "warning" | "danger";
}

export const activityLogsList: ActivityLog[] = [
  {
    id: "ACT-901",
    timestamp: "Today, 10:24 AM",
    user: "Aditi Sen (Admin / Ops)",
    module: "Trips",
    action: "Status Updated",
    recordId: "TRP-2317",
    description: "Updated status to 'Delayed' due to truck tyre puncture near Vapi.",
    badgeTone: "warning",
  },
  {
    id: "ACT-902",
    timestamp: "Today, 09:40 AM",
    user: "Pooja Varma (Finance)",
    module: "Invoicing",
    action: "Payment Recorded",
    recordId: "INV-24-0188",
    description: "Simulated partial payment of ₹4,00,000 received via NEFT.",
    badgeTone: "success",
  },
  {
    id: "ACT-903",
    timestamp: "Today, 09:12 AM",
    user: "Riya Mehta (Sales)",
    module: "Enquiries",
    action: "Lead Converted",
    recordId: "ENQ-1040",
    description: "Qualified enquiry from Bluestone Cements converted into operational contract.",
    badgeTone: "success",
  },
  {
    id: "ACT-904",
    timestamp: "Yesterday, 05:45 PM",
    user: "Rohan Malhotra (Super Admin)",
    module: "Accounts",
    action: "Credit Limit Changed",
    recordId: "ACC-001",
    description: "Increased approved credit limit for Sharma Logistics from ₹40 L to ₹50 L.",
    badgeTone: "info",
  },
  {
    id: "ACT-905",
    timestamp: "Yesterday, 03:20 PM",
    user: "Vikram Batra (Trip Manager)",
    module: "Fleet",
    action: "Driver Reassigned",
    recordId: "DRV-105",
    description: "Assigned driver Mohammed Rafi to vehicle KL 07 BQ 6650 for TRP-2314.",
    badgeTone: "info",
  },
  {
    id: "ACT-906",
    timestamp: "Yesterday, 11:15 AM",
    user: "Karan Shah (Sales)",
    module: "Enquiries",
    action: "Owner Assigned",
    recordId: "ENQ-1039",
    description: "Assigned Trident Pharma lead to Karan Shah for follow-up.",
    badgeTone: "info",
  },
  {
    id: "ACT-907",
    timestamp: "Oct 14, 04:30 PM",
    user: "Rohan Malhotra (Super Admin)",
    module: "Users",
    action: "User Invited",
    recordId: "USR-010",
    description: "Sent invitation link to Gaurav Chawla for Finance team role.",
    badgeTone: "info",
  },
  {
    id: "ACT-908",
    timestamp: "Oct 14, 02:10 PM",
    user: "Aditi Sen (Admin / Ops)",
    module: "Settings",
    action: "Preferences Updated",
    recordId: "CFG-01",
    description: "Adjusted low SLA breach alert threshold from 30m to 15m.",
    badgeTone: "warning",
  },
];

/* -------------------------------------------------------------------------- */
/* REPORTS DATASETS                                                           */
/* -------------------------------------------------------------------------- */

export const monthlyTripsData = [
  { month: "May", trips: 34, completed: 31, delayed: 3 },
  { month: "Jun", trips: 38, completed: 35, delayed: 3 },
  { month: "Jul", trips: 42, completed: 39, delayed: 3 },
  { month: "Aug", trips: 45, completed: 41, delayed: 4 },
  { month: "Sep", trips: 51, completed: 46, delayed: 5 },
  { month: "Oct", trips: 48, completed: 43, delayed: 5 },
];

export const monthlyRevenueData = [
  { month: "May", revenue: 58.2, collections: 52.0 },
  { month: "Jun", revenue: 64.5, collections: 60.1 },
  { month: "Jul", revenue: 71.8, collections: 68.3 },
  { month: "Aug", revenue: 79.4, collections: 73.0 },
  { month: "Sep", revenue: 89.2, collections: 82.5 },
  { month: "Oct", revenue: 85.4, collections: 46.8 },
];

export const enquiriesBySourceData = [
  { name: "Website", value: 35, color: "#5145F5" },
  { name: "Referral", value: 28, color: "#16A34A" },
  { name: "Trade Show", value: 18, color: "#F59E0B" },
  { name: "Cold Call", value: 11, color: "#0EA5E9" },
  { name: "LinkedIn", value: 8, color: "#8B5CF6" },
];

export const receivablesAgeingData = [
  { bucket: "0–30 Days", amount: 18.5, count: 12 },
  { bucket: "31–60 Days", amount: 9.8, count: 6 },
  { bucket: "61–90 Days", amount: 6.2, count: 3 },
  { bucket: "90+ Days (Overdue)", amount: 4.1, count: 2 },
];

export const onTimePerformanceData = [
  { month: "May", onTimeRate: 91.2 },
  { month: "Jun", onTimeRate: 92.5 },
  { month: "Jul", onTimeRate: 93.0 },
  { month: "Aug", onTimeRate: 90.8 },
  { month: "Sep", onTimeRate: 89.7 },
  { month: "Oct", onTimeRate: 88.5 },
];

/* -------------------------------------------------------------------------- */
/* SETTINGS DATA                                                              */
/* -------------------------------------------------------------------------- */

export interface AppSettings {
  companyName: string;
  gstin: string;
  supportEmail: string;
  supportPhone: string;
  registeredAddress: string;
  defaultCurrency?: string;
  timezone?: string;
  autoAssignDrivers?: boolean;
  slaBreachAlertMins?: number;
  defaultPaymentTerms: string;
  invoicePrefix: string;
  defaultGstRate?: number;
  creditUtilisationAlertThreshold?: number;
  autoHoldCreditExceeded?: boolean;
  emailAlerts?: boolean;
  smsCriticalAlerts?: boolean;
  browserNotifications?: boolean;
  twoFactorAuth?: boolean;
  sessionTimeoutHours?: number;
  theme?: "light" | "dark" | "system";
  // Extended settings used by dashboard mock
  legalEntity?: string;
  currencySymbol?: string;
  dateFormat?: string;
  fiscalYearStart?: string;
  taxRateGST?: number;
  tdsDeductionRate?: number;
  autoGenerateInvoiceOnDelivery?: boolean;
  defaultCreditLimitLakhs?: number;
  criticalCreditThresholdPct?: number;
  warningCreditThresholdPct?: number;
  autoBlockOnOverdueDays?: number;
  smsNotificationEnabled?: boolean;
  whatsappNotificationEnabled?: boolean;
  emailDigestsFrequency?: string;
  twoFactorAuthEnforced?: boolean;
  sessionTimeoutMinutes?: number;
  ipWhitelistingEnabled?: boolean;
  themeMode?: string;
  compactTableDensity?: boolean;
}

export const defaultSettings: AppSettings = {
  companyName: "HireD Logistics Technologies Pvt Ltd",
  gstin: "29AABCH9912K1Z4",
  supportEmail: "ops@hired.in",
  supportPhone: "+91 80 4455 6677",
  registeredAddress: "Level 4, Embassy Tech Village, Outer Ring Road, Bengaluru 560103",
  defaultCurrency: "INR (₹)",
  timezone: "Asia/Kolkata (IST +05:30)",
  autoAssignDrivers: true,
  slaBreachAlertMins: 30,
  defaultPaymentTerms: "Net 15",
  invoicePrefix: "INV-26",
  defaultGstRate: 18,
  creditUtilisationAlertThreshold: 85,
  autoHoldCreditExceeded: true,
  emailAlerts: true,
  smsCriticalAlerts: true,
  browserNotifications: true,
  twoFactorAuth: true,
  sessionTimeoutHours: 8,
  theme: "light",
};
