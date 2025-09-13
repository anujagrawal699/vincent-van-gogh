import { useState } from "react";
import { X } from "lucide-react";
import type { Activity, Category, TimeOfDay, Energy } from "../../types";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";
import { categoryLabels } from "../../utils/activityData";
import { EmojiSelector } from "./EmojiSelector";
import {
  validateForm,
  getCategoryColor,
  createInitialFormData,
  type FormData,
  type ValidationErrors,
} from "./formValidation";

interface CreateActivityFormProps {
  onClose: () => void;
  onActivityCreated: (activity: Activity) => void;
}

export function CreateActivityForm({
  onClose,
  onActivityCreated,
}: CreateActivityFormProps) {
  const { dispatch } = useWeekendPlan();
  const [formData, setFormData] = useState<FormData>(createInitialFormData());
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleValidation = () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidation()) {
      return;
    }

    const newActivity: Activity = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: formData.name.trim(),
      category: formData.category,
      duration: formData.duration,
      timeOfDay: formData.timeOfDay,
      energy: formData.energy,
      icon: formData.icon,
      color: getCategoryColor(formData.category),
      description: formData.description.trim(),
    };

    dispatch({ type: "addCustomActivity", payload: newActivity });
    onActivityCreated(newActivity);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg border p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Create Custom Activity
        </h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            placeholder="e.g., Learn Guitar"
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as Category })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value) || 1,
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
            {errors.duration && (
              <p className="text-red-600 text-xs mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Best Time
            </label>
            <select
              value={formData.timeOfDay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  timeOfDay: e.target.value as TimeOfDay,
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="any">Anytime</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Energy Level
          </label>
          <select
            value={formData.energy}
            onChange={(e) =>
              setFormData({ ...formData, energy: e.target.value as Energy })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="low">Low Energy</option>
            <option value="medium">Medium Energy</option>
            <option value="high">High Energy</option>
          </select>
        </div>

        <EmojiSelector
          selectedIcon={formData.icon}
          onIconChange={(icon) => setFormData({ ...formData, icon })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            placeholder="Describe your activity..."
            rows={3}
            maxLength={200}
          />
          {errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/200
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Create Activity
          </button>
        </div>
      </form>
    </div>
  );
}
