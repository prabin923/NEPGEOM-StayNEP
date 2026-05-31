"use client";

import { useActionState, useEffect, useRef } from "react";
import { FileText, Trash2 } from "lucide-react";
import type { Invoice, InvoiceStatus } from "@prisma/client";
import Link from "next/link";
import {
  createInvoice,
  deleteInvoiceForm,
  updateInvoiceStatusForm,
  type HotelActionState,
} from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { formatNpr, formatDisplayDate } from "@/lib/hotel";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};
const statuses: InvoiceStatus[] = ["DRAFT", "SENT", "PAID"];

export default function HotelInvoicesSection({
  invoices,
}: {
  invoices: Invoice[];
}) {
  const [state, action, pending] = useActionState(createInvoice, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Invoices"
        subtitle="Create and track guest billing"
        icon={FileText}
      />
      {state.error && <AuthError message={state.error} />}
      <form
        ref={formRef}
        action={action}
        className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Guest</label>
          <input name="guestName" required className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Amount (NPR)</label>
          <input name="amount" type="number" min={0} required className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Due date</label>
          <input name="dueDate" type="date" className={hotelInputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Description</label>
          <input name="description" required placeholder="Room + dining" className={hotelInputClass} />
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-3">
          <button type="submit" disabled={pending} className={hotelSubmitClass}>
            {pending ? "Creating…" : "Create invoice"}
          </button>
        </div>
      </form>
      {invoices.length === 0 ? (
        <p className="text-sm text-steel">No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Due</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className={portalTableRow}>
                  <td className="py-3 pr-4 font-medium text-ink">
                    {inv.guestName}
                    {inv.bookingId && (
                      <Link
                        href="/dashboard/hotel/bookings"
                        className="mt-0.5 block text-[10px] text-steel hover:text-obsidian"
                      >
                        Linked to booking
                      </Link>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-steel">{inv.description}</td>
                  <td className="py-3 pr-4 font-medium text-obsidian">{formatNpr(inv.amount)}</td>
                  <td className="py-3 pr-4 text-steel">
                    {inv.dueDate ? formatDisplayDate(inv.dueDate) : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <form action={updateInvoiceStatusForm}>
                      <input type="hidden" name="id" value={inv.id} />
                      <select
                        name="status"
                        defaultValue={inv.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="rounded-[8px] border border-fog bg-snow px-2 py-1 text-xs capitalize"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s.toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </form>
                  </td>
                  <td className="py-3">
                    <form action={deleteInvoiceForm}>
                      <input type="hidden" name="id" value={inv.id} />
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
