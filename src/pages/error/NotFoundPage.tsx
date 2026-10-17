import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold tracking-tight text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested admin page does not exist or has been relocated within the operations
          portal.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button>Go to Operations Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
