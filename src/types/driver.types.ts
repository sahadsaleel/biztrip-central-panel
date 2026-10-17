export type DriverAvailability = "Available" | "On Trip" | "Off Duty" | "Inactive";

export type KYCStatus = "Verified" | "Pending Review" | "Rejected" | "Under Verification";

export interface KYCDocument {
  id: string;
  type:
    | "Commercial Driving Licence"
    | "Aadhaar Card"
    | "Police Clearance Certificate"
    | "Commercial Badge";
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
  availability: DriverAvailability;
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

export type VehicleType =
  "20ft Container" | "32ft Multi-Axle" | "14ft Eicher" | "Tata Ace" | "Trailer 40ft";

export type VehicleAvailability = "Available" | "On Trip" | "Maintenance" | "Inactive";

export type FuelType = "Diesel" | "CNG" | "Electric";

export interface Vehicle {
  id: string;
  regNumber: string;
  type: VehicleType;
  capacity: string;
  assignedDriver: string;
  currentTrip: string;
  availability: VehicleAvailability;
  documentExpiry: string;
  fuelType: FuelType;
}

export interface DriverKYCReviewInput {
  driverId: string;
  status: "Verified" | "Rejected";
  notes?: string | undefined;
  reviewerName: string;
}
