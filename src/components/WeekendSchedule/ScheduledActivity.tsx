/**
 * ScheduledActivity component - Displays a scheduled activity in the weekend plan
 * Refactored to separate modal logic for better maintainability
 */

import { useState } from 'react';
import type { ScheduledActivity as SA } from '../../types';
import { ActivityEditModal } from '../ActivityEditModal';

export function ScheduledActivity({ 
  item, 
  onRemove 
}: { 
  item: SA; 
  onRemove?: (id: string) => void; 
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div
        className="rounded-lg border p-2 text-sm bg-white shadow-sm flex items-center gap-2"
        style={{ borderColor: item.activity.color }}
      >
        <span className="text-base sm:text-lg flex-shrink-0" aria-hidden>
          {item.activity.icon}
        </span>
        
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate text-sm">{item.activity.name}</div>
          <div className="text-xs text-gray-500">
            {item.durationHours}h • {item.activity.category}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="text-xs text-gray-600 hover:text-gray-900 px-1 py-1 rounded hover:bg-gray-100"
            onClick={openEditModal}
            aria-label={`Edit ${item.activity.name}`}
          >
            <span className="hidden sm:inline">Edit</span>
            <span className="sm:hidden">✏️</span>
          </button>
          
          {onRemove && (
            <button
              className="text-xs text-gray-600 hover:text-red-600 px-1 py-1 rounded hover:bg-red-50"
              onClick={handleRemove}
              aria-label={`Remove ${item.activity.name}`}
            >
              <span className="hidden sm:inline">Remove</span>
              <span className="sm:hidden">🗑️</span>
            </button>
          )}
        </div>
      </div>

      <ActivityEditModal
        activity={item}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
      />
    </>
  );
}

export default ScheduledActivity;
