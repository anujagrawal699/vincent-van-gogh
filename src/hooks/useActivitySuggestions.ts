import { useMemo } from 'react';
import type { Activity } from '../types';
import { useWeekendPlan } from './useWeekendPlan';

export function useActivitySuggestions() {
  const { state } = useWeekendPlan();

  const filtered = useMemo(() => {
    const q = state.filters.query.toLowerCase();
    // User filters only — no weather gating here so category filters (e.g., Outdoor) always work
    return state.activities.filter(a => {
      const matchesQ = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
      const matchesCat = state.filters.categories.length === 0 || state.filters.categories.includes(a.category);
      const matchesEnergy = state.filters.energy === 'any' || a.energy === state.filters.energy;
      const matchesTime = state.filters.timeOfDay === 'any' || a.timeOfDay === state.filters.timeOfDay || a.timeOfDay === 'any';
      return matchesQ && matchesCat && matchesEnergy && matchesTime;
    });
  }, [state.activities, state.filters]);

  const suggestions: Activity[] = useMemo(() => {
    // Don't show suggestions if any filter is active or theme is default/null
    const hasActiveFilters = state.filters.query !== '' || 
                            state.filters.categories.length > 0 || 
                            state.filters.energy !== 'any' || 
                            state.filters.timeOfDay !== 'any';
    const isDefaultOrNoTheme = !state.selectedTheme || state.selectedTheme.id === 'default';
    
    if (hasActiveFilters || isDefaultOrNoTheme) {
      return [];
    }
    
    // pick 5 diverse items favoring theme suggestedActivities if available
    const themedIds = state.selectedTheme?.suggestedActivities ?? [];
    const themed = filtered.filter(a => themedIds.includes(a.id));
    const rest = filtered.filter(a => !themedIds.includes(a.id));
    const take = <T,>(arr: T[], n: number) => arr.slice(0, Math.max(0, Math.min(n, arr.length)));
    return [...take(themed, 3), ...take(rest, 5 - Math.min(3, themed.length))];
  }, [filtered, state.selectedTheme, state.filters]);

  return { filtered, suggestions };
}
