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

describe("TimeSlotService (simplified)", () => {
  describe("detectConflicts", () => {
    it("returns no conflict for empty list", () => {
      const result = TimeSlotService.detectConflicts([]);
      expect(result.hasConflict).toBe(false);
      expect(result.conflictsByDay.saturday).toBe(false);
      expect(result.conflictsByDay.sunday).toBe(false);
    });

    it("returns no conflicts when all slots are under or exactly at capacity", () => {
      // morning capacity = 4, afternoon = 5
      const activities = [
        createMockActivity("1", "saturday", "morning", 2),
        createMockActivity("2", "saturday", "morning", 2), // total 4 = capacity
        createMockActivity("3", "saturday", "afternoon", 5), // exactly capacity
      ];
      const result = TimeSlotService.detectConflicts(activities);
      expect(result.hasConflict).toBe(false);
      expect(result.conflictsByDay.saturday).toBe(false);
    });

    it("detects conflict when a slot exceeds capacity (single day)", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 3),
        createMockActivity("2", "saturday", "morning", 2),
        createMockActivity("3", "saturday", "afternoon", 1),
      ];
      const result = TimeSlotService.detectConflicts(activities);
      expect(result.hasConflict).toBe(true);
      expect(result.conflictsByDay.saturday).toBe(true);
      expect(result.conflictsByDay.sunday).toBe(false);
    });

    it("detects conflict isolated to sunday", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 2),
        createMockActivity("2", "sunday", "morning", 3),
        createMockActivity("3", "sunday", "morning", 2), // 5 > 4
      ];
      const result = TimeSlotService.detectConflicts(activities);
      expect(result.hasConflict).toBe(true);
      expect(result.conflictsByDay.saturday).toBe(false);
      expect(result.conflictsByDay.sunday).toBe(true);
    });

    it("detects conflicts on both days independently", () => {
      const activities = [
        // Saturday morning over (5 > 4)
        createMockActivity("1", "saturday", "morning", 3),
        createMockActivity("2", "saturday", "morning", 2),
        // Sunday evening over (5 > 4)
        createMockActivity("3", "sunday", "evening", 4),
        createMockActivity("4", "sunday", "evening", 1),
      ];
      const result = TimeSlotService.detectConflicts(activities);
      expect(result.hasConflict).toBe(true);
      expect(result.conflictsByDay.saturday).toBe(true);
      expect(result.conflictsByDay.sunday).toBe(true);
    });

    it("does not report conflict when different slots have separate loads under capacity", () => {
      const activities = [
        createMockActivity("1", "saturday", "morning", 2),
        createMockActivity("2", "saturday", "afternoon", 3),
        createMockActivity("3", "saturday", "evening", 4), // exactly evening capacity
      ];
      const result = TimeSlotService.detectConflicts(activities);
      expect(result.hasConflict).toBe(false);
      expect(result.conflictsByDay.saturday).toBe(false);
    });

    it("boundary: just over capacity triggers conflict", () => {
      const activities = [
        createMockActivity("1", "saturday", "evening", 4),
        createMockActivity("2", "saturday", "evening", 1),
      ];
      const result = TimeSlotService.detectConflicts(activities);
      expect(result.hasConflict).toBe(true);
      expect(result.conflictsByDay.saturday).toBe(true);
    });
  });
});