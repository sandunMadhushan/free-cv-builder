import React from 'react';
import { Input } from '../../common/Input';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { useCVStore } from '../../../store/cvStore';

export const EducationForm = () => {
  const education = useCVStore((state) => state.education);
  const addEducation = useCVStore((state) => state.addEducation);
  const updateEducation = useCVStore((state) => state.updateEducation);
  const removeEducation = useCVStore((state) => state.removeEducation);

  const handleChange = (id, field) => (e) => {
    const value = e.target.value;
    updateEducation(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        <p className="text-sm text-gray-600 mt-1">
          Add your educational background in reverse chronological order
        </p>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No education added yet</p>
          <Button onClick={addEducation}>Add Education</Button>
        </div>
      ) : (
        <>
          {education.map((edu, index) => (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Education #{index + 1}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={handleChange(edu.id, 'institution')}
                  placeholder="Harvard University"
                  required
                />

                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={handleChange(edu.id, 'degree')}
                  placeholder="Bachelor of Science"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Field of Study"
                  value={edu.field}
                  onChange={handleChange(edu.id, 'field')}
                  placeholder="Computer Science"
                />

                <Input
                  label="Location"
                  value={edu.location}
                  onChange={handleChange(edu.id, 'location')}
                  placeholder="Cambridge, MA"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Start Date"
                  type="month"
                  value={edu.startDate}
                  onChange={handleChange(edu.id, 'startDate')}
                  required
                />

                <Input
                  label="End Date"
                  type="month"
                  value={edu.endDate}
                  onChange={handleChange(edu.id, 'endDate')}
                />

                <Input
                  label="GPA (Optional)"
                  value={edu.gpa}
                  onChange={handleChange(edu.id, 'gpa')}
                  placeholder="3.8"
                />
              </div>

              <Textarea
                label="Achievements & Activities"
                value={edu.achievements?.join('\n') || ''}
                onChange={(e) => {
                  const achievements = e.target.value.split('\n').filter(item => item.trim());
                  updateEducation(edu.id, { achievements });
                }}
                placeholder="• Dean's List&#10;• Computer Science Society President&#10;• Magna Cum Laude"
                rows={4}
              />
            </div>
          ))}

          <Button onClick={addEducation} variant="secondary" className="w-full">
            + Add Another Education
          </Button>
        </>
      )}
    </div>
  );
};