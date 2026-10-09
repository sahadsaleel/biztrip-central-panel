import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — HireD Ops" },
      { name: "description", content: "Alerts across trips, credit and invoicing." },
      { property: "og:title", content: "Notifications — HireD Ops" },
      { property: "og:description", content: "Alerts across trips, credit and invoicing." },
    ],
  }),
  component: () => <ComingSoon title="Notifications" subtitle="Alerts across trips, credit and invoicing." />,
});
