import type { WeekendPlanAction, WeekendPlanState } from "../types";
import { activities as defaultActivities } from "../utils/activityData";
import { WeekendPlanService } from "../services/weekendPlanService";

export const initialState: WeekendPlanState = {
  activities: defaultActivities,
  schedule: { saturday: [], sunday: [] },
  selectedTheme: null,
  filters: { query: "", categories: [], energy: "any", timeOfDay: "any" },
};

export function reducer(
  state: WeekendPlanState,
  action: WeekendPlanAction
): WeekendPlanState {
  switch (action.type) {
    case "add": {
      const scheduledActivity = WeekendPlanService.createScheduledActivity(
        action.payload.activity,
        action.payload.day,
        action.payload.slot,
        action.payload.durationHours
      );

      const dayList = state.schedule[scheduledActivity.day];
      const nextList = [...dayList, scheduledActivity];
      return {
        ...state,
        schedule: { ...state.schedule, [scheduledActivity.day]: nextList },
      };
    }

    case "remove": {
      const updatedSchedule = WeekendPlanService.removeActivityFromSchedule(
        state.schedule,
        action.payload.id
      );
      return { ...state, schedule: updatedSchedule };
    }

    case "edit": {
      const updatedSchedule = WeekendPlanService.updateActivityInSchedule(
        state.schedule,
        action.payload.id,
        action.payload.updates
      );
      return { ...state, schedule: updatedSchedule };
    }

    case "setTheme":
      return { ...state, selectedTheme: action.payload };

    case "setFilters":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "clear":
      return { ...state, schedule: { saturday: [], sunday: [] } };

    case "hydrate": {
      const payload = action.payload as Partial<WeekendPlanState>;
      const selectedTheme = payload.selectedTheme?.id === "default" ? null : payload.selectedTheme;
      
      // Merge saved custom activities with default activities
      const savedCustomActivities = payload.activities?.filter(a => a.id.startsWith('custom-')) || [];
      const mergedActivities = [...defaultActivities, ...savedCustomActivities];
      
      return {
        ...state,
        ...payload,
        activities: mergedActivities,
        selectedTheme,
      } as WeekendPlanState;
    }

    case "addCustomActivity":
      return { 
        ...state, 
        activities: [...state.activities, action.payload] 
      };

    case "randomize": {
      const randomSchedule = WeekendPlanService.generateRandomSchedule(
        state.activities
      );
      return { ...state, schedule: randomSchedule };
    }

    default:
      return state;
  }
}
