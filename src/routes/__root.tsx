import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { AppProvider } from "@/app/providers/AppProvider";
import { AppLayout } from "@/components/hired/AppLayout";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { ErrorBoundaryPage } from "@/pages/error/ErrorBoundaryPage";

function RootErrorWrapper({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <ErrorBoundaryPage
      error={error as Error}
      reset={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: RootErrorWrapper,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <AppProvider queryClient={queryClient}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProvider>
  );
}
