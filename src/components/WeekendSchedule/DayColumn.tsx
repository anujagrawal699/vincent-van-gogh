import { TimeSlot } from "./TimeSlot";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";

export function DayColumn({
  day,
  title,
}: {
  day: "saturday" | "sunday";
  title: string;
}) {
  const { state, conflicts } = useWeekendPlan();
  const hasConflict = conflicts.hasConflict && state.schedule[day].length > 1;
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {hasConflict && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            Time conflicts detected
          </span>
        )}
      </div>
      <div className="space-y-3">
        <TimeSlot day={day} slot="morning" title="Morning" />
        <TimeSlot day={day} slot="afternoon" title="Afternoon" />
        <TimeSlot day={day} slot="evening" title="Evening" />
        <TimeSlot day={day} slot="night" title="Night" />
      </div>
    </div>
  );
}

export default DayColumn;
