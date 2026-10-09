import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts & Credit — HireD Ops" },
      { name: "description", content: "Manage customer accounts, credit limits and receivables." },
      { property: "og:title", content: "Accounts & Credit — HireD Ops" },
      { property: "og:description", content: "Manage customer accounts, credit limits and receivables." },
    ],
  }),
  component: () => <ComingSoon title="Accounts & Credit" subtitle="Manage customer accounts, credit limits and receivables." />,
});
