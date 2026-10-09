import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Drivers & Fleet — HireD Ops" },
      { name: "description", content: "Manage drivers, vehicles and availability." },
      { property: "og:title", content: "Drivers & Fleet — HireD Ops" },
      { property: "og:description", content: "Manage drivers, vehicles and availability." },
    ],
  }),
  component: () => <ComingSoon title="Drivers & Fleet" subtitle="Manage drivers, vehicles and availability." />,
});
