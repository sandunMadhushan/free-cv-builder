export const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional design with accent colors',
    category: 'professional',
    features: {
      supportsPhoto: true,
      supportsAccentColor: true,
      twoColumn: false,
      atsScore: 95,
      industryFit: ['tech', 'creative', 'startup']
    },
    preview: 'A clean, single-column layout with accent color headers and modern typography',
    variations: ['standard', 'bold', 'minimal']
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, formal layout perfect for conservative industries',
    category: 'traditional',
    features: {
      supportsPhoto: true,
      supportsAccentColor: false,
      twoColumn: false,
      atsScore: 100,
      industryFit: ['finance', 'law', 'government', 'healthcare']
    },
    preview: 'Traditional single-column format with serif font and conservative styling',
    variations: ['standard', 'executive', 'academic']
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Two-column design with sidebar and clean aesthetics',
    category: 'contemporary',
    features: {
      supportsPhoto: false,
      supportsAccentColor: true,
      twoColumn: true,
      atsScore: 90,
      industryFit: ['design', 'consulting', 'marketing']
    },
    preview: 'Two-column layout with contact info and skills in left sidebar',
    variations: ['standard', 'compact', 'expanded']
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Premium professional template for senior positions',
    category: 'premium',
    features: {
      supportsPhoto: true,
      supportsAccentColor: true,
      twoColumn: false,
      atsScore: 95,
      industryFit: ['executive', 'management', 'consulting', 'finance']
    },
    preview: 'Sophisticated single-column layout with premium typography and subtle branding',
    variations: ['standard', 'corporate', 'luxury']
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Dynamic template for creative professionals with portfolio focus',
    category: 'creative',
    features: {
      supportsPhoto: true,
      supportsAccentColor: true,
      twoColumn: true,
      atsScore: 85,
      industryFit: ['design', 'media', 'art', 'advertising']
    },
    preview: 'Creative two-column layout optimized for showcasing projects and portfolio',
    variations: ['standard', 'portfolio', 'artistic']
  },
  technical: {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for technical roles with skills and project emphasis',
    category: 'specialized',
    features: {
      supportsPhoto: false,
      supportsAccentColor: true,
      twoColumn: true,
      atsScore: 98,
      industryFit: ['tech', 'engineering', 'data', 'research']
    },
    preview: 'Technical-focused layout highlighting skills, certifications, and projects',
    variations: ['standard', 'detailed', 'compact']
  },
  international: {
    id: 'international',
    name: 'International',
    description: 'Global standard format suitable for international opportunities',
    category: 'global',
    features: {
      supportsPhoto: true,
      supportsAccentColor: false,
      twoColumn: false,
      atsScore: 100,
      industryFit: ['multilateral', 'international', 'ngo', 'education']
    },
    preview: 'International CV format compliant with global hiring standards',
    variations: ['standard', 'europass', 'academic']
  }
};

export const TEMPLATE_CATEGORIES = {
  professional: {
    name: 'Professional',
    description: 'Modern templates for professional environments',
    color: 'blue'
  },
  traditional: {
    name: 'Traditional',
    description: 'Conservative templates for formal industries',
    color: 'gray'
  },
  contemporary: {
    name: 'Contemporary',
    description: 'Clean, modern designs for forward-thinking companies',
    color: 'green'
  },
  premium: {
    name: 'Premium',
    description: 'Executive-level templates for senior positions',
    color: 'purple'
  },
  creative: {
    name: 'Creative',
    description: 'Dynamic templates for creative professionals',
    color: 'pink'
  },
  specialized: {
    name: 'Specialized',
    description: 'Industry-specific templates',
    color: 'yellow'
  },
  global: {
    name: 'Global',
    description: 'International standards and formats',
    color: 'indigo'
  }
};

export const INDUSTRY_PRESETS = {
  tech: {
    name: 'Technology',
    recommendedTemplates: ['modern', 'technical', 'minimal'],
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#0ea5e9'
    },
    fonts: ['Inter', 'Roboto', 'Open Sans'],
    description: 'Optimized for software engineering, product management, and tech roles'
  },
  finance: {
    name: 'Finance & Banking',
    recommendedTemplates: ['classic', 'executive', 'international'],
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#059669'
    },
    fonts: ['Times New Roman', 'Georgia', 'Crimson Text'],
    description: 'Conservative styling appropriate for financial institutions'
  },
  creative: {
    name: 'Creative & Design',
    recommendedTemplates: ['creative', 'modern', 'minimal'],
    colors: {
      primary: '#7c3aed',
      secondary: '#64748b',
      accent: '#ec4899'
    },
    fonts: ['Montserrat', 'Playfair Display', 'Source Sans Pro'],
    description: 'Dynamic designs for creative professionals and agencies'
  },
  consulting: {
    name: 'Consulting',
    recommendedTemplates: ['executive', 'modern', 'minimal'],
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#0891b2'
    },
    fonts: ['Inter', 'Merriweather', 'Lato'],
    description: 'Professional templates for management consulting and advisory roles'
  }
};

export const ADVANCED_CUSTOMIZATIONS = {
  colorSchemes: {
    corporate: {
      name: 'Corporate Blue',
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#f8fafc',
      text: '#1f2937'
    },
    executive: {
      name: 'Executive Gray',
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#059669',
      background: '#ffffff',
      text: '#111827'
    },
    modern: {
      name: 'Modern Purple',
      primary: '#7c3aed',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#fafafa',
      text: '#1f2937'
    },
    minimal: {
      name: 'Minimal Black',
      primary: '#000000',
      secondary: '#525252',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#171717'
    },
    warm: {
      name: 'Warm Professional',
      primary: '#c2410c',
      secondary: '#78716c',
      accent: '#ea580c',
      background: '#fefcfb',
      text: '#1c1917'
    }
  },
  typography: {
    professional: {
      name: 'Professional',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingWeight: '600',
      bodyWeight: '400',
      lineHeight: '1.5'
    },
    executive: {
      name: 'Executive',
      headingFont: 'Playfair Display',
      bodyFont: 'Source Sans Pro',
      headingWeight: '700',
      bodyWeight: '400',
      lineHeight: '1.6'
    },
    modern: {
      name: 'Modern',
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      headingWeight: '600',
      bodyWeight: '400',
      lineHeight: '1.5'
    },
    classic: {
      name: 'Classic',
      headingFont: 'Georgia',
      bodyFont: 'Times New Roman',
      headingWeight: '700',
      bodyWeight: '400',
      lineHeight: '1.6'
    }
  },
  spacing: {
    compact: {
      name: 'Compact',
      sectionSpacing: '1rem',
      itemSpacing: '0.5rem',
      marginTop: '2rem',
      marginBottom: '2rem'
    },
    comfortable: {
      name: 'Comfortable',
      sectionSpacing: '1.5rem',
      itemSpacing: '0.75rem',
      marginTop: '2.5rem',
      marginBottom: '2.5rem'
    },
    spacious: {
      name: 'Spacious',
      sectionSpacing: '2rem',
      itemSpacing: '1rem',
      marginTop: '3rem',
      marginBottom: '3rem'
    }
  },
  layouts: {
    standard: {
      name: 'Standard',
      contentWidth: '100%',
      sidebarWidth: '30%',
      headerStyle: 'traditional'
    },
    wide: {
      name: 'Wide Format',
      contentWidth: '100%',
      sidebarWidth: '35%',
      headerStyle: 'expanded'
    },
    narrow: {
      name: 'Narrow Focus',
      contentWidth: '90%',
      sidebarWidth: '25%',
      headerStyle: 'compact'
    }
  }
};

export const getTemplate = (templateId) => {
  return TEMPLATES[templateId] || TEMPLATES.modern;
};

export const getTemplatesByCategory = () => {
  const categorized = {};

  Object.values(TEMPLATES).forEach(template => {
    const category = template.category;
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(template);
  });

  return categorized;
};

export const getRecommendedTemplates = (industry) => {
  const industryPreset = INDUSTRY_PRESETS[industry];
  if (!industryPreset) return Object.values(TEMPLATES).slice(0, 3);

  return industryPreset.recommendedTemplates.map(templateId =>
    TEMPLATES[templateId]
  ).filter(Boolean);
};

export const getIndustryPreset = (industry) => {
  return INDUSTRY_PRESETS[industry] || null;
};