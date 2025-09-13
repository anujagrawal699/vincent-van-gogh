interface EmojiSelectorProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
}

const commonEmojis = [
  "🎯",
  "⭐",
  "🎨",
  "🍽️",
  "🏃",
  "📚",
  "🎵",
  "🧘",
  "🎮",
  "☕",
  "🌟",
  "💫",
];

export function EmojiSelector({
  selectedIcon,
  onIconChange,
}: EmojiSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Icon
      </label>
      <div className="grid grid-cols-6 gap-2 mb-2">
        {commonEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onIconChange(emoji)}
            className={`p-2 rounded-md border text-lg hover:bg-gray-50 transition-colors ${
              selectedIcon === emoji
                ? "border-gray-900 bg-gray-100"
                : "border-gray-300"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={selectedIcon}
        onChange={(e) => onIconChange(e.target.value.slice(0, 2))}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        placeholder="Or type your own emoji"
        maxLength={2}
      />
    </div>
  );
}
