import { useRef } from "react";
import { useImageExport } from "../../hooks/useImageExport";
import { PosterPreview } from "./PosterPreview";

type Props = {
  onExportingChange?: (exporting: boolean) => void;
};

export default function Poster({ onExportingChange }: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const {
    isExporting,
    justDownloaded,
    justCopied,
    isClipboardSupported,
    downloadPNG,
    copyPNG,
  } = useImageExport(onExportingChange);

  const handleDownload = async () => {
    if (!posterRef.current) return;

    await downloadPNG(posterRef.current);
  };

  const handleCopy = async () => {
    if (!posterRef.current || !isClipboardSupported) return;

    await copyPNG(posterRef.current);
  };

  return (
    <div className="flex flex-col gap-3">
      <PosterPreview innerRef={posterRef} />

      {/* Export Actions */}
      <div className="flex justify-end gap-2">
        <button
          className="rounded-lg border px-3 py-1 text-sm disabled:opacity-60"
          onClick={handleCopy}
          disabled={isExporting || !isClipboardSupported}
          title={
            isClipboardSupported
              ? "Copy image to clipboard"
              : "Clipboard image copy is not supported here"
          }
        >
          {justCopied ? "Copied!" : "Copy"}
        </button>

        <button
          className="rounded-lg border px-3 py-1 text-sm disabled:opacity-60"
          onClick={handleDownload}
          disabled={isExporting}
        >
          {justDownloaded ? "Downloaded!" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
