"use client";

import { useActionState } from "react";
import { Clock } from "lucide-react";
import type { AttendanceRecord, StaffMember } from "@prisma/client";
import { recordAttendance, type HotelActionState } from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};

type StaffWithAttendance = StaffMember & { attendances: AttendanceRecord[] };

export default function HotelAttendanceSection({
  staff,
}: {
  staff: StaffWithAttendance[];
}) {
  const [state, action, pending] = useActionState(recordAttendance, initial);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Attendance"
        subtitle="Mark daily attendance for your team"
        icon={Clock}
      />
      {state.error && <AuthError message={state.error} />}
      {staff.length === 0 ? (
        <p className="text-sm text-steel">Add staff members first to record attendance.</p>
      ) : (
        <>
          <form
            action={action}
            className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">Staff</label>
              <select name="staffId" required className={hotelInputClass}>
                <option value="">Select…</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">Date</label>
              <input name="date" type="date" required defaultValue={today} className={hotelInputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">Status</label>
              <select name="status" className={hotelInputClass}>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LEAVE">Leave</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={pending} className={`w-full ${hotelSubmitClass}`}>
                {pending ? "Saving…" : "Record"}
              </button>
            </div>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={portalTableHead}>
                  <th className="pb-3 pr-4">Staff</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.flatMap((s) =>
                  s.attendances.map((a) => (
                    <tr key={a.id} className={portalTableRow}>
                      <td className="py-3 pr-4 font-medium text-ink">{s.name}</td>
                      <td className="py-3 pr-4 text-steel">
                        {a.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 pr-4 capitalize text-graphite">
                        {a.status.toLowerCase()}
                      </td>
                    </tr>
                  ))
                )}
                {staff.every((s) => s.attendances.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-sm text-steel">
                      No attendance recorded this month yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
