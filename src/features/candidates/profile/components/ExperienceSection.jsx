import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, Edit, X, Edit3 } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

export const ExperienceSection = ({
    experiences,
    newExperience,
    setNewExperience,
    onAddExperience,
    onRemoveExperience,
    onEditExperience
}) => {
    const [isEditingSection, setIsEditingSection] = useState(false);
    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Helper function to format duration
    const formatDuration = (exp) => {
        const start = formatDate(exp.startDate);
        const end = exp.isCurrentlyWorking ? 'Present' : formatDate(exp.endDate);
        return `${start} - ${end}`;
    };

    const handleCancelEdit = () => {
        setNewExperience({
            position: '',
            company: '',
            employmentType: 'full-time',
            startDate: '',
            endDate: '',
            isCurrentlyWorking: false,
            description: ''
        });
    };

    return (
        <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase size={20} />
                    Work Experience ({experiences?.length || 0})
                </h3>
                <button
                    onClick={() => setIsEditingSection(!isEditingSection)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm font-medium"
                >
                    <Edit3 size={16} />
                    {isEditingSection ? 'Done' : 'Edit'}
                </button>
            </div>

            {/* Experience List */}
            <div className="space-y-4 mb-6">
                {experiences?.map((exp, index) => (
                    <div key={exp._id || index} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">{exp.position}</h4>
                                <p className="text-slate-700 font-semibold">{exp.company}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {exp.duration || formatDuration(exp)}
                                    {exp.employmentType && ` • ${exp.employmentType}`}
                                </p>
                            </div>
                            {isEditingSection && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditExperience(exp)}
                                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                        title="Edit experience"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onRemoveExperience(exp._id)}
                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                        disabled={!exp._id}
                                        title={!exp._id ? 'Cannot delete: No ID found' : 'Delete experience'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-600">{exp.description}</p>
                    </div>
                ))}
            </div>

            {/* Add/Edit Experience Form */}
            {isEditingSection && (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <h4 className="font-semibold text-slate-900 mb-4">
                        {newExperience._id ? 'Edit Work Experience' : 'Add Work Experience'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Position *</label>
                            <input
                                type="text"
                                value={newExperience.position}
                                onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                                placeholder="e.g., Software Engineer"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Company *</label>
                            <input
                                type="text"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                placeholder="e.g., Tech Corp"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                            <select
                                value={newExperience.employmentType || 'full-time'}
                                onChange={(e) => setNewExperience({ ...newExperience, employmentType: e.target.value })}
                                className={THEME_CLASSES.inputs}
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                            <input
                                type="date"
                                value={newExperience.startDate || ''}
                                onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Date {!newExperience.isCurrentlyWorking && '*'}
                            </label>
                            <input
                                type="date"
                                value={newExperience.endDate || ''}
                                onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                                disabled={newExperience.isCurrentlyWorking}
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newExperience.isCurrentlyWorking || false}
                                    onChange={(e) => setNewExperience({
                                        ...newExperience,
                                        isCurrentlyWorking: e.target.checked,
                                        endDate: e.target.checked ? '' : newExperience.endDate
                                    })}
                                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Currently working here</span>
                            </label>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                value={newExperience.description}
                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                rows={3}
                                placeholder="Describe your responsibilities and achievements"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onAddExperience(newExperience)}
                            className={`${THEME_CLASSES.buttons.primary} px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2`}
                        >
                            {newExperience._id ? <Edit size={18} /> : <Plus size={18} />}
                            {newExperience._id ? 'Update Experience' : 'Add Experience'}
                        </button>
                        {newExperience._id && (
                            <button
                                onClick={handleCancelEdit}
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
    );
};
