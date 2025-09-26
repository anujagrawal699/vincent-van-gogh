import { GoogleGenerativeAI } from "@google/generative-ai";
import type { WeekendSchedule, ScheduledActivity } from "../types";

export class AIAnalysisService {
  private genAI: GoogleGenerativeAI | null = null;
  private preferredModel: string | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.preferredModel =
      (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? null;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  private getSystemPrompt(): string {
    return `You are a friendly weekend planning assistant. Look at this weekend schedule and give a casual, conversational analysis in 2-3 sentences. Be warm and helpful, like talking to a friend about their weekend plans.

Focus on what's working well and gentle suggestions for improvement. Keep it natural and conversational - no bullet points, lists, or formal structure. Just friendly observations about their weekend balance, energy flow, and any gaps you notice.

Write as if you're having a casual conversation about weekend plans.`;
  }

  private formatScheduleForAI(schedule: WeekendSchedule): string {
    const formatDay = (
      day: "saturday" | "sunday",
      activities: ScheduledActivity[]
    ) => {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      const slots = ["morning", "afternoon", "evening", "night"] as const;

      const slotActivities = slots.map((slot) => {
        const activity = activities.find((a) => a.slot === slot);
        if (activity) {
          return `  ${slot}: ${activity.activity.name} (${activity.durationHours}h, ${activity.activity.energy} energy, ${activity.activity.category})`;
        }
        return `  ${slot}: [Empty]`;
      });

      return `${dayName}:\n${slotActivities.join("\n")}`;
    };

    const saturdayFormatted = formatDay("saturday", schedule.saturday);
    const sundayFormatted = formatDay("sunday", schedule.sunday);

    return `Weekend Schedule Analysis:\n\n${saturdayFormatted}\n\n${sundayFormatted}`;
  }

  async analyzeSchedule(schedule: WeekendSchedule): Promise<string> {
    if (!this.genAI) {
      throw new Error(
        "Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables."
      );
    }

    try {
      const candidateModels = [
        ...(this.preferredModel ? [this.preferredModel] : []),
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro-latest",
        "gemini-1.0-pro",
      ];

      const prompt = `${this.getSystemPrompt()}\n\n${this.formatScheduleForAI(
        schedule
      )}`;

      let lastErr: unknown = null;
      for (const modelName of candidateModels) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          if (text && text.trim().length > 0) {
            return text.trim();
          }
          lastErr = new Error(`Empty response from model ${modelName}`);
        } catch (err) {
          lastErr = err;
          continue;
        }
      }

      console.error("AI Analysis Error (all candidates failed):", lastErr);
      if (lastErr instanceof Error) {
        const hint =
          lastErr.message.includes("was not found") ||
          lastErr.message.includes("404")
            ? "The selected Gemini model may be unavailable for your API key. Try another model or ensure your key has access."
            : "";
        throw new Error(
          `Failed to analyze schedule: ${lastErr.message}${
            hint ? ` (${hint})` : ""
          }`
        );
      }
      throw new Error("Failed to analyze schedule. Please try again.");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to analyze schedule: ${error.message}`);
      }
      throw new Error("Failed to analyze schedule. Please try again.");
    }
  }

  isConfigured(): boolean {
    return this.genAI !== null;
  }
}

export const aiAnalysisService = new AIAnalysisService();
