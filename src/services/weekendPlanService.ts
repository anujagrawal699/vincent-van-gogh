// Service layer for weekend plan operations
import type { Activity, ScheduledActivity, Day, Slot } from '../types';
import { uid } from '../utils/timeUtils';

export class WeekendPlanService {
  // Creates a scheduled activity instance
  static createScheduledActivity(
    activity: Activity,
    day: Day,
    slot: Slot,
    durationHours?: number
  ): ScheduledActivity {
    return {
      id: uid('sched'),
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

    const getActivitiesByCategory = (category: Activity['category']): Activity[] => {
      return activities.filter(a => a.category === category);
    };

      const createDaySchedule = (day: Day): ScheduledActivity[] => {
      // Morning: Wellness activity
      const morningActivity = this.createScheduledActivity(
        pickRandomActivity(getActivitiesByCategory('wellness')),
        day,
        'morning',
        1
      );

      // Afternoon: Outdoor activity
      const afternoonActivity = this.createScheduledActivity(
        pickRandomActivity(getActivitiesByCategory('outdoor')),
        day,
        'afternoon',
        2
      );

      // Evening: Meal activity
      const eveningActivity = this.createScheduledActivity(
        pickRandomActivity(getActivitiesByCategory('meal')),
        day,
        'evening',
        2
      );

      // Night: Mix of social/outdoor/indoor/meal activities
      const nightCategoryPool: Activity[] = [
        ...getActivitiesByCategory('social'),
        ...getActivitiesByCategory('outdoor'),
        ...getActivitiesByCategory('indoor'),
        ...getActivitiesByCategory('meal'),
      ];

      const nightActivity = this.createScheduledActivity(
        pickRandomActivity(nightCategoryPool),
        day,
        'night',
        1
      );

      return [morningActivity, afternoonActivity, eveningActivity, nightActivity];
    };

    return {
      saturday: createDaySchedule('saturday'),
      sunday: createDaySchedule('sunday'),
    };
  }

  // Removes activities by ID from schedule
  static removeActivityFromSchedule(
    schedule: { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] },
    activityId: string
  ): { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] } {
    const removeById = (arr: ScheduledActivity[]) => 
      arr.filter(activity => activity.id !== activityId);

    return {
      saturday: removeById(schedule.saturday),
      sunday: removeById(schedule.sunday),
    };
  }

  // Updates an activity in the schedule
  static updateActivityInSchedule(
    schedule: { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] },
    activityId: string,
    updates: Partial<Omit<ScheduledActivity, 'id' | 'activity'>> & { activity?: Activity }
  ): { saturday: ScheduledActivity[]; sunday: ScheduledActivity[] } {
    const updateById = (arr: ScheduledActivity[]) =>
      arr.map(activity =>
        activity.id === activityId
          ? { ...activity, ...updates, activity: updates.activity ?? activity.activity }
          : activity
      );

    return {
      saturday: updateById(schedule.saturday),
      sunday: updateById(schedule.sunday),
    };
  }
}
