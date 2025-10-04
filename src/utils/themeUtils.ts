import type { WeekendTheme } from "../types";
import { vanGoghPaintings } from "./vanGoghBackgrounds";

export const themes: WeekendTheme[] = [
  {
    id: "adventure-seeker",
    name: "Adventure Seeker",
    mood: "energetic",
    colors: ["#E6FFFB", "#99F6E4", "#06B6D4"],
    suggestedActivities: ["hike-001", "market-001", "sunset-001", "gym-001"],
    vanGoghPainting: vanGoghPaintings["adventure-seeker"].name,
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    mood: "extroverted",
    colors: ["#FFE0F0", "#FFB3D1", "#FF6EA7"],
    suggestedActivities: [
      "friends-001",
      "date-001",
      "board-001",
      "karaoke-001",
    ],
    vanGoghPainting: vanGoghPaintings["social-butterfly"].name,
  },
  {
    id: "wellness-warrior",
    name: "Wellness Warrior",
    mood: "balanced",
    colors: ["#D1FAE5", "#A7F3D0", "#34D399"],
    suggestedActivities: [
      "yoga-001",
      "meditation-001",
      "hike-001",
      "sunset-001",
    ],
    vanGoghPainting: vanGoghPaintings["wellness-warrior"].name,
  },
  {
    id: "cozy-homebody",
    name: "Cozy Homebody",
    mood: "relaxed",
    colors: ["#F5E6D3", "#E7C2A1", "#D4A574"],
    suggestedActivities: ["reading-001", "cook-001", "movie-001", "spa-001"],
    vanGoghPainting: vanGoghPaintings["cozy-homebody"].name,
  },
  {
    id: "creative-artist",
    name: "Creative Artist",
    mood: "inspired",
    colors: ["#FEF3C7", "#FCD34D", "#F59E0B"],
    suggestedActivities: ["art-001", "music-001", "writing-001", "market-001"],
    vanGoghPainting: vanGoghPaintings["creative-artist"].name,
  },
];

export const getThemeById = (id: string) =>
  themes.find((t) => t.id === id) || null;
