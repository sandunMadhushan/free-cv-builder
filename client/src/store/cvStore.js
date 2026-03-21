import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Generate unique IDs for list items
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Initial state
const initialState = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
  },
  profile: {
    summary: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    tools: [],
  },
  projects: [],
  certifications: [],
  languages: [],
  sectionOrder: [
    "personalInfo",
    "profile",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
  ],
  activeSections: {
    personalInfo: true,
    profile: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  },
};

// Create the store
export const useCVStore = create(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Personal Info actions
        updatePersonalInfo: (data) =>
          set((state) => ({
            personalInfo: { ...state.personalInfo, ...data },
          })),

        // Profile actions
        updateProfile: (data) =>
          set((state) => ({
            profile: { ...state.profile, ...data },
          })),

        // Experience actions
        addExperience: () =>
          set((state) => ({
            experience: [
              ...state.experience,
              {
                id: generateId(),
                company: "",
                position: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
                highlights: [],
              },
            ],
          })),

        updateExperience: (id, data) =>
          set((state) => ({
            experience: state.experience.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp,
            ),
          })),

        removeExperience: (id) =>
          set((state) => ({
            experience: state.experience.filter((exp) => exp.id !== id),
          })),

        // Education actions
        addEducation: () =>
          set((state) => ({
            education: [
              ...state.education,
              {
                id: generateId(),
                institution: "",
                degree: "",
                field: "",
                location: "",
                startDate: "",
                endDate: "",
                gpa: "",
                achievements: [],
              },
            ],
          })),

        updateEducation: (id, data) =>
          set((state) => ({
            education: state.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu,
            ),
          })),

        removeEducation: (id) =>
          set((state) => ({
            education: state.education.filter((edu) => edu.id !== id),
          })),

        // Skills actions
        updateSkills: (category, skills) =>
          set((state) => ({
            skills: { ...state.skills, [category]: skills },
          })),

        // Projects actions
        addProject: () =>
          set((state) => ({
            projects: [
              ...state.projects,
              {
                id: generateId(),
                name: "",
                description: "",
                technologies: [],
                link: "",
                startDate: "",
                endDate: "",
              },
            ],
          })),

        updateProject: (id, data) =>
          set((state) => ({
            projects: state.projects.map((proj) =>
              proj.id === id ? { ...proj, ...data } : proj,
            ),
          })),

        removeProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((proj) => proj.id !== id),
          })),

        // Certifications actions
        addCertification: () =>
          set((state) => ({
            certifications: [
              ...state.certifications,
              {
                id: generateId(),
                name: "",
                issuer: "",
                date: "",
                expiryDate: "",
                credentialId: "",
                link: "",
              },
            ],
          })),

        updateCertification: (id, data) =>
          set((state) => ({
            certifications: state.certifications.map((cert) =>
              cert.id === id ? { ...cert, ...data } : cert,
            ),
          })),

        removeCertification: (id) =>
          set((state) => ({
            certifications: state.certifications.filter(
              (cert) => cert.id !== id,
            ),
          })),

        // Languages actions
        addLanguage: () =>
          set((state) => ({
            languages: [
              ...state.languages,
              {
                id: generateId(),
                name: "",
                proficiency: "Intermediate",
              },
            ],
          })),

        updateLanguage: (id, data) =>
          set((state) => ({
            languages: state.languages.map((lang) =>
              lang.id === id ? { ...lang, ...data } : lang,
            ),
          })),

        removeLanguage: (id) =>
          set((state) => ({
            languages: state.languages.filter((lang) => lang.id !== id),
          })),

        // Section management
        toggleSection: (section) =>
          set((state) => ({
            activeSections: {
              ...state.activeSections,
              [section]: !state.activeSections[section],
            },
          })),

        updateSectionOrder: (newOrder) =>
          set(() => ({
            sectionOrder: newOrder,
          })),

        // Reset all data
        resetCV: () => set(initialState),

        // Load CV data (useful for version management)
        loadCV: (data) => set(data),
      }),
      {
        name: "cv-storage", // localStorage key
        version: 1,
      },
    ),
    {
      name: "CV Store",
    },
  ),
);
