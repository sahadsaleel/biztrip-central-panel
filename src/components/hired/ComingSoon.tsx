import { Construction } from "lucide-react";
import { PageHeader } from "./ui";

export function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid place-items-center rounded-2xl border border-dashed bg-card py-24 text-center">
        <Construction className="size-10 text-primary" />
        <p className="mt-4 font-medium">This module is next on the roadmap</p>
        <p className="mt-1 text-sm text-muted-foreground">Dashboard, Enquiries / CRM and B2B Trips are live now.</p>
      </div>
    </>
  );
}
