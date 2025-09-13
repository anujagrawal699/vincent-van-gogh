import { useActivitySuggestions } from '../../hooks/useActivitySuggestions';
import ActivityCard from './ActivityCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';

export default function ActivityLibrary() {
  const { filtered, suggestions } = useActivitySuggestions();

  return (
    <div className="flex flex-col gap-3">
  <SearchBar />
  <CategoryFilter />
      {suggestions.length > 0 && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-gray-500">Suggestions</div>
          <div className="grid grid-cols-1 gap-3">
            {suggestions.map(a => (
              <ActivityCard key={a.id} dragId={`lib-sugg-${a.id}`} activity={a} />
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="mb-2 text-xs uppercase tracking-wider text-gray-500">All Activities</div>
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(a => (
            <ActivityCard key={a.id} dragId={`lib-all-${a.id}`} activity={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
