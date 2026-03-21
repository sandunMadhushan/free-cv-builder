export const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional design with accent colors',
    features: {
      supportsPhoto: true,
      supportsAccentColor: true,
      twoColumn: false,
      atsScore: 95
    },
    preview: 'A clean, single-column layout with accent color headers and modern typography'
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, formal layout perfect for conservative industries',
    features: {
      supportsPhoto: true,
      supportsAccentColor: false,
      twoColumn: false,
      atsScore: 100
    },
    preview: 'Traditional single-column format with serif font and conservative styling'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Two-column design with sidebar and clean aesthetics',
    features: {
      supportsPhoto: false,
      supportsAccentColor: true,
      twoColumn: true,
      atsScore: 90
    },
    preview: 'Two-column layout with contact info and skills in left sidebar'
  }
};

export const getTemplate = (templateId) => {
  return TEMPLATES[templateId] || TEMPLATES.modern;
};