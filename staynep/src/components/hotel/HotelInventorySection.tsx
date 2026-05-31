"use client";

import { useActionState, useEffect, useRef } from "react";
import { Package, Trash2, Plus, Minus } from "lucide-react";
import type { InventoryItem } from "@prisma/client";
import {
  createInventoryItem,
  deleteInventoryItemForm,
  updateInventoryQuantityForm,
  type HotelActionState,
} from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};

export default function HotelInventorySection({
  items,
}: {
  items: InventoryItem[];
}) {
  const [state, action, pending] = useActionState(createInventoryItem, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Inventory"
        subtitle="Track stock levels and low-stock alerts"
        icon={Package}
      />
      {state.error && <AuthError message={state.error} />}
      <form
        ref={formRef}
        action={action}
        className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Item name</label>
          <input name="name" required placeholder="Towels" className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Quantity</label>
          <input name="quantity" type="number" min={0} required defaultValue={0} className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Min stock</label>
          <input name="minQuantity" type="number" min={0} required defaultValue={5} className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Unit</label>
          <input name="unit" defaultValue="pcs" className={hotelInputClass} />
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-5">
          <button type="submit" disabled={pending} className={`w-full sm:w-auto ${hotelSubmitClass}`}>
            {pending ? "Adding…" : "Add item"}
          </button>
        </div>
      </form>
      {items.length === 0 ? (
        <p className="text-sm text-steel">No inventory items yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Item</th>
                <th className="pb-3 pr-4">On hand</th>
                <th className="pb-3 pr-4">Min</th>
                <th className="pb-3 pr-4">Adjust</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = item.quantity <= item.minQuantity;
                return (
                  <tr key={item.id} className={portalTableRow}>
                    <td className="py-3 pr-4 font-medium text-ink">
                      {item.name}
                      {low && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                          Low
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-graphite">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 pr-4 text-steel">{item.minQuantity}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1">
                        <form action={updateInventoryQuantityForm}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="delta" value="-1" />
                          <button type="submit" className="rounded-[8px] border border-fog p-1.5 hover:bg-fog">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                        </form>
                        <form action={updateInventoryQuantityForm}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="delta" value="1" />
                          <button type="submit" className="rounded-[8px] border border-fog p-1.5 hover:bg-fog">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="py-3">
                      <form action={deleteInventoryItemForm}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="rounded-[10px] p-2 text-steel hover:text-red-600 hover:bg-fog">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
