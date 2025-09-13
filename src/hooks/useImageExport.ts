import { useState, useCallback } from "react";
import { ImageExportService } from "../services/imageExportService";

export interface UseImageExportResult {
  isExporting: boolean;
  justDownloaded: boolean;
  justCopied: boolean;
  isClipboardSupported: boolean;
  downloadPNG: (element: HTMLElement, filename?: string) => Promise<void>;
  copyPNG: (element: HTMLElement) => Promise<void>;
}

export function useImageExport(
  onExportingChange?: (exporting: boolean) => void
): UseImageExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const isClipboardSupported = ImageExportService.isClipboardSupported();

  const setTemporaryFlag = useCallback((setter: (value: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 1500);
  }, []);

  const downloadPNG = useCallback(
    async (element: HTMLElement, filename = "weekendly-plan.png") => {
      try {
        setIsExporting(true);
        onExportingChange?.(true);

        await ImageExportService.downloadElementAsPNG(element, filename);
        setTemporaryFlag(setJustDownloaded);
      } catch (error) {
        console.warn("Export failed:", error);
        throw error;
      } finally {
        setIsExporting(false);
        onExportingChange?.(false);
      }
    },
    [onExportingChange, setTemporaryFlag]
  );

  const copyPNG = useCallback(
    async (element: HTMLElement) => {
      if (!isClipboardSupported) {
        throw new Error("Clipboard is not supported");
      }

      try {
        setIsExporting(true);
        onExportingChange?.(true);

        await ImageExportService.copyElementToClipboard(element);
        setTemporaryFlag(setJustCopied);
      } catch (error) {
        console.warn("Copy failed:", error);
        throw error;
      } finally {
        setIsExporting(false);
        onExportingChange?.(false);
      }
    },
    [isClipboardSupported, onExportingChange, setTemporaryFlag]
  );

  return {
    isExporting,
    justDownloaded,
    justCopied,
    isClipboardSupported,
    downloadPNG,
    copyPNG,
  };
}
