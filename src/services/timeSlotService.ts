// Service for handling time slot conflicts and calculations
import type { ScheduledActivity, Slot } from "../types";

export const SLOT_WINDOWS = {
  morning: { start: "08:00", end: "12:00", capacityHours: 4 },
  afternoon: { start: "12:00", end: "17:00", capacityHours: 5 },
  evening: { start: "17:00", end: "21:00", capacityHours: 4 },
  night: { start: "21:00", end: "02:00", capacityHours: 5 },
} as const;

export const TIME_SLOTS: readonly Slot[] = [
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;

export class TimeSlotService {
  static detectConflicts(activities: ScheduledActivity[]): {
    hasConflict: boolean;
    conflictsByDay: { saturday: boolean; sunday: boolean };
  } {
    const conflictsByDay = { saturday: false, sunday: false };

    (["saturday", "sunday"] as const).forEach((day) => {
      const dayActivities = activities.filter((a) => a.day === day);

      TIME_SLOTS.forEach((slot) => {
        const inSlot = dayActivities.filter((a) => a.slot === slot);
        if (!inSlot.length) return;

        const total = inSlot.reduce((sum, a) => sum + a.durationHours, 0);
        if (total > SLOT_WINDOWS[slot].capacityHours) {
          conflictsByDay[day] = true;
        }
      });
    });

    return {
      hasConflict: conflictsByDay.saturday || conflictsByDay.sunday,
      conflictsByDay,
    };
  }
}
