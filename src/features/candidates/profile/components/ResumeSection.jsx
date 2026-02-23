import React, { useState } from 'react';
import { FileText, Upload, Loader, ExternalLink, Trash2 } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';
import { candidateService } from '../../../../services/candidateService';
import { useAuthContext } from '../../../../store/context/AuthContext';
import { toast } from 'sonner';

export const ResumeSection = ({ resume, onResumeUpdate }) => {
    const { refreshUser } = useAuthContext();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const hasResume = resume?.url;
    
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a PDF or Word document.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        try {
            await candidateService.uploadResume(file);
            await refreshUser();
            onResumeUpdate?.();
            toast.success('Resume uploaded successfully!');
        } catch (error) {
            setUploadError(error.response?.data?.message || 'Failed to upload resume.');
            toast.error(error.response?.data?.message || 'Failed to upload resume.');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete your resume?')) return;
        setIsDeleting(true);
        setUploadError(null);
        try {
            await candidateService.deleteResume();
            await refreshUser();
            onResumeUpdate?.();
            toast.success('Resume deleted successfully!');
        } catch (error) {
            setUploadError(error.response?.data?.message || 'Failed to delete resume.');
            toast.error(error.response?.data?.message || 'Failed to delete resume.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FileText size={20} />
                    Resume / CV
                </h3>

                {hasResume ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileText className="text-primary-500" size={24} />
                                <div>
                                    <p className="font-medium text-slate-900">{resume.filename || 'Resume'}</p>
                                    <p className="text-sm text-slate-500">Uploaded {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : ''}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={resume.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm font-medium"
                                >
                                    <ExternalLink size={16} />
                                    View
                                </a>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Delete
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">Upload a new file to replace your current resume.</p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-600 mb-4">No resume uploaded yet. Add your resume to improve your job matches.</p>
                    </div>
                )}

                <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume</label>
                    <div className="flex items-center gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploading ? 'border-slate-200 bg-slate-50' : 'border-primary-300 hover:border-primary-500 hover:bg-primary-50'}`}>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="hidden"
                            />
                            {isUploading ? (
                                <>
                                    <Loader size={20} className="animate-spin text-primary-500" />
                                    <span className="text-sm font-medium text-slate-600">Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} className="text-primary-500" />
                                    <span className="text-sm font-medium text-slate-700">Choose file (PDF, DOC - Max 2MB)</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
            </div>
        </div>
    );
};
