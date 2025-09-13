import type { Activity } from "../types";

export const activities: Activity[] = [
  // Meals
  { id: 'brunch-001', name: 'Weekend Brunch', category: 'meal', duration: 2, timeOfDay: 'morning', energy: 'medium', icon: '🥐', color: '#FFE4B5', description: 'Leisurely morning meal with friends or family' },
  { id: 'cook-001', name: 'Cooking Together', category: 'meal', duration: 2, timeOfDay: 'evening', energy: 'low', icon: '🍳', color: '#FFDAB9', description: 'Prepare a meal as a pair or group' },
  { id: 'dinner-party-001', name: 'Dinner Party', category: 'meal', duration: 3, timeOfDay: 'evening', energy: 'medium', icon: '🍝', color: '#FFDEB4', description: 'Host or attend a cozy dinner party' },
  
  // Outdoor
  { id: 'hike-001', name: 'Nature Hike', category: 'outdoor', duration: 3, timeOfDay: 'any', energy: 'high', icon: '🥾', color: '#90EE90', description: 'Explore trails and enjoy fresh air' },
  { id: 'picnic-001', name: 'Park Picnic', category: 'outdoor', duration: 2, timeOfDay: 'afternoon', energy: 'low', icon: '🧺', color: '#C8FACC', description: 'Relax with snacks and games at a park' },
  { id: 'market-001', name: 'Farmers Market', category: 'outdoor', duration: 2, timeOfDay: 'morning', energy: 'medium', icon: '🥕', color: '#E0FFD7', description: 'Browse fresh produce and local goods' },
  { id: 'sunset-001', name: 'Sunset Walk', category: 'outdoor', duration: 1, timeOfDay: 'evening', energy: 'low', icon: '🌇', color: '#FFD1A1', description: 'Stroll and enjoy the sunset colors' },
  
  // Indoor
  { id: 'movie-001', name: 'Movie Marathon', category: 'indoor', duration: 3, timeOfDay: 'evening', energy: 'low', icon: '🎬', color: '#D1D5DB', description: 'Pick a theme and watch a series' },
  { id: 'board-001', name: 'Board Games', category: 'indoor', duration: 2, timeOfDay: 'evening', energy: 'medium', icon: '🎲', color: '#F3E8FF', description: 'Strategy, party, or co-op games' },
  { id: 'reading-001', name: 'Reading Time', category: 'indoor', duration: 2, timeOfDay: 'any', energy: 'low', icon: '📚', color: '#E5E7EB', description: 'Cozy up with a good book' },
  { id: 'spa-001', name: 'Home Spa', category: 'indoor', duration: 2, timeOfDay: 'evening', energy: 'low', icon: '🧖‍♀️', color: '#E0F7F4', description: 'Face masks, bath, and candles' },
  
  // Social
  { id: 'friends-001', name: 'Friends Hangout', category: 'social', duration: 3, timeOfDay: 'any', energy: 'medium', icon: '🧑‍🤝‍🧑', color: '#FFE0F0', description: 'Meet up or host a get-together' },
  { id: 'family-001', name: 'Family Time', category: 'social', duration: 3, timeOfDay: 'any', energy: 'medium', icon: '👨‍👩‍👧‍👦', color: '#FFF0D9', description: 'Quality time with family' },
  { id: 'date-001', name: 'Date Night', category: 'social', duration: 3, timeOfDay: 'evening', energy: 'medium', icon: '💞', color: '#FFD6E7', description: 'Romantic evening plan' },
  
  // Wellness
  { id: 'yoga-001', name: 'Morning Yoga', category: 'wellness', duration: 1, timeOfDay: 'morning', energy: 'low', icon: '🧘', color: '#E6FFFA', description: 'Gentle flow to start the day' },
  { id: 'meditation-001', name: 'Meditation', category: 'wellness', duration: 1, timeOfDay: 'any', energy: 'low', icon: '🧘‍♂️', color: '#DFF7FF', description: 'Mindfulness and breathing' },
  { id: 'gym-001', name: 'Gym Session', category: 'wellness', duration: 1, timeOfDay: 'any', energy: 'high', icon: '🏋️', color: '#E2E8F0', description: 'Strength or cardio workout' },
  
  // Creative
  { id: 'art-001', name: 'Art Project', category: 'creative', duration: 2, timeOfDay: 'afternoon', energy: 'medium', icon: '🎨', color: '#FFE4E1', description: 'Painting, crafting, or DIY' },
  { id: 'music-001', name: 'Music Jam', category: 'creative', duration: 2, timeOfDay: 'evening', energy: 'medium', icon: '🎶', color: '#E1E5FF', description: 'Play instruments or sing' },
  { id: 'writing-001', name: 'Writing Session', category: 'creative', duration: 2, timeOfDay: 'morning', energy: 'low', icon: '✍️', color: '#FFF4D6', description: 'Journal or work on a story' },
  
  // Night activities
  { id: 'stargaze-001', name: 'Stargazing', category: 'outdoor', duration: 2, timeOfDay: 'night', energy: 'low', icon: '✨', color: '#C7D2FE', description: 'Find a dark spot and watch the night sky' },
  { id: 'karaoke-001', name: 'Karaoke Night', category: 'social', duration: 2, timeOfDay: 'night', energy: 'medium', icon: '🎤', color: '#FBCFE8', description: 'Sing your heart out with friends' },
  { id: 'gaming-001', name: 'Late-night Gaming', category: 'indoor', duration: 3, timeOfDay: 'night', energy: 'medium', icon: '🕹️', color: '#E5E7EB', description: 'Co-op or online gaming session' },
];

export const categoryLabels: Record<Activity['category'], string> = {
  meal: 'Meals',
  outdoor: 'Outdoor',
  indoor: 'Indoor',
  social: 'Social',
  wellness: 'Wellness',
  creative: 'Creative',
};
