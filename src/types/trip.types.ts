export type TripStatus = "Scheduled" | "In Progress" | "Delayed" | "Completed" | "Cancelled";

export type SLA = "On Track" | "At Risk" | "Breached";

export type FreightType = "FTL" | "PTL" | "Express";

export interface Trip {
  id: string;
  customer: string;
  type: FreightType;
  origin: string;
  destination: string;
  pickup: string;
  eta: string;
  driver: string;
  vehicle: string;
  status: TripStatus;
  sla: SLA;
  progress: number;
  vehicleClassRequired?: string;
  assignedDriverId?: string;
  dispatchNotes?: string;
}

export interface DriverAssignmentInput {
  tripId: string;
  driverId: string;
  driverName: string;
  vehicleReg: string;
  vehicleClass: string;
  assignedAt: string;
}
