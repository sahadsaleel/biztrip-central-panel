import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/hired/ComingSoon";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — HireD Ops" },
      { name: "description", content: "Manage team members and access roles." },
      { property: "og:title", content: "Users & Roles — HireD Ops" },
      { property: "og:description", content: "Manage team members and access roles." },
    ],
  }),
  component: () => <ComingSoon title="Users & Roles" subtitle="Manage team members and access roles." />,
});
