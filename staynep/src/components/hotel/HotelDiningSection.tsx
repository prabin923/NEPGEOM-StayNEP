"use client";

import { useActionState, useEffect, useRef } from "react";
import { UtensilsCrossed, Trash2 } from "lucide-react";
import type { DiningOrder } from "@prisma/client";
import {
  createDiningOrder,
  deleteDiningOrderForm,
  type HotelActionState,
} from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { formatNpr } from "@/lib/hotel";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};

export default function HotelDiningSection({
  orders,
}: {
  orders: DiningOrder[];
}) {
  const [state, action, pending] = useActionState(createDiningOrder, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Dining orders"
        subtitle="Record restaurant and room-service revenue"
        icon={UtensilsCrossed}
      />
      {state.error && <AuthError message={state.error} />}
      <form
        ref={formRef}
        action={action}
        className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Guest (optional)</label>
          <input name="guestName" placeholder="Walk-in" className={hotelInputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Description</label>
          <input name="description" required placeholder="Dinner for 2" className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Amount (NPR)</label>
          <input name="amount" type="number" min={0} required className={hotelInputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button type="submit" disabled={pending} className={hotelSubmitClass}>
            {pending ? "Saving…" : "Add order"}
          </button>
        </div>
      </form>
      {orders.length === 0 ? (
        <p className="text-sm text-steel">No dining orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={portalTableRow}>
                  <td className="py-3 pr-4 text-steel">
                    {o.orderedAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-4 text-graphite">{o.guestName ?? "—"}</td>
                  <td className="py-3 pr-4 font-medium text-ink">{o.description}</td>
                  <td className="py-3 pr-4 font-medium text-obsidian">{formatNpr(o.amount)}</td>
                  <td className="py-3">
                    <form action={deleteDiningOrderForm}>
                      <input type="hidden" name="id" value={o.id} />
                      <button type="submit" className="rounded-[10px] p-2 text-steel hover:bg-fog hover:text-red-600" aria-label="Delete">
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
