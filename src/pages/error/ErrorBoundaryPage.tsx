import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export interface ErrorBoundaryPageProps {
  error?: Error;
  reset?: () => void;
}

export function ErrorBoundaryPage({ error, reset }: ErrorBoundaryPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          System error encountered
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message ||
            "Something went wrong in the operations portal. Please retry or return to the overview."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {reset && (
            <Button onClick={reset} variant="default">
              Try again
            </Button>
          )}
          <Link to="/">
            <Button variant="outline">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
