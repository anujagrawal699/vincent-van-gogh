import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Poster from '../SharePoster/Poster';

export default function ShareModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);
  return (
    <div>
      <button className="rounded-lg border border-gray-700 hover:bg-gray-100 px-2 py-1 text-xs sm:px-3 sm:text-sm" onClick={() => setOpen(true)}>
        <span className="hidden sm:inline">Share</span>
        <span className="sm:hidden">📤</span>
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="fixed inset-0 z-10 bg-black/30 pointer-events-none" aria-hidden="true" />
          <div className="relative z-20 flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            <div role="dialog" aria-modal="true" aria-label="Share your weekend" className="w-full max-w-5xl rounded-t-xl sm:rounded-xl bg-white p-4 sm:p-5 shadow-lg pointer-events-auto max-h-[95vh] overflow-y-auto">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Share your weekend</h3>
                <button className="rounded-md border px-2 py-1 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Close</button>
              </div>
              <Poster />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
