import React, { useState, useEffect } from "react";
import type { ScheduledActivity, Day, Slot } from "../../types";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";

interface ActivityEditModalProps {
  activity: ScheduledActivity;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityEditModal({
  activity,
  isOpen,
  onClose,
}: ActivityEditModalProps) {
  const { dispatch } = useWeekendPlan();
  const [day, setDay] = useState<Day>(activity.day);
  const [slot, setSlot] = useState<Slot>(activity.slot);
  const [duration, setDuration] = useState<number>(activity.durationHours);

  // Reset form when activity changes
  useEffect(() => {
    setDay(activity.day);
    setSlot(activity.slot);
    setDuration(activity.durationHours);
  }, [activity]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  const handleSave = () => {
    dispatch({
      type: "edit",
      payload: {
        id: activity.id,
        updates: { day, slot, durationHours: duration },
      },
    });
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
    if (event.key === "Enter" && event.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg">
        <div className="mb-2 text-sm font-semibold" id="edit-modal-title">
          Edit Activity
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-600">
            Day
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1"
              value={day}
              onChange={(e) => setDay(e.target.value as Day)}
            >
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </label>

          <label className="text-xs text-gray-600">
            Time Slot
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1"
              value={slot}
              onChange={(e) => setSlot(e.target.value as Slot)}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </label>

          <label className="text-xs text-gray-600">
            Duration (hours)
            <input
              type="number"
              min={1}
              max={6}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value || "1", 10))}
            />
          </label>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            className="rounded-md border px-3 py-1 text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-gray-900 px-3 py-1 text-sm text-white"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
