import { describe, it, expect } from "vitest";
import { TimeSlotService } from "../services/timeSlotService";
import type { ScheduledActivity } from "../types";

const createMockActivity = (
  id: string,
  day: "saturday" | "sunday",
  slot: "morning" | "afternoon" | "evening" | "night",
  duration: number
): ScheduledActivity => ({
  id,
  day,
  slot,
  durationHours: duration,
  activity: {
    id: `activity-${id}`,
    name: `Test Activity ${id}`,
    category: "indoor",
    duration,
    timeOfDay: "any",
    energy: "medium",
    icon: "🎯",
    color: "#FF0000",
    description: "Test activity",
  },
});

describe("TimeSlotService", () => {
  describe("getSlotIndex", () => {
    it("returns correct index for each slot", () => {
      expect(TimeSlotService.getSlotIndex("morning")).toBe(0);
      expect(TimeSlotService.getSlotIndex("afternoon")).toBe(1);
      expect(TimeSlotService.getSlotIndex("evening")).toBe(2);
      expect(TimeSlotService.getSlotIndex("night")).toBe(3);
    });
  });

  describe("getSpannedSlots", () => {
    it("returns single slot for short duration", () => {
      const result = TimeSlotService.getSpannedSlots("morning", 2);
      expect(result).toEqual(["morning"]);
    });

    it("returns multiple slots for long duration", () => {
      const result = TimeSlotService.getSpannedSlots("morning", 6);
      expect(result).toEqual(["morning", "afternoon"]);
    });
  });

  describe("hasConflict", () => {
    it("returns false for activities on different days", () => {
      const activityA = createMockActivity("1", "saturday", "morning", 2);
      const activityB = createMockActivity("2", "sunday", "morning", 2);

      expect(TimeSlotService.hasConflict(activityA, activityB)).toBe(false);
    });

    it("returns true for activities in the same slot", () => {
      const activityA = createMockActivity("1", "saturday", "morning", 2);
      const activityB = createMockActivity("2", "saturday", "morning", 2);

      expect(TimeSlotService.hasConflict(activityA, activityB)).toBe(true);
    });

    it("returns true for activities that span overlapping slots", () => {
      const activityA = createMockActivity("1", "saturday", "morning", 6);
      const activityB = createMockActivity("2", "saturday", "afternoon", 2);

      expect(TimeSlotService.hasConflict(activityA, activityB)).toBe(true);
    });
  });

  describe("detectConflicts", () => {
    it("returns no conflicts for non-overlapping activities", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 2),
        createMockActivity("2", "saturday", "afternoon", 2),
        createMockActivity("3", "sunday", "morning", 2),
      ];

      const result = TimeSlotService.detectConflicts(activities);

      expect(result.hasConflict).toBe(false);
      expect(result.conflictPairs).toHaveLength(0);
    });

    it("detects conflicts when slot capacity is exceeded", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 3),
        createMockActivity("2", "saturday", "morning", 2),
      ];

      const result = TimeSlotService.detectConflicts(activities);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictPairs).toHaveLength(1);
    });
  });

  describe("getTotalDurationInSlot", () => {
    it("calculates total duration for activities in a slot", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 2),
        createMockActivity("2", "saturday", "morning", 1),
        createMockActivity("3", "saturday", "afternoon", 3),
      ];

      const total = TimeSlotService.getTotalDurationInSlot(
        activities,
        "morning"
      );
      expect(total).toBe(3);
    });
  });

  describe("isSlotOverCapacity", () => {
    it("returns true when slot is over capacity", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 3),
        createMockActivity("2", "saturday", "morning", 2),
      ];

      expect(TimeSlotService.isSlotOverCapacity(activities, "morning")).toBe(
        true
      );
    });

    it("returns false when slot is at or under capacity", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 2),
        createMockActivity("2", "saturday", "morning", 2),
      ];

      expect(TimeSlotService.isSlotOverCapacity(activities, "morning")).toBe(
        false
      );
    });
  });
});
