// Service layer for weekend plan operations
import type { Activity, ScheduledActivity, Day, Slot } from "../types";
import { uid } from "../utils/timeUtils";

export class WeekendPlanService {
  // Creates a scheduled activity instance
  static createScheduledActivity(
    activity: Activity,
    day: Day,
    slot: Slot,
    durationHours?: number
  ): ScheduledActivity {
    return {
      id: uid("sched"),
      activity,
      day,
      slot,
      durationHours: durationHours ?? activity.duration,
    };
  }

  // Generates a randomized weekend schedule
  static generateRandomSchedule(activities: Activity[]): {
    saturday: ScheduledActivity[];
    sunday: ScheduledActivity[];
  } {
    const pickRandomActivity = (activityList: Activity[]): Activity => {
      return activityList[Math.floor(Math.random() * activityList.length)];
    };

    const getActivitiesByCategory = (
      category: Activity["category"]
    ): Activity[] => {
      return activities.filter((a) => a.category === category);
    };

    const getActivitiesForTimeSlot = (
      category: Activity["category"],
      timeSlot: "morning" | "afternoon" | "evening" | "night"
    ): Activity[] => {
      return activities.filter(
        (a) =>
          a.category === category &&
          (a.timeOfDay === timeSlot || a.timeOfDay === "any")
      );
    };

    const createDaySchedule = (day: Day): ScheduledActivity[] => {
      // Morning: Wellness activity suitable for morning
      const morningWellnessActivities = getActivitiesForTimeSlot(
        "wellness",
        "morning"
      );
      const morningActivity = this.createScheduledActivity(
        pickRandomActivity(
          morningWellnessActivities.length > 0
            ? morningWellnessActivities
            : getActivitiesByCategory("wellness")
        ),
        day,
        "morning",
        1
      );

      // Afternoon: Outdoor activity suitable for afternoon
      const afternoonOutdoorActivities = getActivitiesForTimeSlot(
        "outdoor",
        "afternoon"
      );
      const afternoonActivity = this.createScheduledActivity(
        pickRandomActivity(
          afternoonOutdoorActivities.length > 0
            ? afternoonOutdoorActivities
            : getActivitiesByCategory("outdoor")
        ),
        day,
        "afternoon",
        2
      );

      // Evening: Meal activity suitable for evening
      const eveningMealActivities = getActivitiesForTimeSlot("meal", "evening");
      const eveningActivity = this.createScheduledActivity(
        pickRandomActivity(
          eveningMealActivities.length > 0
            ? eveningMealActivities
            : getActivitiesByCategory("meal")
        ),
        day,
        "evening",
        2
      );

      // Night: Activities specifically suited for night time
      const nightActivities = activities.filter(
        (a) =>
          a.timeOfDay === "night" ||
          (a.timeOfDay === "any" &&
            ["social", "indoor", "meal"].includes(a.category))
      );

      const nightActivity = this.createScheduledActivity(
        pickRandomActivity(
          nightActivities.length > 0
            ? nightActivities
            : getActivitiesByCategory("social")
        ),
        day,
        "night",
        1
      );

      return [
        morningActivity,
        afternoonActivity,
        eveningActivity,
        nightActivity,
      ];
    };

    return {
      saturday: createDaySchedule("saturday"),
      sunday: createDaySchedule("sunday"),
    };
  }

  // Removes activities by ID from schedule
  static removeActivityFromSchedule(
    schedule: { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] },
    activityId: string
  ): { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] } {
    const removeById = (arr: ScheduledActivity[]) =>
      arr.filter((activity) => activity.id !== activityId);

    return {
      saturday: removeById(schedule.saturday),
      sunday: removeById(schedule.sunday),
    };
  }

  // Updates an activity in the schedule
  static updateActivityInSchedule(
    schedule: { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] },
    activityId: string,
    updates: Partial<Omit<ScheduledActivity, "id" | "activity">> & {
      activity?: Activity;
    }
  ): { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] } {
    const updateById = (arr: ScheduledActivity[]) =>
      arr.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              ...updates,
              activity: updates.activity ?? activity.activity,
            }
          : activity
      );

    return {
      saturday: updateById(schedule.saturday),
      sunday: updateById(schedule.sunday),
    };
  }
}
