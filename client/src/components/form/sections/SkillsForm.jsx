import React from 'react';
import { SkillsInput } from '../../common/SkillsInput';
import { useCVStore } from '../../../store/cvStore';

export const SkillsForm = () => {
  const skills = useCVStore((state) => state.skills);
  const updateSkills = useCVStore((state) => state.updateSkills);

  const handleSkillsChange = (category) => (newSkills) => {
    updateSkills(category, newSkills);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
        <p className="text-sm text-gray-600 mt-1">
          Add your technical and soft skills, languages, and tools
        </p>
      </div>

      <div className="space-y-6">
        <SkillsInput
          label="Technical Skills"
          skills={skills.technical}
          onSkillsChange={handleSkillsChange('technical')}
          placeholder="e.g., JavaScript, Python, React, Node.js"
        />

        <SkillsInput
          label="Tools & Technologies"
          skills={skills.tools}
          onSkillsChange={handleSkillsChange('tools')}
          placeholder="e.g., Git, Docker, AWS, Figma"
        />

        <SkillsInput
          label="Soft Skills"
          skills={skills.soft}
          onSkillsChange={handleSkillsChange('soft')}
          placeholder="e.g., Leadership, Communication, Problem Solving"
        />

        <SkillsInput
          label="Languages"
          skills={skills.languages}
          onSkillsChange={handleSkillsChange('languages')}
          placeholder="e.g., English (Native), Spanish (Conversational)"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for Skills</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Focus on skills relevant to your target job</li>
          <li>• Use specific technologies and tools rather than vague terms</li>
          <li>• Include proficiency levels for languages (e.g., "Spanish (Fluent)")</li>
          <li>• Keep it concise - quality over quantity</li>
        </ul>
      </div>
    </div>
  );
};