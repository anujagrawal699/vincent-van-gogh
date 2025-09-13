import WeekendPlanProvider from "./providers/WeekendPlanProvider";
import { useWeekendPlan } from "./hooks/useWeekendPlan";
import {
  getVanGoghBackgroundStyle,
  getVanGoghPainting,
} from "./utils/vanGoghBackgrounds";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import type { Activity } from "./types";
import ActivityLibrary from "./components/ActivityLibrary";
import ActivityCard from "./components/ActivityLibrary/ActivityCard";
import DayColumn from "./components/WeekendSchedule/DayColumn";
import ThemeSelector from "./components/ThemeSelector";
import ShareModal from "./components/ShareModal";

function AppShell() {
  const { dispatch, state } = useWeekendPlan();

  // Get Van Gogh background style based on selected theme
  const backgroundStyle = getVanGoghBackgroundStyle(
    state.selectedTheme?.id || null
  );

  type ActivityDragData = { type: "activity"; activity: Activity };
  type SlotDropData = {
    type: "slot";
    day: "saturday" | "sunday";
    slot: "morning" | "afternoon" | "evening" | "night";
  };

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    const aData = event.active.data?.current as
      | { type?: string; activity?: Activity }
      | undefined;
    if (aData?.type === "activity" && aData.activity) {
      setActiveActivity(aData.activity);
      document.body.classList.add("no-y-scroll");
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const aData = active.data?.current as ActivityDragData | undefined;
    const oData = over.data?.current as SlotDropData | undefined;
    if (aData?.type === "activity" && oData?.type === "slot") {
      const activity = aData.activity;
      dispatch({
        type: "add",
        payload: {
          activity,
          day: oData.day,
          slot: oData.slot,
          durationHours: activity.duration,
        },
      });
    }
    setActiveActivity(null);
    document.body.classList.remove("no-y-scroll");
  };

  // Conditionally wrap with DndContext only on desktop
  const content = (
    <div
      className="min-h-screen text-gray-900 transition-all duration-1000 ease-in-out"
      style={backgroundStyle}
    >
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-xl sm:text-2xl">🗓️</div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold">
                Weekendly - Van Gogh Edition
              </h1>
              {state.selectedTheme && (
                <div className="text-xs text-gray-500 hidden sm:block">
                  {state.selectedTheme.mood} weekend •{" "}
                  {state.selectedTheme.vanGoghPainting}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <ThemeSelector />
            </div>
            <button
              className="rounded-lg border border-gray-700 hover:bg-gray-100 px-2 py-1 text-xs sm:px-3 sm:text-sm"
              onClick={() => dispatch({ type: "randomize" })}
            >
              Surprise Me
            </button>
            <button
              className="rounded-lg border border-gray-700 hover:bg-gray-100 px-2 py-1 text-xs sm:px-3 sm:text-sm"
              onClick={() => dispatch({ type: "clear" })}
            >
              Clear
            </button>
            <ShareModal />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile: Stack layout */}
        <div className="block lg:hidden space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Your Weekend Plan</h2>
            <div className="space-y-4">
              <DayColumn day="saturday" title="Saturday" />
              <DayColumn day="sunday" title="Sunday" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Activity Library</h2>
            <div className="hidden sm:block">
              <ActivityLibrary />
            </div>
            <div className="block sm:hidden text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
              💡 Tap the <strong>+</strong> buttons above to add activities
            </div>
          </section>
        </div>

        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 flex flex-col">
            <h2 className="mb-3 text-lg font-semibold">Activity Library</h2>
            <div className="relative pr-1 flex-1">
              <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh-220px)] overscroll-contain pr-2 custom-scrollbar">
                <ActivityLibrary />
              </div>
            </div>
          </section>
          <section className="lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold">Your Weekend Plan</h2>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <DayColumn day="saturday" title="Saturday" />
              <DayColumn day="sunday" title="Sunday" />
            </div>
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 text-xs text-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="bg-gray-300 p-1 rounded">
            Made with ❤️ for Atlan • Weekendly
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-700 bg-gray-300 p-1 rounded">
            <span>🎨</span>
            <span>
              Background: "
              {state.selectedTheme?.vanGoghPainting ||
                getVanGoghPainting("default")?.name}
              " by Vincent van Gogh
            </span>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {content}
      <DragOverlay>
        {activeActivity && (
          <div className="pointer-events-none">
            <ActivityCard
              activity={activeActivity}
              dragId={`overlay-${activeActivity.id}`}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default function App() {
  return (
    <WeekendPlanProvider>
      <AppShell />
    </WeekendPlanProvider>
  );
}
