import React from 'react';
import { Input } from '../../common/Input';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { useCVStore } from '../../../store/cvStore';

export const ExperienceForm = () => {
  const experience = useCVStore((state) => state.experience);
  const addExperience = useCVStore((state) => state.addExperience);
  const updateExperience = useCVStore((state) => state.updateExperience);
  const removeExperience = useCVStore((state) => state.removeExperience);

  const handleChange = (id, field) => (e) => {
    const value = field === 'current' ? e.target.checked : e.target.value;
    updateExperience(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
        <p className="text-sm text-gray-600 mt-1">
          Add your work history in reverse chronological order
        </p>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No experience added yet</p>
          <Button onClick={addExperience}>Add Experience</Button>
        </div>
      ) : (
        <>
          {experience.map((exp, index) => (
            <div key={exp.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Experience #{index + 1}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={handleChange(exp.id, 'company')}
                  placeholder="Google Inc."
                  required
                />

                <Input
                  label="Position"
                  value={exp.position}
                  onChange={handleChange(exp.id, 'position')}
                  placeholder="Software Engineer"
                  required
                />
              </div>

              <Input
                label="Location"
                value={exp.location}
                onChange={handleChange(exp.id, 'location')}
                placeholder="San Francisco, CA"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={handleChange(exp.id, 'startDate')}
                  required
                />

                <Input
                  label="End Date"
                  type="month"
                  value={exp.endDate}
                  onChange={handleChange(exp.id, 'endDate')}
                  disabled={exp.current}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={handleChange(exp.id, 'current')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`current-${exp.id}`} className="ml-2 text-sm text-gray-700">
                  I currently work here
                </label>
              </div>

              <Textarea
                label="Description"
                value={exp.description}
                onChange={handleChange(exp.id, 'description')}
                placeholder="Describe your responsibilities, achievements, and impact..."
                rows={5}
              />
            </div>
          ))}

          <Button onClick={addExperience} variant="secondary" className="w-full">
            + Add Another Experience
          </Button>
        </>
      )}
    </div>
  );
};
