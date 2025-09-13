import React, { useEffect, useMemo, useReducer } from "react";
import { WeekendPlanContext } from "../context/weekendPlanContext";
import { TimeSlotService } from "../services/timeSlotService";
import { initialState, reducer } from "../hooks/weekendPlanCore";

export function WeekendPlanProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem("weekendly-state");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          dispatch({ type: "hydrate", payload: parsed });
        }
      }
    } catch (err) {
      console.warn("Failed to load saved plan", err);
    }
  }, []);
  // persist
  useEffect(() => {
    try {
      localStorage.setItem("weekendly-state", JSON.stringify(state));
    } catch (err) {
      console.warn("Failed to save plan", err);
    }
  }, [state]);
  const conflicts = useMemo(
    () =>
      TimeSlotService.detectConflicts([
        ...state.schedule.saturday,
        ...state.schedule.sunday,
      ]),
    [state.schedule]
  );
  const value = useMemo(
    () => ({ state, dispatch, conflicts }),
    [state, conflicts]
  );
  return (
    <WeekendPlanContext.Provider value={value}>
      {children}
    </WeekendPlanContext.Provider>
  );
}

export default WeekendPlanProvider;
