import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useActivitySuggestions } from "../../hooks/useActivitySuggestions";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";
import type { Activity, Day, Slot } from "../../types";
import ActivityCard from "../ActivityLibrary/ActivityCard";
import SearchBar from "../ActivityLibrary/SearchBar";
import CategoryFilter from "../ActivityLibrary/CategoryFilter";
import { CreateActivityForm } from "../CreateActivityForm";
import { Plus, X } from "lucide-react";

interface ActivitySelectorProps {
  day: Day;
  slot: Slot;
  onClose: () => void;
}

export function ActivitySelectorModal({
  day,
  slot,
  onClose,
}: ActivitySelectorProps) {
  const { filtered, suggestions } = useActivitySuggestions();
  const { dispatch } = useWeekendPlan();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleActivitySelect = (activity: Activity) => {
    dispatch({
      type: "add",
      payload: {
        activity,
        day,
        slot,
        durationHours: activity.duration,
      },
    });
    onClose();
  };

  const handleCustomActivityCreated = (activity: Activity) => {
    handleActivitySelect(activity);
  };

  const slotDisplayName = slot.charAt(0).toUpperCase() + slot.slice(1);
  const dayDisplayName = day.charAt(0).toUpperCase() + day.slice(1);

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="fixed inset-0 z-10 bg-black/50" onClick={onClose} />
        <div className="relative z-20 flex min-h-full items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="w-full max-w-2xl rounded-t-xl sm:rounded-xl bg-white shadow-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0">
              <div>
                <h3 className="text-lg font-semibold">Add Activity</h3>
                <p className="text-sm text-gray-600">
                  {dayDisplayName} {slotDisplayName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b bg-gray-50">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SearchBar />
                  </div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Create Custom</span>
                    <span className="sm:hidden">Custom</span>
                  </button>
                </div>
                <CategoryFilter />
              </div>
            </div>

            {/* Activity Lists */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {suggestions.length > 0 && (
                <div>
                  <div className="mb-3 text-sm font-medium text-gray-700">
                    Suggested for {slotDisplayName}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {suggestions.map((activity) => (
                      <div key={activity.id} className="cursor-pointer">
                        <ActivityCard
                          activity={activity}
                          dragId={`selector-${activity.id}`}
                          isClickable={true}
                          onClick={() => handleActivitySelect(activity)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-3 text-sm font-medium text-gray-700">
                  All Activities
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {filtered.map((activity) => (
                    <div key={activity.id} className="cursor-pointer">
                      <ActivityCard
                        activity={activity}
                        dragId={`selector-all-${activity.id}`}
                        isClickable={true}
                        onClick={() => handleActivitySelect(activity)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Activity Form Overlay */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div
            className="fixed inset-0 z-10 bg-black/60"
            onClick={() => setShowCreateForm(false)}
          />
          <div className="relative z-20 flex min-h-full items-center justify-center p-4">
            <CreateActivityForm
              onClose={() => setShowCreateForm(false)}
              onActivityCreated={handleCustomActivityCreated}
            />
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

interface AddActivityButtonProps {
  day: Day;
  slot: Slot;
  className?: string;
}

export function AddActivityButton({
  day,
  slot,
  className = "",
}: AddActivityButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors group ${className}`}
        aria-label={`Add activity to ${day} ${slot}`}
      >
        <Plus size={16} className="text-gray-400 group-hover:text-gray-600" />
      </button>

      {showModal && (
        <ActivitySelectorModal
          day={day}
          slot={slot}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
