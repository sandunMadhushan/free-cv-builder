import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCVStore } from '../../store/cvStore';

// Individual sortable section item
const SortableSection = ({ id, section }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border border-gray-200 rounded-lg p-4 mb-2
        ${isDragging ? 'shadow-lg' : 'shadow-sm'}
        hover:shadow-md transition-shadow cursor-move
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{section.label}</h3>
            {section.description && (
              <p className="text-sm text-gray-500">{section.description}</p>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          <span className="text-sm">Drag to reorder</span>
        </div>
      </div>
    </div>
  );
};

export const SectionReorder = () => {
  const sectionOrder = useCVStore((state) => state.sectionOrder);
  const activeSections = useCVStore((state) => state.activeSections);
  const updateSectionOrder = useCVStore((state) => state.updateSectionOrder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sections = [
    { id: 'personalInfo', label: 'Personal Information', description: 'Contact details and links' },
    { id: 'profile', label: 'Professional Summary', description: 'Brief career overview' },
    { id: 'experience', label: 'Work Experience', description: 'Employment history' },
    { id: 'education', label: 'Education', description: 'Academic background' },
    { id: 'skills', label: 'Skills & Competencies', description: 'Technical and soft skills' },
    { id: 'projects', label: 'Projects', description: 'Notable work and achievements' },
    { id: 'certifications', label: 'Certifications', description: 'Professional credentials' },
    { id: 'languages', label: 'Languages', description: 'Language proficiency' },
  ];

  // Filter sections to only show active ones for reordering
  const activeSectionList = sectionOrder
    .filter(sectionId => activeSections[sectionId])
    .map(sectionId => sections.find(s => s.id === sectionId))
    .filter(Boolean);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = activeSectionList.findIndex(section => section.id === active.id);
      const newIndex = activeSectionList.findIndex(section => section.id === over.id);

      // Get the current active sections in new order
      const reorderedActiveSections = arrayMove(activeSectionList, oldIndex, newIndex);

      // Create new complete order by updating just the active sections
      const newOrder = [...sectionOrder];
      const activeSectionIds = reorderedActiveSections.map(s => s.id);

      // Remove active sections from current order
      const inactiveSections = newOrder.filter(id => !activeSections[id]);

      // Create final order: reordered active sections + remaining inactive ones
      const finalOrder = [...activeSectionIds, ...inactiveSections];

      updateSectionOrder(finalOrder);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Section Order</h2>
        <p className="text-sm text-gray-600 mt-1">
          Drag and drop to reorder how sections appear in your CV
        </p>
      </div>

      {activeSectionList.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-2">No sections are currently visible</p>
          <p className="text-sm text-gray-500">Enable sections in the "Manage Sections" tab to reorder them</p>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activeSectionList.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {activeSectionList.map((section, index) => (
                  <SortableSection
                    key={section.id}
                    id={section.id}
                    section={{
                      ...section,
                      description: `${section.description} • Position ${index + 1}`
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">📋 Section Order Tips</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Personal Info:</strong> Always keep at the top</li>
              <li><strong>Summary/Profile:</strong> Great second section to hook readers</li>
              <li><strong>Experience first:</strong> For experienced professionals</li>
              <li><strong>Education first:</strong> For recent graduates or career changers</li>
              <li><strong>Skills:</strong> Can go early if very relevant to the role</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};