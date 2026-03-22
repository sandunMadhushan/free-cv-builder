import React, { useState, useMemo } from 'react';
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  INDUSTRY_PRESETS,
  ADVANCED_CUSTOMIZATIONS,
  getTemplatesByCategory,
  getRecommendedTemplates
} from '../../config/enhancedTemplates';
import { useEnhancedTemplateStore, useTemplateActions } from '../../store/enhancedTemplateStore';
import { Button } from '../common/Button';
import { Select } from '../common/AdvancedFormComponents';

export const EnhancedTemplateSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showQuickStyles, setShowQuickStyles] = useState(false);

  const {
    selectedTemplate,
    selectedVariation,
    selectedIndustry: industryPreset,
    customization,
    previewMode
  } = useEnhancedTemplateStore();

  const {
    setTemplate,
    setColorScheme,
    setTypographyPreset,
    applyIndustryPreset,
    applyQuickStyle
  } = useTemplateActions();

  const categorizedTemplates = useMemo(() => getTemplatesByCategory(), []);

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') {
      return Object.values(TEMPLATES);
    }
    return categorizedTemplates[selectedCategory] || [];
  }, [selectedCategory, categorizedTemplates]);

  const recommendedTemplates = useMemo(() => {
    if (selectedIndustry) {
      return getRecommendedTemplates(selectedIndustry);
    }
    return [];
  }, [selectedIndustry]);

  const handleTemplateSelect = (templateId, variation = 'standard') => {
    setTemplate(templateId, variation);
  };

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    if (industry) {
      applyIndustryPreset(industry);
    }
  };

  const CategoryButton = ({ categoryId, category }) => (
    <button
      onClick={() => setSelectedCategory(categoryId)}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${selectedCategory === categoryId
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-2 border-transparent hover:border-surface-300 dark:hover:border-surface-600'
        }
      `}
    >
      {category.name}
    </button>
  );

  const TemplateCard = ({ template, isRecommended = false }) => (
    <div
      className={`
        relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
        ${selectedTemplate === template.id
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
          : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
        }
        ${isRecommended ? 'ring-2 ring-warning-400 dark:ring-warning-500' : ''}
      `}
      onClick={() => handleTemplateSelect(template.id)}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-warning-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          Recommended
        </div>
      )}

      {/* Selection Badge */}
      {selectedTemplate === template.id && (
        <div className="absolute -top-2 -left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Active
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1">
            {template.name}
          </h3>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
            {template.description}
          </p>

          {/* Category Badge */}
          <span className={`
            inline-block text-xs px-2 py-1 rounded-full font-medium mb-2
            ${TEMPLATE_CATEGORIES[template.category]?.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
              TEMPLATE_CATEGORIES[template.category]?.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
              TEMPLATE_CATEGORIES[template.category]?.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
              'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300'
            }
          `}>
            {TEMPLATE_CATEGORIES[template.category]?.name}
          </span>
        </div>

        {/* Template Preview */}
        <div className={`
          w-20 h-24 border border-surface-300 dark:border-surface-600 rounded shadow-sm
          relative overflow-hidden ml-4 flex-shrink-0
          ${selectedTemplate === template.id ? 'border-primary-500' : ''}
        `}>
          <TemplatePreview template={template} />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2 text-xs text-surface-500 dark:text-surface-400 mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-success-500 rounded-full mr-1"></div>
          ATS Score: {template.features.atsScore}%
        </div>

        {template.features.twoColumn && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
            Two Column
          </div>
        )}

        {template.features.supportsPhoto && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
            Photo Support
          </div>
        )}

        {template.features.supportsAccentColor && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-pink-500 rounded-full mr-1"></div>
            Custom Colors
          </div>
        )}
      </div>

      {/* Industry Fit */}
      {template.features.industryFit && (
        <div className="text-xs text-surface-500 dark:text-surface-400">
          <span className="font-medium">Best for:</span>{' '}
          {template.features.industryFit.slice(0, 2).join(', ')}
          {template.features.industryFit.length > 2 && ` +${template.features.industryFit.length - 2} more`}
        </div>
      )}

      {/* Variations */}
      {selectedTemplate === template.id && template.variations && (
        <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
          <p className="text-xs font-medium text-surface-700 dark:text-surface-300 mb-2">Variations:</p>
          <div className="flex gap-2">
            {template.variations.map(variation => (
              <button
                key={variation}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect(template.id, variation);
                }}
                className={`
                  text-xs px-2 py-1 rounded transition-colors duration-150
                  ${selectedVariation === variation
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600'
                  }
                `}
              >
                {variation}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TemplatePreview = ({ template }) => {
    // Simplified template previews - you would implement actual miniature representations
    const previewStyles = {
      modern: (
        <div className="p-1">
          <div className="h-1 bg-primary-500 mb-1 rounded"></div>
          <div className="space-y-0.5">
            <div className="h-0.5 bg-surface-400 rounded"></div>
            <div className="h-0.5 bg-surface-300 rounded w-3/4"></div>
            <div className="h-0.5 bg-surface-300 rounded w-1/2"></div>
          </div>
          <div className="mt-2 space-y-0.5">
            <div className="h-0.5 bg-primary-400 rounded w-2/3"></div>
            <div className="h-0.5 bg-surface-300 rounded"></div>
          </div>
        </div>
      ),
      executive: (
        <div className="p-1">
          <div className="text-center border-b border-surface-300 pb-1 mb-1">
            <div className="h-0.5 bg-surface-800 rounded mx-auto w-3/4 mb-0.5"></div>
            <div className="h-0.5 bg-primary-500 rounded mx-auto w-1/2"></div>
          </div>
          <div className="space-y-1">
            <div className="h-0.5 bg-surface-600 rounded w-2/3"></div>
            <div className="space-y-0.5">
              <div className="h-0.5 bg-surface-400 rounded"></div>
              <div className="h-0.5 bg-surface-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ),
      // Add more preview styles as needed
    };

    return previewStyles[template.id] || previewStyles.modern;
  };

  const QuickStyleButton = ({ style, label, description }) => (
    <button
      onClick={() => applyQuickStyle(style)}
      className="p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-150 text-left"
    >
      <div className="font-medium text-surface-900 dark:text-surface-100">{label}</div>
      <div className="text-xs text-surface-600 dark:text-surface-400 mt-1">{description}</div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-700 pb-4">
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
          Professional Templates
        </h2>
        <p className="text-sm text-surface-600 dark:text-surface-400">
          Choose from our collection of professionally designed templates optimized for different industries and roles.
        </p>
      </div>

      {/* Industry Selector */}
      <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg">
        <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-3">
          Industry Recommendations
        </h3>
        <Select
          value={selectedIndustry}
          onChange={handleIndustrySelect}
          placeholder="Select your industry for personalized recommendations..."
          options={Object.entries(INDUSTRY_PRESETS).map(([key, preset]) => ({
            value: key,
            label: preset.name
          }))}
          className="mb-3"
        />
        {industryPreset && (
          <p className="text-sm text-surface-600 dark:text-surface-400">
            {INDUSTRY_PRESETS[industryPreset]?.description}
          </p>
        )}
      </div>

      {/* Quick Styles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-surface-900 dark:text-surface-100">
            Quick Styles
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickStyles(!showQuickStyles)}
          >
            {showQuickStyles ? 'Hide' : 'Show'} Quick Styles
          </Button>
        </div>

        {showQuickStyles && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <QuickStyleButton
              style="minimal"
              label="Minimal"
              description="Clean and simple"
            />
            <QuickStyleButton
              style="professional"
              label="Professional"
              description="Corporate standard"
            />
            <QuickStyleButton
              style="executive"
              label="Executive"
              description="Premium styling"
            />
            <QuickStyleButton
              style="creative"
              label="Creative"
              description="Bold and modern"
            />
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <CategoryButton
          categoryId="all"
          category={{ name: 'All Templates' }}
        />
        {Object.entries(TEMPLATE_CATEGORIES).map(([categoryId, category]) => (
          <CategoryButton
            key={categoryId}
            categoryId={categoryId}
            category={category}
          />
        ))}
      </div>

      {/* Recommended Templates */}
      {recommendedTemplates.length > 0 && (
        <div>
          <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
            Recommended for {INDUSTRY_PRESETS[selectedIndustry]?.name}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {recommendedTemplates.map(template => (
              <TemplateCard
                key={`rec-${template.id}`}
                template={template}
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div>
        <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
          {selectedCategory === 'all' ? 'All Templates' : TEMPLATE_CATEGORIES[selectedCategory]?.name}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
        <h3 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
          💡 Professional Tips
        </h3>
        <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-1">
          <li><strong>ATS Optimization:</strong> Higher ATS scores mean better compatibility with applicant tracking systems</li>
          <li><strong>Industry Fit:</strong> Choose templates that align with your target industry's expectations</li>
          <li><strong>Customization:</strong> Use industry presets as starting points, then fine-tune colors and typography</li>
          <li><strong>Two-Column vs Single:</strong> Single column is generally more ATS-friendly, two-column works better for creative roles</li>
        </ul>
      </div>
    </div>
  );
};