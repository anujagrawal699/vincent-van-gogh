import type { WeekendTheme } from "../types";
import { vanGoghPaintings } from "./vanGoghBackgrounds";

export const themes: WeekendTheme[] = [
  {
    id: "adventure-seeker",
    name: "Adventure Seeker",
    mood: "energetic",
    colors: ["#E6FFFB", "#99F6E4", "#06B6D4"],
    suggestedActivities: ["hike-001", "market-001", "sunset-001", "gym-001"],
    backgroundPattern: "triangles",
    vanGoghPainting: vanGoghPaintings["adventure-seeker"].name,
    vanGoghImage: `/${vanGoghPaintings["adventure-seeker"].imageUrl}`,
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
    backgroundPattern: "confetti",
    vanGoghPainting: vanGoghPaintings["social-butterfly"].name,
    vanGoghImage: `/${vanGoghPaintings["social-butterfly"].imageUrl}`,
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
    backgroundPattern: "leaves",
    vanGoghPainting: vanGoghPaintings["wellness-warrior"].name,
    vanGoghImage: `/${vanGoghPaintings["wellness-warrior"].imageUrl}`,
  },
  {
    id: "cozy-homebody",
    name: "Cozy Homebody",
    mood: "relaxed",
    colors: ["#F5E6D3", "#E7C2A1", "#D4A574"],
    suggestedActivities: ["reading-001", "cook-001", "movie-001", "spa-001"],
    backgroundPattern: "soft-waves",
    vanGoghPainting: vanGoghPaintings["cozy-homebody"].name,
    vanGoghImage: `/${vanGoghPaintings["cozy-homebody"].imageUrl}`,
  },
  {
    id: "creative-artist",
    name: "Creative Artist",
    mood: "inspired",
    colors: ["#FEF3C7", "#FCD34D", "#F59E0B"],
    suggestedActivities: ["art-001", "music-001", "writing-001", "market-001"],
    backgroundPattern: "brushstrokes",
    vanGoghPainting: vanGoghPaintings["creative-artist"].name,
    vanGoghImage: `/${vanGoghPaintings["creative-artist"].imageUrl}`,
  },
];

export const getThemeById = (id: string) =>
  themes.find((t) => t.id === id) || null;
