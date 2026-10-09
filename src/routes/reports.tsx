import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — HireD Ops" },
      { name: "description", content: "Explore sample logistics, sales and financial performance." },
      { property: "og:title", content: "Reports & Analytics — HireD Ops" },
      { property: "og:description", content: "Explore sample logistics, sales and financial performance." },
    ],
  }),
  component: () => <ComingSoon title="Reports & Analytics" subtitle="Explore sample logistics, sales and financial performance." />,
});
