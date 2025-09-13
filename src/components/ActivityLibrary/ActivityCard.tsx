import type { Activity } from '../../types';
import { useDraggable } from '@dnd-kit/core';

interface ActivityCardProps {
  activity: Activity; 
  dragId?: string;
  isClickable?: boolean;
  onClick?: () => void;
}

export function ActivityCard({ activity, dragId, isClickable = false, onClick }: ActivityCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ 
    id: dragId ?? `activity-${activity.id}`, 
    data: { type: 'activity', activity },
    disabled: isClickable // Disable dragging when in clickable mode
  });
  
  const style: React.CSSProperties | undefined = transform ? 
    { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, borderColor: activity.color } : 
    { borderColor: activity.color };

  const handleClick = (e: React.MouseEvent) => {
    if (isClickable && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition ${
        isDragging ? 'opacity-70' : 'opacity-100'
      } ${
        isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-grab active:cursor-grabbing'
      }`}
      onClick={handleClick}
      {...(isClickable ? {} : { ...attributes, ...listeners })}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl" aria-hidden>{activity.icon}</div>
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{activity.name}</div>
          <div className="text-xs text-gray-500">{activity.category} • {activity.duration}h • {activity.timeOfDay}</div>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{activity.description}</p>
    </div>
  );
}

export default ActivityCard;
