import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Settings — HireD Ops" },
      { name: "description", content: "Configure workspace preferences." },
      { property: "og:title", content: "Settings — HireD Ops" },
      { property: "og:description", content: "Configure workspace preferences." },
    ],
  }),
  component: () => <ComingSoon title="Settings" subtitle="Configure workspace preferences." />,
});
