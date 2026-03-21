import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Initial state
const initialState = {
  isDark: false, // Default to light mode
  theme: "light", // 'light' | 'dark' | 'system'
  previewIsDark: false, // Separate theme for CV preview
  previewTheme: "light", // Preview can have independent theme
};

// Apply theme to document
const applyTheme = (theme) => {
  const root = window.document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }

  // Force a re-render by updating a CSS custom property
  root.style.setProperty("--theme-updated", Date.now());
};

// Get system preference
const getSystemPreference = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Create the theme store
export const useThemeStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Toggle between light and dark mode
        toggleTheme: () => {
          const state = get();
          const newIsDark = !state.isDark;
          const newTheme = newIsDark ? "dark" : "light";

          set({
            isDark: newIsDark,
            theme: newTheme,
          });

          applyTheme(newTheme);

          // Debug log to help troubleshoot
          console.log("Theme toggled:", {
            newTheme,
            newIsDark,
            documentClasses: document.documentElement.classList.toString(),
          });
        },

        // Toggle preview theme independently
        togglePreviewTheme: () => {
          const state = get();
          const newPreviewIsDark = !state.previewIsDark;
          const newPreviewTheme = newPreviewIsDark ? "dark" : "light";

          set({
            previewIsDark: newPreviewIsDark,
            previewTheme: newPreviewTheme,
          });

          console.log("Preview theme toggled:", {
            newPreviewTheme,
            newPreviewIsDark,
          });
        },

        // Set specific theme
        setTheme: (theme) => {
          let isDark;

          if (theme === "system") {
            isDark = getSystemPreference();

            // Listen for system theme changes
            const mediaQuery = window.matchMedia(
              "(prefers-color-scheme: dark)",
            );
            const handleChange = () => {
              const state = get();
              if (state.theme === "system") {
                const systemIsDark = mediaQuery.matches;
                set({ isDark: systemIsDark });
                applyTheme(systemIsDark ? "dark" : "light");
              }
            };

            mediaQuery.addEventListener("change", handleChange);
          } else {
            isDark = theme === "dark";
          }

          set({
            theme,
            isDark,
          });

          applyTheme(isDark ? "dark" : "light");
        },

        // Initialize theme on app load
        initializeTheme: () => {
          const state = get();
          let isDark = state.isDark;

          // If theme is system, detect system preference
          if (state.theme === "system" || state.theme === undefined) {
            isDark = getSystemPreference();
            set({
              isDark,
              theme: "system",
            });
          }

          // Always apply the theme to ensure DOM is updated
          applyTheme(isDark ? "dark" : "light");

          // Set up system theme change listener if needed
          if (state.theme === "system") {
            const mediaQuery = window.matchMedia(
              "(prefers-color-scheme: dark)",
            );
            const handleChange = () => {
              const currentState = get();
              if (currentState.theme === "system") {
                const systemIsDark = mediaQuery.matches;
                set({ isDark: systemIsDark });
                applyTheme(systemIsDark ? "dark" : "light");
              }
            };

            // Remove existing listener if any
            mediaQuery.removeEventListener("change", handleChange);
            mediaQuery.addEventListener("change", handleChange);
          }
        },

        // Get current theme info
        getThemeInfo: () => {
          const state = get();
          return {
            theme: state.theme,
            isDark: state.isDark,
            icon: state.isDark ? "🌙" : "☀️",
            label: state.isDark ? "Dark" : "Light",
          };
        },

        // Get preview theme info
        getPreviewThemeInfo: () => {
          const state = get();
          return {
            theme: state.previewTheme,
            isDark: state.previewIsDark,
            icon: state.previewIsDark ? "🌙" : "☀️",
            label: state.previewIsDark ? "Dark Preview" : "Light Preview",
          };
        },
      }),
      {
        name: "theme-storage",
        version: 1,
      },
    ),
    {
      name: "Theme Store",
    },
  ),
);
