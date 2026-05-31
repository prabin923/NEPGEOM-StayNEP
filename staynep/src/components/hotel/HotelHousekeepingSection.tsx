"use client";

import { useActionState, useEffect, useRef } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import type { HousekeepingTask, TaskStatus } from "@prisma/client";
import {
  createHousekeepingTask,
  deleteHousekeepingTaskForm,
  updateTaskStatusForm,
  type HotelActionState,
} from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import type { RoomWithAvailability } from "@/lib/hotel";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};
const statuses: TaskStatus[] = ["PENDING", "IN_PROGRESS", "DONE"];

type TaskRow = HousekeepingTask & { room: { name: string } | null };

export default function HotelHousekeepingSection({
  tasks,
  rooms,
}: {
  tasks: TaskRow[];
  rooms: RoomWithAvailability[];
}) {
  const [state, action, pending] = useActionState(createHousekeepingTask, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Housekeeping"
        subtitle="Assign and track room cleaning tasks"
        icon={Sparkles}
      />
      {state.error && <AuthError message={state.error} />}
      <form
        ref={formRef}
        action={action}
        className="grid gap-4 rounded-[20px] border border-fog bg-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Task</label>
          <input name="title" required placeholder="Turnover — Room 201" className={hotelInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Room (optional)</label>
          <select name="roomId" className={hotelInputClass}>
            <option value="">— Any —</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Priority</label>
          <select name="priority" className={hotelInputClass}>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Due date</label>
          <input name="dueDate" type="date" className={hotelInputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Notes</label>
          <input name="notes" placeholder="Optional notes" className={hotelInputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button type="submit" disabled={pending} className={hotelSubmitClass}>
            {pending ? "Adding…" : "Add task"}
          </button>
        </div>
      </form>
      {tasks.length === 0 ? (
        <p className="text-sm text-steel">No housekeeping tasks yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Task</th>
                <th className="pb-3 pr-4">Room</th>
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className={portalTableRow}>
                  <td className="py-3 pr-4 font-medium text-ink">{t.title}</td>
                  <td className="py-3 pr-4 text-steel">{t.room?.name ?? "—"}</td>
                  <td className="py-3 pr-4 capitalize text-graphite">{t.priority.toLowerCase()}</td>
                  <td className="py-3 pr-4">
                    <form action={updateTaskStatusForm} className="inline">
                      <input type="hidden" name="id" value={t.id} />
                      <select
                        name="status"
                        defaultValue={t.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="rounded-[8px] border border-fog bg-snow px-2 py-1 text-xs"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ").toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </form>
                  </td>
                  <td className="py-3">
                    <form action={deleteHousekeepingTaskForm}>
                      <input type="hidden" name="id" value={t.id} />
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
