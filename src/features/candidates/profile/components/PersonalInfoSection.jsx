import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Building2, DollarSign, Clock, Edit3, Save, X, Loader } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';
import { toast } from 'sonner';
import { candidateService } from '../../../../services/candidateService';

export const PersonalInfoSection = ({ data, isEditing, onChange }) => {
    const [isEditingSection, setIsEditingSection] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState(data);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await candidateService.updateProfile(editedData);
            toast.success('Personal information updated successfully!');
            setIsEditingSection(false);
            // Update parent state
            Object.keys(editedData).forEach(key => {
                onChange(key, editedData[key]);
            });
        } catch (error) {
            toast.error(error.message || 'Failed to update personal information');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedData(data);
        setIsEditingSection(false);
    };

    const handleSectionChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    return (
        <div className="space-y-6">
            {/* Contact Information */}
            <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>
                    {!isEditingSection ? (
                        <button
                            onClick={() => setIsEditingSection(true)}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm font-medium"
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 flex items-center gap-2 text-sm font-medium"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Mail size={16} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={editedData.email || ''}
                            onChange={(e) => handleSectionChange('email', e.target.value)}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Phone size={16} />
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={editedData.phone || ''}
                            onChange={(e) => handleSectionChange('phone', e.target.value)}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} />
                            City
                        </label>
                        <input
                            type="text"
                            value={editedData.currentCity || ''}
                            onChange={(e) => handleSectionChange('currentCity', e.target.value)}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} />
                            Country
                        </label>
                        <input
                            type="text"
                            value={editedData.country || ''}
                            onChange={(e) => handleSectionChange('country', e.target.value)}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Linkedin size={16} />
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            value={editedData.linkedInUrl || ''}
                            onChange={(e) => handleSectionChange('linkedInUrl', e.target.value)}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Building2 size={16} />
                            Current Company
                        </label>
                        <input
                            type="text"
                            value={editedData.currentCompany || ''}
                            onChange={(e) => handleSectionChange('currentCompany', e.target.value)}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Total Experience (years)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={editedData.overallExperience || ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleSectionChange('overallExperience', v === '' ? '' : parseFloat(v));
                            }}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <DollarSign size={16} />
                            Expected Salary
                        </label>
                        <input
                            type="text"
                            value={typeof editedData.expectedSalary === 'object' ? editedData.expectedSalary.min || '' : editedData.expectedSalary || ''}
                            onChange={(e) => handleSectionChange('expectedSalary', e.target.value)}
                            disabled={!isEditingSection}
                            placeholder="e.g., 80000"
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Clock size={16} />
                            Notice Period (days)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={editedData.noticePeriod || ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleSectionChange('noticePeriod', v === '' ? '' : parseInt(v, 10));
                            }}
                            disabled={!isEditingSection}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Summary</label>
                    <textarea
                        value={editedData.experienceSummary || ''}
                        onChange={(e) => handleSectionChange('experienceSummary', e.target.value)}
                        disabled={!isEditingSection}
                        rows={4}
                        className={THEME_CLASSES.inputs}
                    />
                </div>
            </div>
        </div>
    );
};
