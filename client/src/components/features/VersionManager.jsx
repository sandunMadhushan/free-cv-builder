import React, { useState } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useCVStore } from "../../store/cvStore";
import { useVersionStore } from "../../store/versionStore";

export const VersionManager = () => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newVersionName, setNewVersionName] = useState("");
  const [selectedVersionForRename, setSelectedVersionForRename] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const cvData = useCVStore();
  const {
    versions,
    currentVersionId,
    saveVersion,
    updateVersion,
    deleteVersion,
    renameVersion,
    setCurrentVersion,
    getSortedVersions,
    duplicateVersion,
  } = useVersionStore();

  const { loadCV } = useCVStore();

  // Get sorted and filtered versions
  const sortedVersions = getSortedVersions().filter((version) =>
    version.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSaveVersion = () => {
    const name =
      newVersionName.trim() || `CV - ${new Date().toLocaleDateString()}`;
    const versionId = saveVersion(cvData, name);
    setShowSaveModal(false);
    setNewVersionName("");
  };

  const handleLoadVersion = (version) => {
    if (
      window.confirm(
        `Load "${version.name}"? This will replace your current work.`,
      )
    ) {
      loadCV(version.data);
      setCurrentVersion(version.id);
    }
  };

  const handleDeleteVersion = (version) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${version.name}"? This cannot be undone.`,
      )
    ) {
      deleteVersion(version.id);
    }
  };

  const handleRenameVersion = () => {
    if (selectedVersionForRename && newVersionName.trim()) {
      renameVersion(selectedVersionForRename.id, newVersionName.trim());
      setShowRenameModal(false);
      setSelectedVersionForRename(null);
      setNewVersionName("");
    }
  };

  const handleDuplicateVersion = (version) => {
    duplicateVersion(version.id);
  };

  const startRename = (version) => {
    setSelectedVersionForRename(version);
    setNewVersionName(version.name);
    setShowRenameModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVersionStats = (version) => {
    const data = version.data;
    const stats = [];

    if (data.experience?.length) stats.push(`${data.experience.length} jobs`);
    if (data.education?.length) stats.push(`${data.education.length} degrees`);
    if (data.projects?.length) stats.push(`${data.projects.length} projects`);
    if (data.certifications?.length)
      stats.push(`${data.certifications.length} certs`);

    return stats.join(" • ") || "Basic info only";
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Version Management
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Save, load, and manage multiple versions of your CV
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => setShowSaveModal(true)} className="flex-1">
          Save Current Version
        </Button>
        <Input
          placeholder="Search versions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Versions List */}
      {sortedVersions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="space-y-3">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14.5"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              No saved versions
            </h3>
            <p className="text-gray-600">
              Save your first CV version to get started
            </p>
            <Button onClick={() => setShowSaveModal(true)}>
              Save Current CV
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedVersions.map((version) => (
            <div
              key={version.id}
              className={`border rounded-lg p-4 transition-all ${
                currentVersionId === version.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {version.name}
                    </h3>
                    {currentVersionId === version.id && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {getVersionStats(version)}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Created: {formatDate(version.createdAt)}</span>
                    {version.updatedAt !== version.createdAt && (
                      <span>Updated: {formatDate(version.updatedAt)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadVersion(version)}
                    disabled={currentVersionId === version.id}
                  >
                    Load
                  </Button>

                  <div className="relative group">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01"
                        />
                      </svg>
                    </button>

                    <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <button
                          onClick={() => startRename(version)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDuplicateVersion(version)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteVersion(version)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Version Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Save CV Version
            </h3>

            <Input
              label="Version Name"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              placeholder={`CV - ${new Date().toLocaleDateString()}`}
              className="mb-4"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveModal(false);
                  setNewVersionName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveVersion} className="flex-1">
                Save Version
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedVersionForRename && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rename Version
            </h3>

            <Input
              label="Version Name"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              placeholder="Enter new name"
              className="mb-4"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedVersionForRename(null);
                  setNewVersionName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleRenameVersion} className="flex-1">
                Rename
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Version Management Tips */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-medium text-purple-900 mb-2">
          💡 Version Management Tips
        </h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Save versions before making major changes</li>
          <li>
            • Use descriptive names like "Software Engineer Role" or "Creative
            Director Position"
          </li>
          <li>
            • Duplicate and modify versions for different job applications
          </li>
          <li>• The "Current" version is automatically saved as you work</li>
        </ul>
      </div>
    </div>
  );
};
