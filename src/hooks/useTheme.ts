import { useMemo, useCallback } from 'react';
import { themes } from '../utils/themeUtils';
import { useWeekendPlan } from './useWeekendPlan';
import type { WeekendTheme } from '../types';

export function useTheme() {
  const { state, dispatch } = useWeekendPlan();
  const theme = state.selectedTheme;
  const palette = useMemo(() => theme?.colors ?? ['#111827', '#374151', '#9CA3AF'], [theme]);
  const defaultTheme: WeekendTheme = useMemo(() => ({
    id: 'default',
    name: 'Default',
    mood: 'classic',
    colors: ['#111827', '#374151', '#9CA3AF'],
    suggestedActivities: [],
    backgroundPattern: 'none',
    vanGoghPainting: 'The Mulberry Tree',
    vanGoghImage: '/mulberry-tree.jpg'
  }), []);

  const allThemes = useMemo(() => [defaultTheme, ...themes.filter(t => t.id !== 'default')], [defaultTheme]);

  const setThemeById = useCallback((id: string | null) => {
    if (!id || id === 'default') {
      dispatch({ type: 'setTheme', payload: null });
      return;
    }
    const next = themes.find(t => t.id === id) ?? null;
    dispatch({ type: 'setTheme', payload: next });
  }, [dispatch]);

  return useMemo(() => ({ theme, palette, allThemes, setThemeById }), [theme, palette, allThemes, setThemeById]);
}
