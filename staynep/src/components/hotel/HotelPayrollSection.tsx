import { Wallet } from "lucide-react";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { computePayroll, type StaffWithAttendance } from "@/lib/hotel-payroll";
import { formatNpr } from "@/lib/hotel";

export default function HotelPayrollSection({
  staff,
}: {
  staff: StaffWithAttendance[];
}) {
  const rows = computePayroll(staff);
  const total = rows.reduce((s, r) => s + r.estimatedPayout, 0);
  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Payroll"
        subtitle={`Estimated payouts for ${monthLabel} based on attendance`}
        icon={Wallet}
      />
      {rows.length === 0 ? (
        <p className="text-sm text-steel">Add staff to calculate payroll.</p>
      ) : (
        <>
          <div className="rounded-[16px] border border-fog bg-mist/50 px-5 py-4">
            <p className="text-xs text-steel">Total estimated this month</p>
            <p className="text-2xl font-bold text-obsidian font-cosmica">{formatNpr(total)}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={portalTableHead}>
                  <th className="pb-3 pr-4">Staff</th>
                  <th className="pb-3 pr-4">Salary</th>
                  <th className="pb-3 pr-4">Present</th>
                  <th className="pb-3 pr-4">Absent</th>
                  <th className="pb-3 pr-4">Leave</th>
                  <th className="pb-3">Estimated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={portalTableRow}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-steel">{r.role}</p>
                    </td>
                    <td className="py-3 pr-4 text-graphite">{formatNpr(r.monthlySalary)}</td>
                    <td className="py-3 pr-4 text-graphite">{r.presentDays}</td>
                    <td className="py-3 pr-4 text-steel">{r.absentDays}</td>
                    <td className="py-3 pr-4 text-steel">{r.leaveDays}</td>
                    <td className="py-3 font-medium text-obsidian">{r.estimatedLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
