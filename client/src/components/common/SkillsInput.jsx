import React, { useState } from 'react';
import { Button } from './Button';

export const SkillsInput = ({ label, skills = [], onSkillsChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Skills tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button type="button" onClick={addSkill} size="sm">
          Add
        </Button>
      </div>
    </div>
  );
};