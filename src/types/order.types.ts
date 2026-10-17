export type Stage = "New" | "Contacted" | "Qualified" | "Converted" | "Rejected";

export interface Enquiry {
  id: string;
  company: string;
  contact: string;
  origin: string;
  destination: string;
  value: number; // in lakhs per month or trip value
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

export type Order = Enquiry;

export interface PhoneOrderIntakeInput {
  company: string;
  contact: string;
  phone: string;
  origin: string;
  destination: string;
  vehicleRequirement: string;
  cargoType: string;
  estimatedValueLakhs: number;
  notes?: string | undefined;
  owner?: string | undefined;
}

export interface OrderRejectInput {
  orderId: string;
  reason: string;
  notes?: string | undefined;
}
