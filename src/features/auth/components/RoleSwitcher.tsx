import { Shield, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SIMULATED_ADMIN_ROLES } from "@/constants/app.constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function RoleSwitcher() {
  const { activeRole, roleConfig, switchRole } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-dashed bg-muted/40 px-2.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Shield className="size-3.5 text-primary" />
          <span className="hidden sm:inline">Role:</span>
          <span className="font-semibold text-primary">{roleConfig.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs">
          Simulate Admin Role (Frontend Only)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SIMULATED_ADMIN_ROLES.map((r) => {
          const isSelected = r.code === activeRole;
          return (
            <DropdownMenuItem
              key={r.code}
              onClick={() => switchRole(r.code)}
              className="flex items-start justify-between py-2 text-xs"
            >
              <div>
                <p className="font-medium text-foreground">{r.label}</p>
                <p className="line-clamp-2 text-[10px] text-muted-foreground">{r.description}</p>
              </div>
              {isSelected && <Check className="size-4 shrink-0 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
