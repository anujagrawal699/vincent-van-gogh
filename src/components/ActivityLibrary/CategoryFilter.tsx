import { categoryLabels } from "../../utils/activityData";
import type { Category } from "../../types";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";

export function CategoryFilter() {
  const { state, dispatch } = useWeekendPlan();
  const selected = state.filters.categories;
  const toggle = (cat: Category) => {
    const next = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];
    dispatch({ type: "setFilters", payload: { categories: next } });
  };
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(categoryLabels).map((cat) => (
        <button
          key={cat}
          onClick={() => toggle(cat as Category)}
          className={`rounded-full border px-3 py-1 text-sm bg-white ${
            selected.includes(cat as Category)
              ? "bg-gray-200 border-gray-900"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {categoryLabels[cat as Category]}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
