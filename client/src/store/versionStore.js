import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Generate unique IDs for versions
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Initial state
const initialState = {
  versions: [], // Array of saved CV versions
  currentVersionId: null, // Currently active version
};

// Create version data snapshot
const createVersionSnapshot = (cvData, name = "") => {
  const timestamp = new Date().toISOString();
  const suggestedName =
    name || cvData.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName}'s CV`
      : "Untitled CV";

  return {
    id: generateId(),
    name: suggestedName,
    createdAt: timestamp,
    updatedAt: timestamp,
    data: {
      personalInfo: { ...cvData.personalInfo },
      profile: { ...cvData.profile },
      experience: [...cvData.experience],
      education: [...cvData.education],
      skills: { ...cvData.skills },
      projects: [...cvData.projects],
      certifications: [...cvData.certifications],
      languages: [...cvData.languages],
      activeSections: { ...cvData.activeSections },
      sectionOrder: [...cvData.sectionOrder],
    },
  };
};

// Create the version store
export const useVersionStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Save current CV as a new version
        saveVersion: (cvData, name = "") => {
          const version = createVersionSnapshot(cvData, name);

          set((state) => ({
            versions: [...state.versions, version],
            currentVersionId: version.id,
          }));

          return version.id;
        },

        // Update an existing version
        updateVersion: (id, cvData, name = null) => {
          set((state) => ({
            versions: state.versions.map((version) =>
              version.id === id
                ? {
                    ...version,
                    name: name || version.name,
                    updatedAt: new Date().toISOString(),
                    data: {
                      personalInfo: { ...cvData.personalInfo },
                      profile: { ...cvData.profile },
                      experience: [...cvData.experience],
                      education: [...cvData.education],
                      skills: { ...cvData.skills },
                      projects: [...cvData.projects],
                      certifications: [...cvData.certifications],
                      languages: [...cvData.languages],
                      activeSections: { ...cvData.activeSections },
                      sectionOrder: [...cvData.sectionOrder],
                    },
                  }
                : version,
            ),
          }));
        },

        // Delete a version
        deleteVersion: (id) => {
          set((state) => ({
            versions: state.versions.filter((version) => version.id !== id),
            currentVersionId:
              state.currentVersionId === id ? null : state.currentVersionId,
          }));
        },

        // Rename a version
        renameVersion: (id, newName) => {
          set((state) => ({
            versions: state.versions.map((version) =>
              version.id === id
                ? {
                    ...version,
                    name: newName,
                    updatedAt: new Date().toISOString(),
                  }
                : version,
            ),
          }));
        },

        // Set current version
        setCurrentVersion: (id) => {
          set(() => ({
            currentVersionId: id,
          }));
        },

        // Get version by ID
        getVersion: (id) => {
          const state = get();
          return state.versions.find((version) => version.id === id);
        },

        // Get all versions sorted by update date
        getSortedVersions: () => {
          const state = get();
          return [...state.versions].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );
        },

        // Duplicate a version
        duplicateVersion: (id) => {
          const state = get();
          const version = state.versions.find((v) => v.id === id);

          if (version) {
            const duplicatedVersion = createVersionSnapshot(
              version.data,
              `${version.name} (Copy)`,
            );

            set((state) => ({
              versions: [...state.versions, duplicatedVersion],
            }));

            return duplicatedVersion.id;
          }

          return null;
        },

        // Clear all versions
        clearVersions: () => {
          set(() => ({
            versions: [],
            currentVersionId: null,
          }));
        },

        // Get version statistics
        getStats: () => {
          const state = get();
          return {
            totalVersions: state.versions.length,
            oldestVersion:
              state.versions.length > 0
                ? Math.min(...state.versions.map((v) => new Date(v.createdAt)))
                : null,
            newestVersion:
              state.versions.length > 0
                ? Math.max(...state.versions.map((v) => new Date(v.updatedAt)))
                : null,
          };
        },
      }),
      {
        name: "cv-versions-storage", // localStorage key
        version: 1,
      },
    ),
    {
      name: "CV Version Store",
    },
  ),
);
