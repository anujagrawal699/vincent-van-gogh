import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { getVanGoghPainting } from '../../utils/vanGoghBackgrounds';
import { ChevronDown, Palette } from 'lucide-react';

export default function ThemeSelector() {
  const { allThemes, theme, setThemeById } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentPainting = theme ? getVanGoghPainting(theme.id) : null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
      >
        <Palette size={16} />
        <span className="hidden sm:inline">{theme ? theme.name : 'Choose Theme'}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 z-20 w-80 rounded-lg border bg-white shadow-lg overflow-hidden">
              <div className="p-3 border-b">
                <h3 className="font-medium text-gray-900">Choose Your Weekend Vibe</h3>
                <p className="text-xs text-gray-500 mt-1">Each theme features a Van Gogh masterpiece</p>
              </div>

              <div className="max-h-96 overflow-y-auto" role="listbox">
                {allThemes.map(t => {
                  const painting = t.id !== 'default' ? getVanGoghPainting(t.id) : null;
                  const isSelected = theme?.id === t.id || (!theme && t.id === 'default');
                  return (
                    <button
                      key={t.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setThemeById(t.id === 'default' ? null : t.id);
                        setIsOpen(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0 ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-8 rounded bg-cover bg-center flex-shrink-0 border"
                          style={{
                            backgroundImage: t.id === 'default'
                              ? 'url(/mulberry-tree.jpg)'
                              : painting ? `url(/${painting.imageUrl})` : undefined
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {t.id === 'default'
                              ? '"The Mulberry Tree" (1889)'
                              : painting ? `"${painting.name}" (${painting.year})` : t.mood}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {t.id === 'default'
                              ? 'A vibrant autumn scene with golden and orange hues'
                              : painting?.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {(currentPainting || !theme) && (
                <div className="p-3 bg-gray-50 border-t">
                  <div className="text-xs text-gray-600">
                    Current: <span className="font-medium">"{currentPainting ? currentPainting.name : 'The Mulberry Tree'}"</span> by Vincent van Gogh ({currentPainting ? currentPainting.year : '1889'})
                  </div>
                </div>
              )}
            </div>
        </>
      )}
    </div>
  );
}
