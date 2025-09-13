import React from "react";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";
import {
  getVanGoghBackgroundStyle,
  getVanGoghPainting,
} from "../../utils/vanGoghBackgrounds";
import { slots, slotWindows } from "../../utils/timeUtils";

interface PosterPreviewProps {
  innerRef: React.RefObject<HTMLDivElement | null>;
}

export function PosterPreview({ innerRef }: PosterPreviewProps) {
  const { state } = useWeekendPlan();

  // Get Van Gogh background style based on selected theme
  const backgroundStyle = getVanGoghBackgroundStyle(
    state.selectedTheme?.id || null
  );

  const DayColumn = ({
    day,
    title,
  }: {
    day: "saturday" | "sunday";
    title: string;
  }) => (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-semibold text-gray-900">{title}</div>
      {slots.map((slot) => {
        const items = state.schedule[day].filter(
          (activity) => activity.slot === slot
        );
        return (
          <div
            key={slot}
            className="rounded-lg border border-gray-200 bg-white/70 p-3"
          >
            <div className="mb-1 flex items-center justify-between text-sm font-medium text-gray-800">
              <span className="capitalize">{slot}</span>
              <span className="text-xs text-gray-500">
                {slotWindows[slot].start}–{slotWindows[slot].end}
              </span>
            </div>
            {items.length === 0 ? (
              <div className="text-xs text-gray-500">No plans</div>
            ) : (
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <span className="text-base" aria-hidden>
                      {item.activity.icon}
                    </span>
                    <span className="truncate">{item.activity.name}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {item.durationHours}h
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex justify-center">
      <div
        ref={innerRef}
        className="w-full max-w-[960px] mx-4 sm:w-[960px] sm:mx-0 rounded-2xl border shadow-md"
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue",
          ...backgroundStyle,
        }}
      >
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl" aria-hidden>
                🗓️
              </div>
              <div className="md:text-xl sm:text-lg font-semibold text-gray-900">
                Weekendly - Van Gogh Edition
              </div>
            </div>
            <div className="text-sm hidden md:block bg-gray-300 p-1 rounded text-gray-700">
              My Weekend Plan
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <DayColumn day="saturday" title="Saturday" />
            <DayColumn day="sunday" title="Sunday" />
          </div>

          <div className="mt-4 sm:mt-6 border-t pt-3 text-center text-xs text-gray-700">
            <div className="flex flex-col gap-1">
              <div className="bg-gray-300 p-1 rounded">
                Made with ❤️ for Atlan • Weekendly
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-gray-700 bg-gray-300 p-1 rounded">
                <span>🎨</span>
                <span className="text-center">
                  Background: "
                  {state.selectedTheme?.vanGoghPainting ||
                    getVanGoghPainting("default")?.name}
                  " by Vincent van Gogh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
