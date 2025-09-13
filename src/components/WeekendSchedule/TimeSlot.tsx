import type { Slot } from "../../types";
import { ScheduledActivity } from "./ScheduledActivity";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";
import { useDroppable } from "@dnd-kit/core";
import { slotWindows } from "../../utils/timeUtils";
import { AddActivityButton } from "../ActivitySelector";

export function TimeSlot({
  day,
  slot,
  title,
}: {
  day: "saturday" | "sunday";
  slot: Slot;
  title: string;
}) {
  const { state, dispatch } = useWeekendPlan();
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${day}-${slot}`,
    data: { type: "slot", day, slot },
  });
  const items = state.schedule[day].filter((s) => s.slot === slot);
  const remove = (id: string) => dispatch({ type: "remove", payload: { id } });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border p-3 ${
        isOver ? "border-gray-900 bg-gray-100" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-2 flex items-start sm:items-center justify-between gap-2">
        <div className="text-sm font-semibold text-gray-800 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>{title}</span>
          <span className="text-xs text-gray-500">
            {slotWindows[slot].start}–{slotWindows[slot].end}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <AddActivityButton day={day} slot={slot} />
          <div
            className={`text-xs whitespace-nowrap ${
              items.reduce((s, a) => s + a.durationHours, 0) >
              slotWindows[slot].capacityHours
                ? "text-red-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {items.reduce((s, a) => s + a.durationHours, 0)}h /{" "}
            {slotWindows[slot].capacityHours}h
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-h-[60px]">
        {items.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-4">
            <span className="hidden sm:inline">Drag activities here or </span>
            <span className="sm:hidden">Tap </span>
            <span className="font-medium">+</span> to add
          </div>
        ) : (
          items.map((item) => (
            <ScheduledActivity key={item.id} item={item} onRemove={remove} />
          ))
        )}
      </div>
    </div>
  );
}

export default TimeSlot;
