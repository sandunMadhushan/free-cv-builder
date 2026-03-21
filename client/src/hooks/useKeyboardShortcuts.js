import { useEffect } from "react";

/**
 * Custom hook for handling keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for modifier keys
      const isCtrl = event.ctrlKey || event.metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)
      const isShift = event.shiftKey;
      const isAlt = event.altKey;

      // Create key combination string
      let combination = "";
      if (isCtrl) combination += "ctrl+";
      if (isShift) combination += "shift+";
      if (isAlt) combination += "alt+";
      combination += event.key.toLowerCase();

      // Check if we have a handler for this combination
      const handler = shortcuts[combination];
      if (handler && typeof handler === "function") {
        // Prevent default browser behavior
        event.preventDefault();
        event.stopPropagation();

        // Call the handler
        handler(event);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
};

/**
 * Global keyboard shortcuts for the CV Builder app
 */
export const useGlobalKeyboardShortcuts = (onExport, onSave, onReset) => {
  const shortcuts = {
    // Export CV (Ctrl+P or Ctrl+E)
    "ctrl+p": (e) => {
      e.preventDefault();
      onExport?.();
    },
    "ctrl+e": (e) => {
      e.preventDefault();
      onExport?.();
    },

    // Save CV (Ctrl+S)
    "ctrl+s": (e) => {
      e.preventDefault();
      onSave?.();
    },

    // Reset (Ctrl+Shift+R)
    "ctrl+shift+r": (e) => {
      e.preventDefault();
      if (
        window.confirm(
          "Are you sure you want to reset all data? This cannot be undone.",
        )
      ) {
        onReset?.();
      }
    },

    // Help (Ctrl+?)
    "ctrl+?": (e) => {
      e.preventDefault();
      showKeyboardShortcutsHelp();
    },
    "ctrl+/": (e) => {
      e.preventDefault();
      showKeyboardShortcutsHelp();
    },
  };

  useKeyboardShortcuts(shortcuts);
};

// Helper function to show keyboard shortcuts help
const showKeyboardShortcutsHelp = () => {
  const shortcuts = [
    { keys: "Ctrl + P", description: "Export CV as PDF" },
    { keys: "Ctrl + E", description: "Export CV as PDF" },
    { keys: "Ctrl + S", description: "Save CV (auto-saved)" },
    { keys: "Ctrl + Shift + R", description: "Reset all data" },
    { keys: "Ctrl + ?", description: "Show this help" },
  ];

  const helpText = shortcuts
    .map((s) => `${s.keys}: ${s.description}`)
    .join("\n");

  alert(`Keyboard Shortcuts:\n\n${helpText}`);
};
