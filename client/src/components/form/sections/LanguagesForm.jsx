import React from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { useCVStore } from '../../../store/cvStore';

export const LanguagesForm = () => {
  const languages = useCVStore((state) => state.languages);
  const addLanguage = useCVStore((state) => state.addLanguage);
  const updateLanguage = useCVStore((state) => state.updateLanguage);
  const removeLanguage = useCVStore((state) => state.removeLanguage);

  const proficiencyLevels = [
    { value: 'Native', description: 'Native or bilingual proficiency' },
    { value: 'Fluent', description: 'Full professional proficiency' },
    { value: 'Advanced', description: 'Advanced working proficiency' },
    { value: 'Intermediate', description: 'Limited working proficiency' },
    { value: 'Beginner', description: 'Elementary proficiency' },
  ];

  const handleChange = (id, field) => (e) => {
    const value = e.target.value;
    updateLanguage(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Languages</h2>
        <p className="text-sm text-gray-600 mt-1">
          List languages you speak and your proficiency level
        </p>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No languages added yet</p>
          <Button onClick={addLanguage}>Add Language</Button>
        </div>
      ) : (
        <>
          {languages.map((lang, index) => (
            <div key={lang.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Language #{index + 1}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeLanguage(lang.id)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Language"
                  value={lang.name}
                  onChange={handleChange(lang.id, 'name')}
                  placeholder="Spanish"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proficiency Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={handleChange(lang.id, 'proficiency')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Proficiency level description */}
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>{lang.proficiency}:</strong>{' '}
                  {proficiencyLevels.find(level => level.value === lang.proficiency)?.description}
                </p>
              </div>
            </div>
          ))}

          <Button onClick={addLanguage} variant="secondary" className="w-full">
            + Add Another Language
          </Button>
        </>
      )}

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="font-medium text-indigo-900 mb-2">🗣️ Language Tips</h3>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• <strong>Native:</strong> Your mother tongue or equivalent fluency</li>
          <li>• <strong>Fluent:</strong> Can work professionally in this language</li>
          <li>• <strong>Advanced:</strong> Can handle complex discussions and writing</li>
          <li>• <strong>Intermediate:</strong> Conversational level, can handle routine tasks</li>
          <li>• <strong>Beginner:</strong> Basic vocabulary and simple phrases</li>
        </ul>
        <div className="mt-3 pt-2 border-t border-indigo-200">
          <p className="text-xs text-indigo-600">
            💡 In global markets, multilingual skills are highly valued. Include languages relevant to your target employer's markets.
          </p>
        </div>
      </div>
    </div>
  );
};