import React, { useState } from 'react';
import { Input } from '../../common/Input';
import { useCVStore } from '../../../store/cvStore';
import { validateEmail, validateRequired, validatePhone, validateURL } from '../../../utils/validation';

export const PersonalInfoForm = () => {
  const personalInfo = useCVStore((state) => state.personalInfo);
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);

  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'fullName':
        error = validateRequired(value, 'Full name');
        break;
      case 'email':
        error = validateRequired(value, 'Email') || validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'website':
        error = validateURL(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    updatePersonalInfo({ [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => (e) => {
    validateField(field, e.target.value);
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
        onBlur={handleBlur('fullName')}
        placeholder="John Doe"
        required
        error={errors.fullName}
      />

      <Input
        label="Email"
        type="email"
        value={personalInfo.email}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        placeholder="john.doe@example.com"
        required
        error={errors.email}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          value={personalInfo.phone}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          placeholder="+1 (555) 123-4567"
          error={errors.phone}
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
        onBlur={handleBlur('website')}
        placeholder="johndoe.com"
        error={errors.website}
      />
    </div>
  );
};
