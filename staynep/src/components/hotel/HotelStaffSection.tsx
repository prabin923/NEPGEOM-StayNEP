"use client";

import { useActionState, useEffect, useRef } from "react";
import { UserCog, Trash2 } from "lucide-react";
import type { StaffMember } from "@prisma/client";
import {
  createStaffMember,
  deleteStaffMemberForm,
  type HotelActionState,
} from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { formatNpr } from "@/lib/hotel";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};

export default function HotelStaffSection({ staff }: { staff: StaffMember[] }) {
  const [state, action, pending] = useActionState(createStaffMember, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Staff"
        subtitle="Manage team members and monthly salaries"
        icon={UserCog}
      />
      {state.error && <AuthError message={state.error} />}
      <form
        ref={formRef}
        action={action}
        className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Name</label>
          <input name="name" required className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Role</label>
          <input name="role" required placeholder="Front desk" className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Monthly salary (NPR)</label>
          <input name="monthlySalary" type="number" min={0} required defaultValue={0} className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Email</label>
          <input name="email" type="email" className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Phone</label>
          <input name="phone" className={hotelInputClass} />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={pending} className={`w-full ${hotelSubmitClass}`}>
            {pending ? "Adding…" : "Add staff"}
          </button>
        </div>
      </form>
      {staff.length === 0 ? (
        <p className="text-sm text-steel">No staff members yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Salary</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className={portalTableRow}>
                  <td className="py-3 pr-4 font-medium text-ink">{s.name}</td>
                  <td className="py-3 pr-4 text-graphite">{s.role}</td>
                  <td className="py-3 pr-4 text-xs text-steel">
                    {s.email ?? s.phone ?? "—"}
                  </td>
                  <td className="py-3 pr-4 font-medium text-obsidian">
                    {formatNpr(s.monthlySalary)}
                  </td>
                  <td className="py-3">
                    <form action={deleteStaffMemberForm}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="rounded-[10px] p-2 text-steel hover:text-red-600 hover:bg-fog">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
