import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImageExportService } from "../services/imageExportService";

const createMockElement = (width = 100, height = 100) => {
  const mockElement = {
    getBoundingClientRect: vi.fn(() => ({
      width,
      height,
      top: 0,
      left: 0,
      bottom: height,
      right: width,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })),
  };

  return mockElement as unknown as HTMLElement;
};

vi.mock("html-to-image", () => ({
  toBlob: vi.fn(),
}));

describe("ImageExportService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.getComputedStyle = vi.fn(() => ({
      padding: "0px",
    })) as unknown as typeof getComputedStyle;

    Object.defineProperty(globalThis, "URL", {
      value: {
        createObjectURL: vi.fn(() => "mock-url"),
        revokeObjectURL: vi.fn(),
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "navigator", {
      value: {
        clipboard: {
          write: vi.fn(),
        },
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        ClipboardItem: vi.fn(),
      },
      configurable: true,
    });
  });

  describe("getElementDimensions", () => {
    it("returns element dimensions with padding", () => {
      const mockElement = createMockElement(200, 150);
      const result = ImageExportService.getElementDimensions(mockElement);

      expect(result).toEqual({
        width: 202,
        height: 152,
      });
    });
  });

  describe("isClipboardSupported", () => {
    it("returns true when clipboard API is supported", () => {
      expect(ImageExportService.isClipboardSupported()).toBe(true);
    });

    it("returns false when navigator is undefined", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: undefined,
        configurable: true,
      });

      expect(ImageExportService.isClipboardSupported()).toBe(false);
    });
  });

  describe("downloadBlob", () => {
    it("creates download link and triggers download", () => {
      const mockBlob = new Blob(["test"], { type: "image/png" });
      const filename = "test-image.png";

      const mockLink = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      vi.spyOn(document, "createElement").mockReturnValue(
        mockLink as unknown as HTMLAnchorElement
      );

      ImageExportService.downloadBlob(mockBlob, filename);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.href).toBe("mock-url");
      expect(mockLink.download).toBe(filename);
      expect(mockLink.click).toHaveBeenCalled();
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
    });
  });

  describe("copyBlobToClipboard", () => {
    it("copies blob to clipboard when supported", async () => {
      const mockBlob = new Blob(["test"], { type: "image/png" });
      const mockClipboardItem = {};

      (
        globalThis.window.ClipboardItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(mockClipboardItem);

      await ImageExportService.copyBlobToClipboard(mockBlob);

      expect(globalThis.window.ClipboardItem).toHaveBeenCalledWith({
        "image/png": mockBlob,
      });
      expect(globalThis.navigator.clipboard.write).toHaveBeenCalledWith([
        mockClipboardItem,
      ]);
    });

    it("throws error when clipboard is not supported", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        configurable: true,
      });

      const mockBlob = new Blob(["test"], { type: "image/png" });

      await expect(
        ImageExportService.copyBlobToClipboard(mockBlob)
      ).rejects.toThrow("Clipboard API is not supported in this browser");
    });
  });
});
