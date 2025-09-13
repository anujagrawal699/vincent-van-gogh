import { createContext } from "react";
import type { WeekendPlanState, WeekendPlanAction } from "../types";
import { TimeSlotService } from "../services/timeSlotService";

export type WeekendPlanCtx = {
  state: WeekendPlanState;
  dispatch: React.Dispatch<WeekendPlanAction>;
  conflicts: ReturnType<typeof TimeSlotService.detectConflicts>;
};

export const WeekendPlanContext = createContext<WeekendPlanCtx | undefined>(
  undefined
);
