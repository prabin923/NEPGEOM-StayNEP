import type { AttendanceRecord, StaffMember } from "@prisma/client";
import { formatNpr } from "@/lib/hotel";

export type StaffWithAttendance = StaffMember & {
  attendances: AttendanceRecord[];
};

export interface PayrollRow {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  estimatedPayout: number;
  estimatedLabel: string;
}

export function computePayroll(
  staff: StaffWithAttendance[],
  month = new Date()
): PayrollRow[] {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const daysInMonth = Math.round(
    (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  return staff.map((s) => {
    const records = s.attendances.filter(
      (a) => a.date >= monthStart && a.date < monthEnd
    );
    const presentDays = records.filter((a) => a.status === "PRESENT").length;
    const absentDays = records.filter((a) => a.status === "ABSENT").length;
    const leaveDays = records.filter((a) => a.status === "LEAVE").length;
    const estimatedPayout =
      daysInMonth > 0
        ? Math.round((s.monthlySalary / daysInMonth) * presentDays)
        : 0;

    return {
      id: s.id,
      name: s.name,
      role: s.role,
      monthlySalary: s.monthlySalary,
      presentDays,
      absentDays,
      leaveDays,
      estimatedPayout,
      estimatedLabel: formatNpr(estimatedPayout),
    };
  });
}
