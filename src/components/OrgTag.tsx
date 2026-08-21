import { getOrganization } from "@/lib/taxonomy";
import type { OrganizationSlug } from "@/lib/types";

export default function OrgTag({ organization }: { organization: OrganizationSlug }) {
  const org = getOrganization(organization);
  return (
    <span className="font-head inline-flex items-center rounded-sm border border-accent/40 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
      {org.name}
    </span>
  );
}
