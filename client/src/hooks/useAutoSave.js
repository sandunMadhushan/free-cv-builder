import { useEffect, useState } from "react";
import { useCVStore } from "../store/cvStore";

/**
 * Hook to track auto-save status and provide visual feedback
 * Returns { isSaving, lastSaved, saveCount }
 */
export const useAutoSave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveCount, setSaveCount] = useState(0);

  const cvData = useCVStore();

  useEffect(() => {
    // Debounce save indicator
    setIsSaving(true);

    const saveTimer = setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      setSaveCount((prev) => prev + 1);
    }, 500); // Show saving for 500ms

    return () => clearTimeout(saveTimer);
  }, [
    cvData.personalInfo,
    cvData.profile,
    cvData.experience,
    cvData.education,
    cvData.skills,
    cvData.projects,
    cvData.certifications,
    cvData.languages,
    cvData.activeSections,
    cvData.sectionOrder,
  ]);

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return "Not saved yet";

    const now = new Date();
    const diffMs = now - lastSaved;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffSeconds < 10) {
      return "Saved just now";
    } else if (diffSeconds < 60) {
      return `Saved ${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `Saved ${diffMinutes}m ago`;
    } else {
      return lastSaved.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return {
    isSaving,
    lastSaved,
    lastSavedText: getLastSavedText(),
    saveCount,
  };
};
