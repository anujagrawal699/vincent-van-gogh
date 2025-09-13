import { useEffect, useState } from "react";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";

export function SearchBar() {
  const { state, dispatch } = useWeekendPlan();
  const [value, setValue] = useState(state.filters.query);
  useEffect(() => {
    const id = setTimeout(
      () => dispatch({ type: "setFilters", payload: { query: value } }),
      250
    );
    return () => clearTimeout(id);
  }, [value, dispatch]);
  return (
    <input
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
      placeholder="Search activities..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      aria-label="Search activities"
    />
  );
}

export default SearchBar;
