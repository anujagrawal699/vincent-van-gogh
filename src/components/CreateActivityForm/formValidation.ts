import type { Category } from "../../types";

export interface FormData {
  name: string;
  category: Category;
  duration: number;
  timeOfDay: "any" | "morning" | "afternoon" | "evening" | "night";
  energy: "low" | "medium" | "high";
  icon: string;
  description: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Activity name is required";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required";
  }

  if (formData.duration < 1 || formData.duration > 8) {
    errors.duration = "Duration must be between 1 and 8 hours";
  }

  return errors;
};

export const getCategoryColor = (category: Category): string => {
  const colors = {
    meal: "#FFE4B5",
    outdoor: "#90EE90",
    indoor: "#D1D5DB",
    social: "#FFE0F0",
    wellness: "#E6FFFA",
    creative: "#FFE4E1",
  };
  return colors[category];
};

export const createInitialFormData = (): FormData => ({
  name: "",
  category: "indoor" as Category,
  duration: 2,
  timeOfDay: "any",
  energy: "medium",
  icon: "🎯",
  description: "",
});
