import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Key,
  CheckCircle,
  XCircle,
  Mail,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore, nextId } from "@/lib/store";
import { USER_ROLES, type AppUser, type UserRole } from "@/lib/mock-data";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — HireD Ops" },
      { name: "description", content: "Manage team members, roles, and permissions." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { users, setUsers, logActivity } = useStore();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals state
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);

  // Add form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("Sales / CRM");
  const [formDept, setFormDept] = useState<AppUser["department"]>("Sales");
  const [formPhone, setFormPhone] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.phone.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const pendingCount = users.filter((u) => u.status === "Pending").length;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      toast.error("Please enter both name and email");
      return;
    }

    const newUser: AppUser = {
      id: nextId(
        "USR",
        users.map((u) => u.id),
      ),
      name: formName,
      email: formEmail,
      role: formRole,
      department: formDept,
      status: "Active",
      lastActive: "Just now",
      phone: formPhone || "+91 98000 00000",
    };

    setUsers([newUser, ...users]);
    logActivity({
      user: "Admin / Ops",
      module: "Users",
      action: "User Added",
      recordId: newUser.id,
      description: `Added ${newUser.name} with role ${newUser.role}.`,
      badgeTone: "success",
    });

    toast.success(`User ${newUser.name} added successfully`);
    setAddOpen(false);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    logActivity({
      user: "Admin / Ops",
      module: "Users",
      action: "User Updated",
      recordId: editUser.id,
      description: `Updated profile details for ${editUser.name}.`,
      badgeTone: "info",
    });

    toast.success("User profile updated");
    setEditUser(null);
  };

  const toggleUserStatus = (u: AppUser) => {
    const newStatus: AppUser["status"] = u.status === "Active" ? "Inactive" : "Active";
    setUsers(users.map((item) => (item.id === u.id ? { ...item, status: newStatus } : item)));
    logActivity({
      user: "Admin / Ops",
      module: "Users",
      action: "Status Changed",
      recordId: u.id,
      description: `Changed status of ${u.name} to ${newStatus}.`,
      badgeTone: newStatus === "Active" ? "success" : "warning",
    });
    toast.success(`User ${u.name} is now ${newStatus}`);
  };

  const handleRoleChange = (u: AppUser, role: UserRole) => {
    setUsers(users.map((item) => (item.id === u.id ? { ...item, role } : item)));
    logActivity({
      user: "Admin / Ops",
      module: "Users",
      action: "Role Changed",
      recordId: u.id,
      description: `Changed role of ${u.name} to ${role}.`,
      badgeTone: "info",
    });
    toast.success(`Role for ${u.name} updated to ${role}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Users & Roles</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage team members, assign operational roles, and configure system permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPermissionsModalOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <ShieldCheck className="size-3.5 text-primary" />
            Permissions Matrix
          </Button>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <UserPlus className="size-3.5" />
            Add User
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Users</span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">18</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Registered team accounts</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Users</span>
            <CheckCircle className="size-4 text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{activeCount}</p>
          <p className="mt-1 text-[11px] text-success">Regular operational access</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Pending Invitations</span>
            <Clock className="size-4 text-warning" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{pendingCount}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Awaiting invitation acceptance</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Configured Roles</span>
            <Key className="size-4 text-info" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {USER_ROLES.length}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">RBAC security profiles</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name, email, or phone..."
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Filter className="size-3.5" />
                Role: {roleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All", ...USER_ROLES].map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRoleFilter(r)}>
                  {r} {roleFilter === r ? "✓" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                Status: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All", "Active", "Pending", "Inactive"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
                  {s} {statusFilter === s ? "✓" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User & Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-8 place-items-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{u.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        u.status === "Active"
                          ? "bg-success/15 text-success"
                          : u.status === "Pending"
                            ? "bg-warning/15 text-warning"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      ● {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem onClick={() => setEditUser(u)}>
                          <Edit2 className="mr-2 size-3.5 text-muted-foreground" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(u)}>
                          {u.status === "Active" ? (
                            <>
                              <XCircle className="mr-2 size-3.5 text-danger" />
                              Deactivate User
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 size-3.5 text-success" />
                              Activate User
                            </>
                          )}
                        </DropdownMenuItem>
                        {USER_ROLES.map((r) => (
                          <DropdownMenuItem
                            key={r}
                            onClick={() => handleRoleChange(u, r)}
                            disabled={u.role === r}
                          >
                            <Key className="mr-2 size-3.5 text-muted-foreground" />
                            Change to {r}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                    No users match the search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Full Name *</label>
              <input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Priyesh Nair"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Email Address *</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="priyesh.n@hired.in"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Phone Number</label>
              <input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+91 98111 22334"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                >
                  {USER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Department</label>
                <select
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value as AppUser["department"])}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                >
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                  <option value="Fleet">Fleet</option>
                  <option value="Finance">Finance</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-5">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Team Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      {editUser && (
        <Dialog open={!!editUser} onOpenChange={(v) => !v && setEditUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Edit User Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <input
                  required
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  required
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Role</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Department</label>
                  <select
                    value={editUser.department}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        department: e.target.value as AppUser["department"],
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Fleet">Fleet</option>
                    <option value="Finance">Finance</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>
              <DialogFooter className="mt-5">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Permissions Matrix Modal */}
      <Dialog open={permissionsModalOpen} onOpenChange={setPermissionsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Role-Based Access Control (RBAC) Matrix
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs text-left">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5 text-center">Dashboard</th>
                  <th className="p-2.5 text-center">Trips & Fleet</th>
                  <th className="p-2.5 text-center">Invoicing & Credit</th>
                  <th className="p-2.5 text-center">Settings & Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { role: "Super Admin", dash: "Full", trips: "Full", fin: "Full", admin: "Full" },
                  {
                    role: "Admin / Ops",
                    dash: "Full",
                    trips: "Full",
                    fin: "View/Edit",
                    admin: "Edit",
                  },
                  { role: "Finance", dash: "View", trips: "View", fin: "Full", admin: "None" },
                  {
                    role: "Sales / CRM",
                    dash: "View",
                    trips: "Create",
                    fin: "None",
                    admin: "None",
                  },
                  { role: "Trip Manager", dash: "View", trips: "Full", fin: "None", admin: "None" },
                  { role: "Read Only", dash: "View", trips: "View", fin: "View", admin: "None" },
                ].map((row) => (
                  <tr key={row.role}>
                    <td className="p-2.5 font-semibold text-foreground">{row.role}</td>
                    <td className="p-2.5 text-center text-success">{row.dash}</td>
                    <td className="p-2.5 text-center text-success">{row.trips}</td>
                    <td className="p-2.5 text-center text-info">{row.fin}</td>
                    <td className="p-2.5 text-center text-muted-foreground">{row.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter className="mt-4">
            <Button size="sm" onClick={() => setPermissionsModalOpen(false)}>
              Close Matrix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
