import React from 'react'
import { Plus, Trash2, Award, Link as LinkIcon, Calendar, Edit, X } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

export const CertificatesSection = ({
    certificates = [],
    isEditing,
    onRemoveCertificate,
    newCertificate,
    setNewCertificate,
    onAddCertificate,
    onEditCertificate
}) => {
    return (
        <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award size={20} />
                Certificates ({certificates?.length || 0})
            </h3>

            {/* Certificates List */}
            <div className="space-y-4 mb-6">
                {certificates?.map((certificate, index) => (
                    <div key={certificate._id || index} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-primary-900">{certificate.name}</h4>
                                {certificate.issuingOrganization && (
                                    <p className="text-sm text-slate-600 mt-1">{certificate.issuingOrganization}</p>
                                )}
                                <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    {certificate.issueDate && (
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar size={12} />
                                            Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    {certificate.expiryDate && (
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar size={12} />
                                            Expires: {new Date(certificate.expiryDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    {certificate.credentialUrl && (
                                        <a
                                            href={certificate.credentialUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 underline"
                                        >
                                            <LinkIcon size={12} />
                                            Credential
                                        </a>
                                    )}
                                </div>
                            </div>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditCertificate?.(certificate)}
                                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                        title="Edit certificate"
                                        disabled={!onEditCertificate}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onRemoveCertificate?.(certificate._id)}
                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                        title="Remove"
                                        disabled={!certificate._id || !onRemoveCertificate}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {certificate.description && (
                            <p className="text-sm text-slate-600">{certificate.description}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Add/Edit Certificate Form */}
            {isEditing && (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <h4 className="font-semibold text-slate-900 mb-4">
                        {newCertificate?._id ? 'Edit Certificate' : 'Add Certificate'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Name *</label>
                            <input
                                type="text"
                                value={newCertificate?.name || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, name: e.target.value })}
                                placeholder="e.g., AWS Solutions Architect"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Issuing Organization *</label>
                            <input
                                type="text"
                                value={newCertificate?.issuingOrganization || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, issuingOrganization: e.target.value })}
                                placeholder="e.g., Amazon Web Services"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date *</label>
                            <input
                                type="date"
                                value={newCertificate?.issueDate || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, issueDate: e.target.value })}
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                            <input
                                type="date"
                                value={newCertificate?.expiryDate || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, expiryDate: e.target.value })}
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Credential ID</label>
                            <input
                                type="text"
                                value={newCertificate?.credentialId || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, credentialId: e.target.value })}
                                placeholder="Optional"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Credential URL</label>
                            <input
                                type="url"
                                value={newCertificate?.credentialUrl || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, credentialUrl: e.target.value })}
                                placeholder="https://..."
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                value={newCertificate?.description || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, description: e.target.value })}
                                rows={3}
                                placeholder="Optional details"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Skills (comma-separated)</label>
                            <input
                                type="text"
                                value={newCertificate?.skills || ''}
                                onChange={(e) => setNewCertificate?.({ ...newCertificate, skills: e.target.value })}
                                placeholder="e.g., AWS, Cloud, Security"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onAddCertificate?.(newCertificate)}
                            className={`${THEME_CLASSES.buttons.primary} px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2`}
                            disabled={!onAddCertificate}
                        >
                            {newCertificate?._id ? <Edit size={18} /> : <Plus size={18} />}
                            {newCertificate?._id ? 'Update Certificate' : 'Add Certificate'}
                        </button>
                        {newCertificate?._id && (
                            <button
                                onClick={() => setNewCertificate?.({
                                    name: '',
                                    issuingOrganization: '',
                                    issueDate: '',
                                    expiryDate: '',
                                    credentialId: '',
                                    credentialUrl: '',
                                    description: '',
                                    skills: '',
                                })}
                                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all flex items-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}