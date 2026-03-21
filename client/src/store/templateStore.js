import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Initial state
const initialState = {
  selectedTemplate: 'modern',
  customization: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'comfortable',
    accentStyle: 'bold',
  },
  showPhoto: false,
  pageSize: 'A4',
};

// Create the template store
export const useTemplateStore = create(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Set selected template
        setTemplate: (templateId) =>
          set(() => ({
            selectedTemplate: templateId,
          })),

        // Update customization
        updateCustomization: (data) =>
          set((state) => ({
            customization: { ...state.customization, ...data },
          })),

        // Toggle photo visibility
        togglePhoto: () =>
          set((state) => ({
            showPhoto: !state.showPhoto,
          })),

        // Set page size
        setPageSize: (size) =>
          set(() => ({
            pageSize: size,
          })),

        // Reset to defaults
        resetCustomization: () => set(initialState),
      }),
      {
        name: 'template-storage',
        version: 1,
      }
    ),
    {
      name: 'Template Store',
    }
  )
);
