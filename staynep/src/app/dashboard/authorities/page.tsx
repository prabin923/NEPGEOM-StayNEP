import PortalShell from "@/components/portal/PortalShell";
import AuthoritiesDashboard from "@/components/dashboards/AuthoritiesDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Tourism Authority — StayNEP",
  description: "National tourism intelligence command center",
};

export default async function AuthoritiesPortalPage() {
  const session = await requireRole("AUTHORITIES");
  const user = session.user;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { organization: true, name: true },
  });

  return (
    <PortalShell
      role="authorities"
      userLabel={dbUser?.organization ?? user.name ?? "Tourism Authority"}
      userMeta={roleMeta("AUTHORITIES")}
    >
      <AuthoritiesDashboard />
    </PortalShell>
  );
}
