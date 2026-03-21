import React from 'react';
import { Input } from '../../common/Input';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { useCVStore } from '../../../store/cvStore';

export const ProjectsForm = () => {
  const projects = useCVStore((state) => state.projects);
  const addProject = useCVStore((state) => state.addProject);
  const updateProject = useCVStore((state) => state.updateProject);
  const removeProject = useCVStore((state) => state.removeProject);

  const handleChange = (id, field) => (e) => {
    const value = e.target.value;
    updateProject(id, { [field]: value });
  };

  const handleTechnologiesChange = (id) => (e) => {
    const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
    updateProject(id, { technologies });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <p className="text-sm text-gray-600 mt-1">
          Showcase your notable projects, side work, and achievements
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No projects added yet</p>
          <Button onClick={addProject}>Add Project</Button>
        </div>
      ) : (
        <>
          {projects.map((project, index) => (
            <div key={project.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Project #{index + 1}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                >
                  Remove
                </Button>
              </div>

              <Input
                label="Project Name"
                value={project.name}
                onChange={handleChange(project.id, 'name')}
                placeholder="E-commerce Website"
                required
              />

              <Textarea
                label="Description"
                value={project.description}
                onChange={handleChange(project.id, 'description')}
                placeholder="Developed a full-stack e-commerce platform with React and Node.js..."
                rows={4}
              />

              <Input
                label="Technologies Used"
                value={project.technologies?.join(', ') || ''}
                onChange={handleTechnologiesChange(project.id)}
                placeholder="React, Node.js, MongoDB, Docker"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Start Date"
                  type="month"
                  value={project.startDate}
                  onChange={handleChange(project.id, 'startDate')}
                />

                <Input
                  label="End Date"
                  type="month"
                  value={project.endDate}
                  onChange={handleChange(project.id, 'endDate')}
                />

                <Input
                  label="Project Link"
                  type="url"
                  value={project.link}
                  onChange={handleChange(project.id, 'link')}
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>
          ))}

          <Button onClick={addProject} variant="secondary" className="w-full">
            + Add Another Project
          </Button>
        </>
      )}

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-medium text-purple-900 mb-2">💡 Project Tips</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Focus on projects that demonstrate relevant skills for your target role</li>
          <li>• Include personal projects, hackathons, open source contributions</li>
          <li>• Quantify impact when possible (users, performance improvements, etc.)</li>
          <li>• Provide working links to live demos or GitHub repositories</li>
          <li>• Highlight the technologies and methodologies used</li>
        </ul>
      </div>
    </div>
  );
};