import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export interface AppProviderProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AppProvider({ children, queryClient = appQueryClient }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default AppProvider;
