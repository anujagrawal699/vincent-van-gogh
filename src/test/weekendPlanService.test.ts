import { describe, it, expect } from 'vitest';
import { WeekendPlanService } from '../services/weekendPlanService';
import type { Activity, ScheduledActivity } from '../types';

const mockActivity: Activity = {
  id: 'test-activity',
  name: 'Test Activity',
  category: 'indoor',
  duration: 2,
  timeOfDay: 'morning',
  energy: 'medium',
  icon: '🎯',
  color: '#FF0000',
  description: 'A test activity',
};

const mockActivities: Activity[] = [
  mockActivity,
  {
    id: 'wellness-activity',
    name: 'Yoga',
    category: 'wellness',
    duration: 1,
    timeOfDay: 'morning',
    energy: 'low',
    icon: '🧘',
    color: '#00FF00',
    description: 'Morning yoga session',
  },
  {
    id: 'outdoor-activity',
    name: 'Hiking',
    category: 'outdoor',
    duration: 3,
    timeOfDay: 'afternoon',
    energy: 'high',
    icon: '🥾',
    color: '#0000FF',
    description: 'Nature hike',
  },
];

describe('WeekendPlanService', () => {
  describe('createScheduledActivity', () => {
    it('creates a scheduled activity with provided parameters', () => {
      const result = WeekendPlanService.createScheduledActivity(
        mockActivity,
        'saturday',
        'morning',
        3
      );

      expect(result).toMatchObject({
        activity: mockActivity,
        day: 'saturday',
        slot: 'morning',
        durationHours: 3,
      });
      expect(result.id).toMatch(/^sched-/);
    });

    it('uses activity duration when duration is not provided', () => {
      const result = WeekendPlanService.createScheduledActivity(
        mockActivity,
        'sunday',
        'afternoon'
      );

      expect(result.durationHours).toBe(mockActivity.duration);
    });
  });

  describe('generateRandomSchedule', () => {
    it('generates a schedule for both days', () => {
      const result = WeekendPlanService.generateRandomSchedule(mockActivities);

      expect(result).toHaveProperty('saturday');
      expect(result).toHaveProperty('sunday');
      expect(result.saturday).toHaveLength(4);
      expect(result.sunday).toHaveLength(4);
    });
  });

  describe('removeActivityFromSchedule', () => {
    const mockSchedule = {
      saturday: [
        WeekendPlanService.createScheduledActivity(mockActivity, 'saturday', 'morning'),
      ] as ScheduledActivity[],
      sunday: [
        WeekendPlanService.createScheduledActivity(mockActivity, 'sunday', 'afternoon'),
      ] as ScheduledActivity[],
    };

    it('removes activity by ID from the correct day', () => {
      const activityToRemove = mockSchedule.saturday[0];
      const result = WeekendPlanService.removeActivityFromSchedule(
        mockSchedule,
        activityToRemove.id
      );

      expect(result.saturday).toHaveLength(0);
      expect(result.sunday).toHaveLength(1);
    });
  });

  describe('updateActivityInSchedule', () => {
    const mockSchedule = {
      saturday: [
        WeekendPlanService.createScheduledActivity(mockActivity, 'saturday', 'morning'),
      ] as ScheduledActivity[],
      sunday: [] as ScheduledActivity[],
    };

    it('updates activity properties', () => {
      const activityToUpdate = mockSchedule.saturday[0];
      const updates = {
        day: 'sunday' as const,
        slot: 'evening' as const,
        durationHours: 4,
      };

      const result = WeekendPlanService.updateActivityInSchedule(
        mockSchedule,
        activityToUpdate.id,
        updates
      );

      const updatedActivity = result.saturday[0];
      expect(updatedActivity.day).toBe('sunday');
      expect(updatedActivity.slot).toBe('evening');
      expect(updatedActivity.durationHours).toBe(4);
    });
  });
});
