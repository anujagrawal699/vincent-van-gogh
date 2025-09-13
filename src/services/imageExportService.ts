// Service for handling image export functionality
import { toBlob } from "html-to-image";

export interface ExportOptions {
  pixelRatio?: number;
  backgroundColor?: string;
  cacheBust?: boolean;
}

export class ImageExportService {
  // Gets the dimensions of an HTML element
  static getElementDimensions(element: HTMLElement): {
    width: number;
    height: number;
  } {
    const rect = element.getBoundingClientRect();
    return {
      width: Math.ceil(rect.width) + 2,
      height: Math.ceil(rect.height) + 2,
    };
  }

  // Converts an HTML element to a blob
  static async convertElementToBlob(
    element: HTMLElement,
    options: ExportOptions = {}
  ): Promise<Blob> {
    const { width, height } = this.getElementDimensions(element);
    const elementPadding = getComputedStyle(element).padding;

    const blob = await toBlob(element, {
      cacheBust: options.cacheBust ?? true,
      pixelRatio: options.pixelRatio ?? 2,
      width,
      height,
      backgroundColor: options.backgroundColor ?? "#ffffff",
      style: {
        width: `${width}px`,
        height: `${height}px`,
        margin: "0",
        maxWidth: "none",
        padding: elementPadding,
      },
    });

    if (!blob) {
      throw new Error("Failed to create image blob");
    }

    return blob;
  }

  // Downloads a blob as a PNG file
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }

  // Copies a blob to the clipboard (if supported)
  static async copyBlobToClipboard(blob: Blob): Promise<void> {
    if (!this.isClipboardSupported()) {
      throw new Error("Clipboard API is not supported in this browser");
    }

    const clipboardItem = new window.ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([clipboardItem]);
  }

  // Checks if clipboard API is supported
  static isClipboardSupported(): boolean {
    return (
      typeof navigator !== "undefined" &&
      "clipboard" in navigator &&
      "write" in navigator.clipboard &&
      typeof window.ClipboardItem !== "undefined"
    );
  }

  // Downloads an HTML element as a PNG file
  static async downloadElementAsPNG(
    element: HTMLElement,
    filename: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const blob = await this.convertElementToBlob(element, options);
    this.downloadBlob(blob, filename);
  }

  // Copies an HTML element to clipboard as PNG
  static async copyElementToClipboard(
    element: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    const blob = await this.convertElementToBlob(element, options);
    await this.copyBlobToClipboard(blob);
  }
}
