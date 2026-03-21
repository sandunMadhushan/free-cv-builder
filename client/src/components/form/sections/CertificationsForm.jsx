import React from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { useCVStore } from '../../../store/cvStore';

export const CertificationsForm = () => {
  const certifications = useCVStore((state) => state.certifications);
  const addCertification = useCVStore((state) => state.addCertification);
  const updateCertification = useCVStore((state) => state.updateCertification);
  const removeCertification = useCVStore((state) => state.removeCertification);

  const handleChange = (id, field) => (e) => {
    const value = e.target.value;
    updateCertification(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Certifications</h2>
        <p className="text-sm text-gray-600 mt-1">
          Add professional certifications, licenses, and credentials
        </p>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No certifications added yet</p>
          <Button onClick={addCertification}>Add Certification</Button>
        </div>
      ) : (
        <>
          {certifications.map((cert, index) => (
            <div key={cert.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Certification #{index + 1}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Certification Name"
                  value={cert.name}
                  onChange={handleChange(cert.id, 'name')}
                  placeholder="AWS Certified Solutions Architect"
                  required
                />

                <Input
                  label="Issuing Organization"
                  value={cert.issuer}
                  onChange={handleChange(cert.id, 'issuer')}
                  placeholder="Amazon Web Services"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Issue Date"
                  type="month"
                  value={cert.date}
                  onChange={handleChange(cert.id, 'date')}
                  required
                />

                <Input
                  label="Expiration Date"
                  type="month"
                  value={cert.expiryDate}
                  onChange={handleChange(cert.id, 'expiryDate')}
                  placeholder="Leave blank if no expiration"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Credential ID"
                  value={cert.credentialId}
                  onChange={handleChange(cert.id, 'credentialId')}
                  placeholder="ABC123XYZ789"
                />

                <Input
                  label="Credential URL"
                  type="url"
                  value={cert.link}
                  onChange={handleChange(cert.id, 'link')}
                  placeholder="https://www.credly.com/badges/..."
                />
              </div>
            </div>
          ))}

          <Button onClick={addCertification} variant="secondary" className="w-full">
            + Add Another Certification
          </Button>
        </>
      )}

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-900 mb-2">🏆 Certification Tips</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Include industry-relevant certifications for your field</li>
          <li>• List most recent and relevant certifications first</li>
          <li>• Include credential IDs and verification links when possible</li>
          <li>• Note expiration dates only if the certification is still valid</li>
          <li>• Popular certifications: AWS, Google Cloud, Microsoft Azure, PMP, etc.</li>
        </ul>
      </div>
    </div>
  );
};