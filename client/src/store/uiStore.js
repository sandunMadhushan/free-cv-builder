import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Initial state
const initialState = {
  activeSection: "personalInfo",
  isSidebarCollapsed: false,
  exportModalOpen: false,
  importModalOpen: false,
  versionModalOpen: false,
  previewScale: 1.0,
  isDarkMode: false,
  isMobilePreviewOpen: false,
};

// Create the UI store
export const useUIStore = create(
  devtools(
    (set) => ({
      ...initialState,

      // Set active section
      setActiveSection: (section) =>
        set(() => ({
          activeSection: section,
        })),

      // Toggle sidebar
      toggleSidebar: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),

      // Modal controls
      openExportModal: () =>
        set(() => ({
          exportModalOpen: true,
        })),

      closeExportModal: () =>
        set(() => ({
          exportModalOpen: false,
        })),

      openImportModal: () =>
        set(() => ({
          importModalOpen: true,
        })),

      closeImportModal: () =>
        set(() => ({
          importModalOpen: false,
        })),

      openVersionModal: () =>
        set(() => ({
          versionModalOpen: true,
        })),

      closeVersionModal: () =>
        set(() => ({
          versionModalOpen: false,
        })),

      // Preview scale
      setPreviewScale: (scale) =>
        set(() => ({
          previewScale: scale,
        })),

      zoomIn: () =>
        set((state) => ({
          previewScale: Math.min(state.previewScale + 0.1, 2.0),
        })),

      zoomOut: () =>
        set((state) => ({
          previewScale: Math.max(state.previewScale - 0.1, 0.5),
        })),

      resetZoom: () =>
        set(() => ({
          previewScale: 1.0,
        })),

      // Dark mode
      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      // Mobile preview toggle
      toggleMobilePreview: (forceState = null) =>
        set((state) => ({
          isMobilePreviewOpen:
            forceState !== null ? forceState : !state.isMobilePreviewOpen,
        })),

      // Reset UI state
      resetUI: () => set(initialState),
    }),
    {
      name: "UI Store",
    },
  ),
);
