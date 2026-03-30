import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Upload, 
    Loader, 
    ExternalLink, 
    Trash2, 
    Clock, 
    Share2, 
    Download,
    History,
    AlertCircle
} from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';
import { useAuthContext } from '../../../../store/context/AuthContext';
import { toast } from 'sonner';
import resumeUploadService from '../../../../services/resumeUploadService';

export const EnhancedResumeSection = ({ onResumeUpdate }) => {
    const { user, refreshUser } = useAuthContext();
    const [currentResume, setCurrentResume] = useState(null);
    const [resumeHistory, setResumeHistory] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load current resume and history on mount
    useEffect(() => {
        loadResumeData();
    }, []);

    const loadResumeData = async () => {
        try {
            setLoading(true);
            const [current, history] = await Promise.all([
                resumeUploadService.getCurrentResume(),
                resumeUploadService.getResumeHistory()
            ]);
            
            setCurrentResume(current);
            setResumeHistory(history);
        } catch (error) {
            console.error('Failed to load resume data:', error);
            toast.error('Failed to load resume data');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file using service
        const validation = resumeUploadService.validateResumeFile(file);
        if (!validation.isValid) {
            validation.errors.forEach(error => toast.error(error));
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        try {
            const uploadResponse = await resumeUploadService.uploadResume(file, (progress) => {
                setUploadProgress(Math.round(progress));
            });

            // Use response data directly instead of refetching
            const newResume = {
                resumeId: uploadResponse.data.resumeId,
                resumeName: uploadResponse.data.resumeName,
                resumeType: uploadResponse.data.resumeType,
                formattedSize: uploadResponse.data.resumeSize,
                uploadedAt: uploadResponse.data.uploadedAt,
                version: uploadResponse.data.version,
                resumePath: uploadResponse.data.resumeLink
            };

            setCurrentResume(newResume);
            
            // Optional: Fetch history separately if you need version tracking
            try {
                const history = await resumeUploadService.getResumeHistory();
                setResumeHistory(history);
            } catch (historyError) {
                console.error('Failed to fetch resume history:', historyError);
                // Continue without history - not critical
            }

            onResumeUpdate?.();
            toast.success('Resume uploaded successfully!');
        } catch (error) {
            setUploadError(error.message);
            toast.error(error.message);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            e.target.value = '';
        }
    };

    const handleDeleteClick = () => {
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            toast(
                'Resume will be deleted permanently',
                {
                    description: 'Click Delete button again to confirm',
                    duration: 5000,
                }
            );
            return;
        }
        handleDelete();
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setConfirmingDelete(false);
        setUploadError(null);

        try {
            await resumeUploadService.deleteResume();
            await refreshUser();
            await loadResumeData();
            onResumeUpdate?.();
            toast.success('Resume deleted successfully!');
        } catch (error) {
            setUploadError(error.message);
            toast.error(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleViewResume = async () => {
        if (!currentResume) return;

        try {
            const url = await resumeUploadService.getResumeUrl(currentResume.resumeId);
            resumeUploadService.previewResume(url);
        } catch (error) {
            toast.error('Failed to generate resume URL');
        }
    };

    const handleDownloadResume = async () => {
        if (!currentResume) return;

        try {
            const url = await resumeUploadService.getResumeUrl(currentResume.resumeId);
            await resumeUploadService.downloadResume(url, currentResume.resumeName);
        } catch (error) {
            toast.error('Failed to download resume');
        }
    };

    const handleShareResume = async () => {
        if (!currentResume) return;

        try {
            const shareData = await resumeUploadService.generateShareToken(currentResume.resumeId);
            
            // Copy share link to clipboard
            const shareUrl = `${window.location.origin}/shared-resume/${currentResume.resumeId}/${shareData.shareToken}`;
            await navigator.clipboard.writeText(shareUrl);
            
            toast.success('Share link copied to clipboard!', {
                description: `Link expires in 24 hours`
            });
        } catch (error) {
            toast.error('Failed to generate share link');
        }
    };

    const getFileTypeIcon = (mimeType) => {
        return <FileText className="text-primary-500" size={24} />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                    <div className="flex items-center justify-center py-8">
                        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={20} />
                        Resume / CV
                    </h3>
                    
                    {resumeHistory.length > 1 && (
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <History size={16} />
                            {showHistory ? 'Hide' : 'Show'} History ({resumeHistory.length})
                        </button>
                    )}
                </div>

                {currentResume ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                {getFileTypeIcon(currentResume.resumeType)}
                                <div>
                                    <p className="font-medium text-slate-900">{currentResume.resumeName}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span>{currentResume.formattedSize}</span>
                                        <span>Version {currentResume.version}</span>
                                        <span>Uploaded {formatDate(currentResume.uploadedAt)}</span>
                                        {currentResume.downloadCount > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Download size={12} />
                                                {currentResume.downloadCount} downloads
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={handleViewResume}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <ExternalLink size={16} />
                                    View
                                </button>
                                
                                {/* <button
                                    onClick={handleDownloadResume}
                                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <Download size={16} />
                                    Download
                                </button> */}
                                
                                {/* <button
                                    onClick={handleShareResume}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <Share2 size={16} />
                                    Share
                                </button> */}
                                
                                <button
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50 transition-colors ${
                                        confirmingDelete
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    {isDeleting ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    {confirmingDelete ? 'Confirm Delete' : 'Delete'}
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-600">Upload a new file to replace your current resume.</p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-600 mb-2">No resume uploaded yet</p>
                        <p className="text-sm text-slate-500">Add your resume to improve your job matches and complete your profile</p>
                    </div>
                )}

                {/* Upload Section */}
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume</label>
                    <div className="flex items-center gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            isUploading 
                                ? 'border-slate-200 bg-slate-50' 
                                : 'border-primary-300 hover:border-primary-500 hover:bg-primary-50'
                        }`}>
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
                                    <div className="text-left">
                                        <span className="text-sm font-medium text-slate-600 block">Uploading...</span>
                                        <div className="w-32 bg-slate-200 rounded-full h-1.5 mt-1">
                                            <div 
                                                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} className="text-primary-500" />
                                    <span className="text-sm font-medium text-slate-700">
                                        Choose file (PDF, DOC, DOCX - Max 2MB)
                                    </span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                {uploadError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-500 mt-0.5" />
                        <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                )}

                {/* Resume History */}
                {showHistory && resumeHistory.length > 1 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Resume History</h4>
                        <div className="space-y-2">
                            {resumeHistory.map((resume) => (
                                <div 
                                    key={resume.resumeId} 
                                    className={`flex items-center justify-between p-3 rounded-lg ${
                                        resume.status === 'active' ? 'bg-primary-50 border border-primary-200' : 'bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {getFileTypeIcon(resume.resumeType)}
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{resume.resumeName}</p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span>Version {resume.version}</span>
                                                <span>{formatDate(resume.uploadedAt)}</span>
                                                <span className={`px-1.5 py-0.5 rounded text-xs ${
                                                    resume.status === 'active' 
                                                        ? 'bg-primary-100 text-primary-700' 
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {resume.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">{resume.formattedSize}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
