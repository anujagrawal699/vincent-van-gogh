// Core domain types for Weekendly

export type Category = 'meal' | 'outdoor' | 'indoor' | 'social' | 'wellness' | 'creative';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
export type Energy = 'low' | 'medium' | 'high';
export type Day = 'saturday' | 'sunday';

export interface Activity {
  id: string;
  name: string;
  category: Category;
  duration: number; // hours, integer 1-4 typical
  timeOfDay: TimeOfDay;
  energy: Energy;
  icon: string; // emoji or icon key
  color: string; // hex or css color
  description: string;
}

export interface WeekendTheme {
  id: string;
  name: string;
  mood: string;
  colors: string[]; // primary palette (min 3)
  suggestedActivities: string[]; // activity ids or slugs
  backgroundPattern: string; // token name
  vanGoghPainting?: string; // name of the Van Gogh painting
  vanGoghImage?: string; // URL or path to the painting image
}

export type Slot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ScheduledActivity {
  id: string; // unique per scheduled instance
  activity: Activity;
  day: Day;
  // Start slot; duration may span multiple slots implicitly
  slot: Slot;
  durationHours: number; // default to activity.duration
}

export interface ActivityFilters {
  query: string;
  categories: Category[]; // empty => all
  energy?: Energy | 'any';
  timeOfDay?: TimeOfDay;
}

export interface WeekendPlanState {
  activities: Activity[]; // library
  schedule: {
    saturday: ScheduledActivity[];
    sunday: ScheduledActivity[];
  };
  selectedTheme: WeekendTheme | null;
  filters: ActivityFilters;
}

export type WeekendPlanAction =
  | { type: 'add'; payload: Omit<ScheduledActivity, 'id'> }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'edit'; payload: { id: string; updates: Partial<Omit<ScheduledActivity, 'id' | 'activity'>> & { activity?: Activity } } }
  | { type: 'setTheme'; payload: WeekendTheme | null }
  | { type: 'setFilters'; payload: Partial<ActivityFilters> }
  | { type: 'clear' }
  | { type: 'hydrate'; payload: Partial<WeekendPlanState> }
  | { type: 'randomize' };
