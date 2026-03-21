import React from 'react';
import { Input } from '../../common/Input';
import { useCVStore } from '../../../store/cvStore';

export const PersonalInfoForm = () => {
  const personalInfo = useCVStore((state) => state.personalInfo);
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);

  const handleChange = (field) => (e) => {
    updatePersonalInfo({ [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
        <p className="text-sm text-gray-600 mt-1">
          Basic contact information and professional links
        </p>
      </div>

      <Input
        label="Full Name"
        value={personalInfo.fullName}
        onChange={handleChange('fullName')}
        placeholder="John Doe"
        required
      />

      <Input
        label="Email"
        type="email"
        value={personalInfo.email}
        onChange={handleChange('email')}
        placeholder="john.doe@example.com"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          value={personalInfo.phone}
          onChange={handleChange('phone')}
          placeholder="+1 (555) 123-4567"
        />

        <Input
          label="Location"
          value={personalInfo.location}
          onChange={handleChange('location')}
          placeholder="New York, NY"
        />
      </div>

      <Input
        label="LinkedIn"
        value={personalInfo.linkedin}
        onChange={handleChange('linkedin')}
        placeholder="linkedin.com/in/johndoe"
      />

      <Input
        label="GitHub"
        value={personalInfo.github}
        onChange={handleChange('github')}
        placeholder="github.com/johndoe"
      />

      <Input
        label="Website"
        type="url"
        value={personalInfo.website}
        onChange={handleChange('website')}
        placeholder="johndoe.com"
      />
    </div>
  );
};
