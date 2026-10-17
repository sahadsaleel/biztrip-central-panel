import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AdminSimulatedRole, AdminRoleConfig, AppUser } from "@/types/user.types";
import { SIMULATED_ADMIN_ROLES } from "@/constants/app.constants";
import { toast } from "sonner";

interface AuthContextType {
  activeRole: AdminSimulatedRole;
  roleConfig: AdminRoleConfig;
  currentUser: AppUser;
  switchRole: (role: AdminSimulatedRole) => void;
  can: (permission: string) => boolean;
}

const defaultUser: AppUser = {
  id: "USR-001",
  name: "Vikram Malhotra",
  email: "vikram.m@hiredops.com",
  role: "Super Admin",
  department: "Management",
  status: "Active",
  lastActive: "Just now",
  phone: "+91 98111 22334",
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<AdminSimulatedRole>(() => {
    try {
      const saved = localStorage.getItem("hired_simulated_role");
      return (saved as AdminSimulatedRole) || "SUPER_ADMIN";
    } catch {
      return "SUPER_ADMIN";
    }
  });

  const roleConfig =
    SIMULATED_ADMIN_ROLES.find((r) => r.code === activeRole) || SIMULATED_ADMIN_ROLES[0]!;

  const currentUser: AppUser = {
    ...defaultUser,
    name:
      activeRole === "SUPER_ADMIN"
        ? "Vikram Malhotra (Super Admin)"
        : activeRole === "DISPATCHER"
          ? "Rohan Verma (Dispatcher)"
          : activeRole === "BILLING_ADMIN"
            ? "Priya Sen (Billing Admin)"
            : "Ananya Roy (Sales Ops)",
    email:
      activeRole === "SUPER_ADMIN"
        ? "vikram.m@hiredops.com"
        : activeRole === "DISPATCHER"
          ? "rohan.v@hiredops.com"
          : activeRole === "BILLING_ADMIN"
            ? "priya.s@hiredops.com"
            : "ananya.r@hiredops.com",
    role:
      activeRole === "SUPER_ADMIN"
        ? "Super Admin"
        : activeRole === "DISPATCHER"
          ? "Ops Dispatcher"
          : activeRole === "BILLING_ADMIN"
            ? "Finance & Invoicing"
            : "Sales / CRM",
  };

  const switchRole = (newRole: AdminSimulatedRole) => {
    setActiveRole(newRole);
    try {
      localStorage.setItem("hired_simulated_role", newRole);
    } catch {
      // ignore
    }
    const found = SIMULATED_ADMIN_ROLES.find((r) => r.code === newRole);
    toast.success(`Simulated role switched to ${found?.label || newRole}`);
  };

  const can = (permission: string): boolean => {
    if (activeRole === "SUPER_ADMIN") return true;
    return roleConfig.permissions.includes(permission) || roleConfig.permissions.includes("all");
  };

  return (
    <AuthContext.Provider
      value={{
        activeRole,
        roleConfig,
        currentUser,
        switchRole,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
