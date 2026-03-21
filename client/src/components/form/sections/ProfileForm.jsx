import React from 'react';
import { Textarea } from '../../common/Textarea';
import { useCVStore } from '../../../store/cvStore';

export const ProfileForm = () => {
  const profile = useCVStore((state) => state.profile);
  const updateProfile = useCVStore((state) => state.updateProfile);

  const handleChange = (e) => {
    updateProfile({ summary: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
        <p className="text-sm text-gray-600 mt-1">
          A brief overview of your experience and career goals
        </p>
      </div>

      <Textarea
        label="Summary"
        value={profile.summary}
        onChange={handleChange}
        placeholder="Experienced software engineer with 5+ years in full-stack development..."
        rows={6}
      />

      <div className="text-xs text-gray-500">
        <p>Tips for a strong summary:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Keep it concise (2-4 sentences)</li>
          <li>Highlight your key skills and experience</li>
          <li>Mention your career goals</li>
          <li>Use action words and quantify achievements</li>
        </ul>
      </div>
    </div>
  );
};
