import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ADVANCED_CUSTOMIZATIONS, INDUSTRY_PRESETS } from '../config/enhancedTemplates';

// Enhanced initial state with more customization options
const initialState = {
  selectedTemplate: 'modern',
  selectedVariation: 'standard',
  selectedIndustry: null,
  customization: {
    // Colors
    colorScheme: 'corporate',
    customColors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#f8fafc',
      text: '#1f2937'
    },

    // Typography
    typography: 'professional',
    customTypography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingWeight: '600',
      bodyWeight: '400',
      fontSize: 'medium',
      lineHeight: '1.5'
    },

    // Layout
    layout: 'standard',
    spacing: 'comfortable',
    pageSize: 'A4',
    margins: 'medium',

    // Template-specific settings
    showPhoto: false,
    photoStyle: 'circular', // circular, square, rounded
    headerStyle: 'traditional', // traditional, modern, minimal
    accentStyle: 'subtle', // subtle, bold, minimal

    // Advanced options
    borderStyle: 'none', // none, subtle, bold
    shadowStyle: 'none', // none, subtle, medium, bold
    cornerRadius: 'medium', // sharp, small, medium, large
    iconStyle: 'outline', // outline, solid, minimal

    // Professional enhancements
    letterhead: false,
    watermark: false,
    confidentiality: 'public', // public, confidential, internal
    version: '1.0'
  },

  // UI state
  previewMode: 'desktop', // desktop, mobile, print
  customizationPanel: 'template', // template, colors, typography, layout
  showAdvancedOptions: false,
  isDirty: false
};

// Create the enhanced template store
export const useEnhancedTemplateStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Template selection
        setTemplate: (templateId, variation = 'standard') =>
          set((state) => ({
            selectedTemplate: templateId,
            selectedVariation: variation,
            isDirty: true
          })),

        setTemplateVariation: (variation) =>
          set((state) => ({
            selectedVariation: variation,
            isDirty: true
          })),

        // Industry presets
        applyIndustryPreset: (industry) => {
          const preset = INDUSTRY_PRESETS[industry];
          if (!preset) return;

          set((state) => ({
            selectedIndustry: industry,
            selectedTemplate: preset.recommendedTemplates[0] || state.selectedTemplate,
            customization: {
              ...state.customization,
              customColors: {
                ...state.customization.customColors,
                ...preset.colors
              }
            },
            isDirty: true
          }));
        },

        // Color customization
        setColorScheme: (schemeId) => {
          const scheme = ADVANCED_CUSTOMIZATIONS.colorSchemes[schemeId];
          if (!scheme) return;

          set((state) => ({
            customization: {
              ...state.customization,
              colorScheme: schemeId,
              customColors: {
                primary: scheme.primary,
                secondary: scheme.secondary,
                accent: scheme.accent,
                background: scheme.background,
                text: scheme.text
              }
            },
            isDirty: true
          }));
        },

        updateCustomColors: (colors) =>
          set((state) => ({
            customization: {
              ...state.customization,
              customColors: { ...state.customization.customColors, ...colors }
            },
            isDirty: true
          })),

        // Typography customization
        setTypographyPreset: (presetId) => {
          const preset = ADVANCED_CUSTOMIZATIONS.typography[presetId];
          if (!preset) return;

          set((state) => ({
            customization: {
              ...state.customization,
              typography: presetId,
              customTypography: {
                ...state.customization.customTypography,
                headingFont: preset.headingFont,
                bodyFont: preset.bodyFont,
                headingWeight: preset.headingWeight,
                bodyWeight: preset.bodyWeight,
                lineHeight: preset.lineHeight
              }
            },
            isDirty: true
          }));
        },

        updateTypography: (typography) =>
          set((state) => ({
            customization: {
              ...state.customization,
              customTypography: { ...state.customization.customTypography, ...typography }
            },
            isDirty: true
          })),

        // Layout customization
        setSpacing: (spacingId) => {
          set((state) => ({
            customization: {
              ...state.customization,
              spacing: spacingId
            },
            isDirty: true
          }));
        },

        setLayout: (layoutId) => {
          set((state) => ({
            customization: {
              ...state.customization,
              layout: layoutId
            },
            isDirty: true
          }));
        },

        // General customization updates
        updateCustomization: (data) =>
          set((state) => ({
            customization: { ...state.customization, ...data },
            isDirty: true
          })),

        // Photo settings
        togglePhoto: () =>
          set((state) => ({
            customization: {
              ...state.customization,
              showPhoto: !state.customization.showPhoto
            },
            isDirty: true
          })),

        setPhotoStyle: (style) =>
          set((state) => ({
            customization: {
              ...state.customization,
              photoStyle: style
            },
            isDirty: true
          })),

        // Page settings
        setPageSize: (size) =>
          set((state) => ({
            customization: {
              ...state.customization,
              pageSize: size
            },
            isDirty: true
          })),

        // UI state management
        setPreviewMode: (mode) =>
          set(() => ({
            previewMode: mode
          })),

        setCustomizationPanel: (panel) =>
          set(() => ({
            customizationPanel: panel
          })),

        toggleAdvancedOptions: () =>
          set((state) => ({
            showAdvancedOptions: !state.showAdvancedOptions
          })),

        // Template management
        saveTemplate: async (name) => {
          // Implementation for saving custom templates
          const state = get();
          const customTemplate = {
            name,
            templateId: state.selectedTemplate,
            variation: state.selectedVariation,
            customization: state.customization,
            createdAt: new Date().toISOString()
          };

          // Save to localStorage or API
          const savedTemplates = JSON.parse(localStorage.getItem('saved-templates') || '[]');
          savedTemplates.push(customTemplate);
          localStorage.setItem('saved-templates', JSON.stringify(savedTemplates));

          set((state) => ({ isDirty: false }));
          return customTemplate;
        },

        loadTemplate: (templateData) => {
          set(() => ({
            selectedTemplate: templateData.templateId,
            selectedVariation: templateData.variation,
            customization: templateData.customization,
            isDirty: false
          }));
        },

        // Quick actions
        applyQuickStyle: (styleType) => {
          const quickStyles = {
            minimal: {
              colorScheme: 'minimal',
              typography: 'modern',
              spacing: 'compact',
              borderStyle: 'none',
              shadowStyle: 'none'
            },
            professional: {
              colorScheme: 'corporate',
              typography: 'professional',
              spacing: 'comfortable',
              borderStyle: 'subtle',
              shadowStyle: 'subtle'
            },
            executive: {
              colorScheme: 'executive',
              typography: 'executive',
              spacing: 'spacious',
              borderStyle: 'subtle',
              shadowStyle: 'medium'
            },
            creative: {
              colorScheme: 'modern',
              typography: 'modern',
              spacing: 'comfortable',
              borderStyle: 'none',
              shadowStyle: 'bold'
            }
          };

          const style = quickStyles[styleType];
          if (style) {
            // Apply color scheme
            if (style.colorScheme) {
              get().setColorScheme(style.colorScheme);
            }

            // Apply typography
            if (style.typography) {
              get().setTypographyPreset(style.typography);
            }

            // Apply other settings
            set((state) => ({
              customization: {
                ...state.customization,
                spacing: style.spacing || state.customization.spacing,
                borderStyle: style.borderStyle || state.customization.borderStyle,
                shadowStyle: style.shadowStyle || state.customization.shadowStyle
              },
              isDirty: true
            }));
          }
        },

        // Reset functions
        resetCustomization: () => set(initialState),

        resetToDefaults: (keepTemplate = true) =>
          set((state) => ({
            ...initialState,
            selectedTemplate: keepTemplate ? state.selectedTemplate : initialState.selectedTemplate
          })),

        // Utility functions
        getTemplateConfig: () => {
          const state = get();
          return {
            templateId: state.selectedTemplate,
            variation: state.selectedVariation,
            customization: state.customization
          };
        },

        hasUnsavedChanges: () => get().isDirty,

        markAsSaved: () => set((state) => ({ isDirty: false }))
      }),
      {
        name: 'enhanced-template-storage',
        version: 2,
        migrate: (persistedState, version) => {
          // Handle migration from old template store
          if (version < 2) {
            return {
              ...initialState,
              selectedTemplate: persistedState.selectedTemplate || 'modern',
              customization: {
                ...initialState.customization,
                customColors: {
                  ...initialState.customization.customColors,
                  primary: persistedState.customization?.primaryColor || '#1e40af'
                },
                showPhoto: persistedState.showPhoto || false,
                pageSize: persistedState.pageSize || 'A4'
              }
            };
          }
          return persistedState;
        }
      }
    ),
    {
      name: 'Enhanced Template Store'
    }
  )
);

// Selectors for performance
export const useTemplateConfig = () =>
  useEnhancedTemplateStore((state) => ({
    template: state.selectedTemplate,
    variation: state.selectedVariation,
    customization: state.customization
  }));

export const useCustomizationPanelState = () =>
  useEnhancedTemplateStore((state) => ({
    panel: state.customizationPanel,
    showAdvanced: state.showAdvancedOptions,
    previewMode: state.previewMode
  }));

export const useTemplateActions = () =>
  useEnhancedTemplateStore((state) => ({
    setTemplate: state.setTemplate,
    setColorScheme: state.setColorScheme,
    setTypographyPreset: state.setTypographyPreset,
    applyIndustryPreset: state.applyIndustryPreset,
    applyQuickStyle: state.applyQuickStyle
  }));