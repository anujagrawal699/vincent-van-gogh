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
  // Gets the index of a time slot
  static getSlotIndex(slot: Slot): number {
    return TIME_SLOTS.indexOf(slot);
  }

  // Determines which slots an activity spans based on its duration
  static getSpannedSlots(startSlot: Slot, durationHours: number): Slot[] {
    const result: Slot[] = [];
    let remainingHours = Math.max(0, durationHours);
    let currentSlotIndex = this.getSlotIndex(startSlot);

    while (remainingHours > 0 && currentSlotIndex < TIME_SLOTS.length) {
      const slot = TIME_SLOTS[currentSlotIndex];
      if (slot) {
        result.push(slot);
        remainingHours -= SLOT_WINDOWS[slot].capacityHours;
        currentSlotIndex++;
      } else {
        break;
      }
    }

    return result.length > 0 ? result : [startSlot];
  }

  // Checks if two activities have a time conflict
  static hasConflict(
    activityA: ScheduledActivity,
    activityB: ScheduledActivity
  ): boolean {
    if (activityA.day !== activityB.day) {
      return false;
    }

    const slotsA = this.getSpannedSlots(
      activityA.slot,
      activityA.durationHours
    );
    const slotsB = this.getSpannedSlots(
      activityB.slot,
      activityB.durationHours
    );

    // Check if activities share any time slots
    return slotsA.some((slotA) => slotsB.includes(slotA));
  }

  // Detects all conflicts in a list of scheduled activities
  static detectConflicts(activities: ScheduledActivity[]): {
    hasConflict: boolean;
    conflictPairs: [ScheduledActivity, ScheduledActivity][];
  } {
    const conflictPairs: [ScheduledActivity, ScheduledActivity][] = [];

    const activitiesByDay = this.groupActivitiesByDay(activities);

    (["saturday", "sunday"] as const).forEach((day) => {
      const dayActivities = activitiesByDay[day];
      this.findConflictsInDay(dayActivities, conflictPairs);
    });

    return {
      hasConflict: conflictPairs.length > 0,
      conflictPairs,
    };
  }

  // Groups activities by day
  private static groupActivitiesByDay(activities: ScheduledActivity[]) {
    const byDay: Record<"saturday" | "sunday", ScheduledActivity[]> = {
      saturday: [],
      sunday: [],
    };

    activities.forEach((activity) => {
      byDay[activity.day].push(activity);
    });

    return byDay;
  }

  // Finds conflicts within a single day's activities
  private static findConflictsInDay(
    dayActivities: ScheduledActivity[],
    conflictPairs: [ScheduledActivity, ScheduledActivity][]
  ): void {
    TIME_SLOTS.forEach((slot) => {
      const activitiesInSlot = dayActivities.filter((activity) =>
        this.getSpannedSlots(activity.slot, activity.durationHours).includes(
          slot
        )
      );

      const totalDuration = activitiesInSlot.reduce(
        (sum, activity) => sum + activity.durationHours,
        0
      );

      if (totalDuration > SLOT_WINDOWS[slot].capacityHours) {
        this.addConflictPairs(activitiesInSlot, conflictPairs);
      }
    });
  }

  // Adds all possible pairs from a list of conflicting activities
  private static addConflictPairs(
    conflictingActivities: ScheduledActivity[],
    conflictPairs: [ScheduledActivity, ScheduledActivity][]
  ): void {
    for (let i = 0; i < conflictingActivities.length; i++) {
      for (let j = i + 1; j < conflictingActivities.length; j++) {
        const activityA = conflictingActivities[i];
        const activityB = conflictingActivities[j];
        if (activityA && activityB) {
          conflictPairs.push([activityA, activityB]);
        }
      }
    }
  }

  // Calculates the total duration of activities in a specific slot
  static getTotalDurationInSlot(
    activities: ScheduledActivity[],
    slot: Slot
  ): number {
    return activities
      .filter((activity) =>
        this.getSpannedSlots(activity.slot, activity.durationHours).includes(
          slot
        )
      )
      .reduce((sum, activity) => sum + activity.durationHours, 0);
  }

  // Checks if a slot is over capacity
  static isSlotOverCapacity(
    activities: ScheduledActivity[],
    slot: Slot
  ): boolean {
    const totalDuration = this.getTotalDurationInSlot(activities, slot);
    return totalDuration > SLOT_WINDOWS[slot].capacityHours;
  }
}
