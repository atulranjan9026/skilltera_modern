import React from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

export const ExperienceSection = ({
    experiences,
    isEditing,
    newExperience,
    setNewExperience,
    onAddExperience,
    onRemoveExperience
}) => {
    return (
        <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase size={20} />
                Work Experience ({experiences?.length || 0})
            </h3>

            {/* Experience List */}
            <div className="space-y-4 mb-6">
                {experiences?.map((exp, index) => (
                    <div key={index} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">{exp.position}</h4>
                                <p className="text-slate-700 font-semibold">{exp.company}</p>
                                <p className="text-sm text-slate-500 mt-1">{exp.duration}</p>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => onRemoveExperience(index)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <p className="text-slate-600">{exp.description}</p>
                    </div>
                ))}
            </div>

            {/* Add Experience Form */}
            {isEditing && (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <h4 className="font-semibold text-slate-900 mb-4">Add Work Experience</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                            <input
                                type="text"
                                value={newExperience.position}
                                onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                                placeholder="e.g., Software Engineer"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                            <input
                                type="text"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                placeholder="e.g., Tech Corp"
                                className={THEME_CLASSES.inputs}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                            <input
                                type="text"
                                value={newExperience.duration}
                                onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                                placeholder="e.g., Jan 2020 - Present"
                                className={THEME_CLASSES.inputs}
                            />
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
                    <button
                        onClick={onAddExperience}
                        className={`${THEME_CLASSES.buttons.primary} px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2`}
                    >
                        <Plus size={18} />
                        Add Experience
                    </button>
                </div>
            )}
        </div>
    );
};
