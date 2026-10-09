import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity Logs — HireD Ops" },
      { name: "description", content: "Audit trail of operations activity." },
      { property: "og:title", content: "Activity Logs — HireD Ops" },
      { property: "og:description", content: "Audit trail of operations activity." },
    ],
  }),
  component: () => <ComingSoon title="Activity Logs" subtitle="Audit trail of operations activity." />,
});
