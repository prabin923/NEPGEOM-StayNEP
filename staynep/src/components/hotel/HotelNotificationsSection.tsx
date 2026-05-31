"use client";

import { useActionState, useEffect, useRef } from "react";
import { Bell, Trash2 } from "lucide-react";
import type { Notification } from "@prisma/client";
import {
  createNotification,
  deleteNotificationForm,
  markNotificationReadForm,
  markAllNotificationsReadForm,
  type HotelActionState,
} from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { PortalSectionTitle } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};

export default function HotelNotificationsSection({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [state, action, pending] = useActionState(createNotification, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Notifications"
        subtitle={`${unread} unread · System alerts update automatically`}
        icon={Bell}
      />
      {state.error && <AuthError message={state.error} />}
      {unread > 0 && (
        <form action={markAllNotificationsReadForm}>
          <button
            type="submit"
            className="text-sm font-medium text-obsidian underline-offset-2 hover:underline"
          >
            Mark all as read
          </button>
        </form>
      )}
      <form
        ref={formRef}
        action={action}
        className="space-y-3 rounded-[20px] border border-fog bg-mist/50 p-4"
      >
        <input name="title" required placeholder="Title" className={hotelInputClass} />
        <textarea
          name="message"
          required
          rows={2}
          placeholder="Message"
          className={hotelInputClass}
        />
        <button type="submit" disabled={pending} className={hotelSubmitClass}>
          {pending ? "Posting…" : "Add notification"}
        </button>
      </form>
      {notifications.length === 0 ? (
        <p className="text-sm text-steel">No notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start justify-between gap-4 rounded-[14px] border p-4 ${
                n.read ? "border-fog bg-snow" : "border-obsidian/20 bg-[#ebe6dc]/40"
              }`}
            >
              <div className="min-w-0">
                <p className="font-medium text-obsidian">{n.title}</p>
                <p className="mt-1 text-sm text-steel">{n.message}</p>
                <p className="mt-2 text-[10px] text-pebble">
                  {n.createdAt.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {!n.read && (
                  <form action={markNotificationReadForm}>
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      type="submit"
                      className="rounded-[8px] border border-fog bg-snow px-2 py-1 text-xs font-medium hover:bg-fog"
                    >
                      Mark read
                    </button>
                  </form>
                )}
                <form action={deleteNotificationForm}>
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className="rounded-[10px] p-2 text-steel hover:text-red-600 hover:bg-fog"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
