import React from 'react';
import { Plus, Trash2, Award } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

export const EducationSection = ({
    education,
    isEditing,
    newEducation,
    setNewEducation,
    onAddEducation,
    onRemoveEducation
}) => {
    return (
        <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award size={20} />
                Education ({education?.length || 0})
            </h3>

            {/* Education List */}
            <div className="space-y-4 mb-6">
                {education?.map((edu, index) => (
                    <div key={edu._id || index} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">{edu.degree}</h4>
                                <p className="text-slate-700 font-semibold">{edu.institution}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {edu.startDate && new Date(edu.startDate).getFullYear()} - {
                                        edu.isCurrentlyStudying ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present')
                                    }
                                </p>
                                {edu.fieldOfStudy && (
                                    <p className="text-sm text-slate-600 mt-1">Field: {edu.fieldOfStudy}</p>
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => onRemoveEducation(edu._id)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                    disabled={!edu._id}
                                    title={!edu._id ? 'Cannot delete: No ID found' : 'Delete education'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Education Form */}
            {isEditing && (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <h4 className="font-semibold text-slate-900 mb-4">Add Education</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Degree</label>
                            <input
                                type="text"
                                value={newEducation.degree}
                                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                placeholder="e.g., Bachelor of Science"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Institution</label>
                            <input
                                type="text"
                                value={newEducation.institution}
                                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                placeholder="e.g., MIT"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={newEducation.startDate}
                                onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Date {!newEducation.isCurrentlyStudying && '*'}
                            </label>
                            <input
                                type="date"
                                value={newEducation.endDate || ''}
                                onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                                disabled={newEducation.isCurrentlyStudying}
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div className="flex items-center md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newEducation.isCurrentlyStudying || false}
                                    onChange={(e) => setNewEducation({
                                        ...newEducation,
                                        isCurrentlyStudying: e.target.checked,
                                        endDate: e.target.checked ? '' : newEducation.endDate
                                    })}
                                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Currently studying here</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Field of Study</label>
                            <input
                                type="text"
                                value={newEducation.fieldOfStudy}
                                onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                                placeholder="e.g., Computer Science"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <input
                                type="text"
                                value={newEducation.description}
                                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                                placeholder="e.g., Honors, achievements"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => onAddEducation(newEducation)}
                        className={`${THEME_CLASSES.buttons.primary} px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2`}
                    >
                        <Plus size={18} />
                        Add Education
                    </button>
                </div>
            )}
        </div>
    );
};
