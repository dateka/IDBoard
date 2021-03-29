import React from "react";
import { AppContent } from "components/AppContent";
import "reset.module.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "common/contexts/User";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </QueryClientProvider>
  );
};
