"use client";

import { useActionState, useEffect, useRef } from "react";
import { BedDouble, Trash2, Pencil } from "lucide-react";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";
import {
  createRoom,
  deleteRoomForm,
  updateRoomForm,
  type HotelActionState,
} from "@/actions/hotel";
import { AuthError } from "@/components/auth/AuthField";
import type { RoomWithAvailability } from "@/lib/hotel";
import { formatNpr } from "@/lib/hotel";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";

const initial: HotelActionState = {};

interface HotelRoomsSectionProps {
  rooms: RoomWithAvailability[];
}

export default function HotelRoomsSection({ rooms }: HotelRoomsSectionProps) {
  const [createState, createAction, createPending] = useActionState(
    createRoom,
    initial
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createState.success) formRef.current?.reset();
  }, [createState.success]);

  return (
    <div id="rooms" className="space-y-6">
      <PortalSectionTitle
        title="Room inventory"
        subtitle="Add room types and nightly rates for your property"
        icon={BedDouble}
      />

      {createState.error && <AuthError message={createState.error} />}

      <form
        ref={formRef}
        action={createAction}
        className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            Room type
          </label>
          <input
            name="name"
            required
            placeholder="e.g. Deluxe Lake View"
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            Total units
          </label>
          <input
            name="totalUnits"
            type="number"
            min={1}
            required
            defaultValue={1}
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            Rate / night (NPR)
          </label>
          <input
            name="ratePerNight"
            type="number"
            min={0}
            step={100}
            required
            placeholder="4500"
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
          />
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            disabled={createPending}
            className="w-full rounded-[36px] bg-obsidian py-2.5 text-sm font-semibold text-snow shadow-button disabled:opacity-55"
          >
            {createPending ? "Adding…" : "Add room type"}
          </button>
        </div>
      </form>

      {rooms.length === 0 ? (
        <p className="text-sm text-steel font-cosmica">
          No rooms yet. Add your first room type above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Room type</th>
                <th className="pb-3 pr-4">Available today</th>
                <th className="pb-3 pr-4">Total units</th>
                <th className="pb-3 pr-4">Rate / night</th>
                <th className="pb-3 pr-4">Edit</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className={portalTableRow}>
                  <td className="py-3 pr-4 font-medium text-ink">{room.name}</td>
                  <td className="py-3 pr-4 text-graphite">{room.availableUnits}</td>
                  <td className="py-3 pr-4 text-steel">{room.totalUnits}</td>
                  <td className="py-3 pr-4 font-medium text-obsidian">
                    {formatNpr(room.ratePerNight)}
                  </td>
                  <td className="py-3 pr-4">
                    <form action={updateRoomForm} className="flex flex-wrap gap-1">
                      <input type="hidden" name="roomId" value={room.id} />
                      <input
                        name="name"
                        defaultValue={room.name}
                        className="w-24 rounded-[8px] border border-fog px-2 py-1 text-xs"
                      />
                      <input
                        name="totalUnits"
                        type="number"
                        min={1}
                        defaultValue={room.totalUnits}
                        className="w-14 rounded-[8px] border border-fog px-2 py-1 text-xs"
                      />
                      <input
                        name="ratePerNight"
                        type="number"
                        min={0}
                        defaultValue={room.ratePerNight}
                        className="w-20 rounded-[8px] border border-fog px-2 py-1 text-xs"
                      />
                      <button
                        type="submit"
                        className="rounded-[8px] bg-fog px-2 py-1 text-[10px] font-medium"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="py-3">
                    <form action={deleteRoomForm}>
                      <input type="hidden" name="roomId" value={room.id} />
                      <button
                        type="submit"
                        className="rounded-[10px] p-2 text-steel transition hover:bg-fog hover:text-red-600"
                        aria-label={`Delete ${room.name}`}
                      >
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
