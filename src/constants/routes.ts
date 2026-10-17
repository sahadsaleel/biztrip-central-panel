export const ROUTES = {
  DASHBOARD: "/",
  ORDERS: "/enquiries",
  TRIPS: "/trips",
  COMPANIES: "/accounts",
  INVOICES: "/invoicing",
  REPORTS: "/reports",
  DRIVERS: "/fleet",
  USERS: "/users",
  NOTIFICATIONS: "/notifications",
  ACTIVITY_LOGS: "/activity",
  SETTINGS: "/settings",
  LOGIN: "/login",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
