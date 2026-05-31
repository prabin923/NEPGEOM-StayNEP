import PortalShell from "@/components/portal/PortalShell";
import AuthoritiesDashboard from "@/components/dashboards/AuthoritiesDashboard";

export const metadata = {
  title: "Tourism Authority — StayNEP",
  description: "National tourism intelligence command center",
};

export default function AuthoritiesPortalPage() {
  return (
    <PortalShell
      role="authorities"
      userLabel="MoCTCA Nepal"
      userMeta="Government · Enterprise"
    >
      <AuthoritiesDashboard />
    </PortalShell>
  );
}
