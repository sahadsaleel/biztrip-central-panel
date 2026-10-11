import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — HireD Ops" },
    { name: "description", content: "Operational and billing reports for HireD." },
    { property: "og:title", content: "Reports — HireD Ops" },
    { property: "og:description", content: "Operational and billing reports for HireD." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ComingSoon title="Reports" subtitle="Operational and billing reports." />,
});