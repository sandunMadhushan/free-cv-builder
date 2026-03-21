import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Initial state
const initialState = {
  isDark: false, // Default to light mode
  theme: 'light', // 'light' | 'dark' | 'system'
};

// Apply theme to document
const applyTheme = (theme) => {
  const root = window.document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

// Get system preference
const getSystemPreference = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
          const newTheme = newIsDark ? 'dark' : 'light';

          set({
            isDark: newIsDark,
            theme: newTheme
          });

          applyTheme(newTheme);
        },

        // Set specific theme
        setTheme: (theme) => {
          let isDark;

          if (theme === 'system') {
            isDark = getSystemPreference();

            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
              const state = get();
              if (state.theme === 'system') {
                const systemIsDark = mediaQuery.matches;
                set({ isDark: systemIsDark });
                applyTheme(systemIsDark ? 'dark' : 'light');
              }
            };

            mediaQuery.addEventListener('change', handleChange);
          } else {
            isDark = theme === 'dark';
          }

          set({
            theme,
            isDark
          });

          applyTheme(isDark ? 'dark' : 'light');
        },

        // Initialize theme on app load
        initializeTheme: () => {
          const state = get();
          let isDark = state.isDark;

          if (state.theme === 'system') {
            isDark = getSystemPreference();
            set({ isDark });
          }

          applyTheme(isDark ? 'dark' : 'light');
        },

        // Get current theme info
        getThemeInfo: () => {
          const state = get();
          return {
            theme: state.theme,
            isDark: state.isDark,
            icon: state.isDark ? '🌙' : '☀️',
            label: state.isDark ? 'Dark' : 'Light'
          };
        }
      }),
      {
        name: 'theme-storage',
        version: 1,
      }
    ),
    {
      name: 'Theme Store',
    }
  )
);