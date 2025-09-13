import { useContext } from 'react';
import { WeekendPlanContext } from '../context/weekendPlanContext';

export function useWeekendPlan() {
  const ctx = useContext(WeekendPlanContext);
  if (!ctx) throw new Error('useWeekendPlan must be used within WeekendPlanProvider');
  return ctx;
}
