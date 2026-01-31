import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Loader, Search, Star, Trash2, Award } from 'lucide-react';
import { candidateService } from '../../../../services/candidateService';
import { THEME_CLASSES } from '../../../../theme';

export const SkillsSection = ({
    skills = [],
    isEditing,
    onAddSkill,
    onRemoveSkill,
    skillsLoading,
    skillError
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [skillsToAdd, setSkillsToAdd] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const isInitialMount = useRef(true);

    console.log('skills', skills);
    // Search skills API (debounced)
    useEffect(() => {
        // Skip on initial render
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Skip if search term is invalid
        if (!searchTerm.trim() || searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        const searchSkills = async () => {
            setIsSearching(true);
            try {
                // Use server-side search
                const response = await candidateService.getAllActiveSkills(searchTerm);

                // Extract skills array from response
                let allSkills = [];
                if (response?.data?.data?.skills) {
                    allSkills = response.data.data.skills;
                } else if (response?.data?.skills) {
                    allSkills = response.data.skills;
                } else if (response?.data) {
                    allSkills = Array.isArray(response.data) ? response.data : [];
                } else if (Array.isArray(response)) {
                    allSkills = response;
                }

                // Map skills to consistent format and filter if needed (though server should have filtered)
                // We still safeguard against duplicates or malformed data
                const processedSkills = allSkills.map(s => ({
                    ...s,
                    skill: s.name || s.skill || '', // Ensure skill exists (use name as primary)
                    name: s.name || s.skill || '' // Ensure name exists
                })).filter(s => s.skill); // Filter out empty names

                setSearchResults(processedSkills.slice(0, 5));
            } catch (error) {
                console.error('Error searching skills:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchSkills, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    // Add skill to temporary list
    const handleSelectSkill = (skill) => {
        const skillName = skill.skill || skill.name;
        const skillId = skill._id;

        // Check if already exists in current skills or skills to add
        const alreadyInCurrent = skills.some(s =>
            s.skillId === skillId ||
            (s.skillId?._id === skillId) ||
            (s.skillName === skillName)
        );
        const alreadyInToAdd = skillsToAdd.some(s => s.skillId === skillId);

        if (alreadyInCurrent || alreadyInToAdd) {
            setErrorMsg(`${skillName} is already added!`);
            setTimeout(() => setErrorMsg(''), 3000);
            return;
        }

        // Add to temporary list
        setSkillsToAdd([...skillsToAdd, {
            skillId: skillId,
            skill: skillName,
            skillName: skillName,
            category: skill.category || 'technical',
            experience: 0,
            rating: 0
        }]);

        // Clear search
        setSearchTerm('');
        setSearchResults([]);
    };

    // Update experience for a skill in temporary list
    const handleChangeExp = (e, index) => {
        const value = parseFloat(e.target.value) || 0;
        const updated = [...skillsToAdd];
        updated[index].experience = value;
        setSkillsToAdd(updated);
    };

    // Update rating for a skill in temporary list
    const handleRating = (rating, index) => {
        const updated = [...skillsToAdd];
        updated[index].rating = rating;
        setSkillsToAdd(updated);
    };

    // Remove skill from temporary list
    const handleRemoveItem = (skillId) => {
        setSkillsToAdd(skillsToAdd.filter(s => s.skillId !== skillId));
    };

    // Save all skills to backend
    const saveSkills = async () => {
        setIsSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // Validate that all skills have experience and rating
            const invalid = skillsToAdd.filter(s => !s.experience || !s.rating);
            if (invalid.length > 0) {
                setErrorMsg('Please add experience and rating for all skills');
                setIsSaving(false);
                return;
            }

            // Add each skill through parent callback
            for (const skill of skillsToAdd) {
                await onAddSkill({
                    name: skill.skillName,
                    experienceYears: skill.experience,
                    rating: skill.rating,
                    category: skill.category
                });
            }

            // Clear temporary list
            setSkillsToAdd([]);
            setSuccessMsg('Skills added successfully! ✅');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Error saving skills:', error);
            setErrorMsg('Failed to save skills. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Remove existing skill
    const handleRemoveExistingSkill = async (index) => {
        try {
            await onRemoveSkill(index);
            setSuccessMsg('Skill removed successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Error removing skill:', error);
            setErrorMsg('Failed to remove skill.');
        }
    };

    return (
        <div className={`${THEME_CLASSES.cards} rounded-2xl shadow-lg`}>
            <div className="p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Award size={24} className="text-primary-600" />
                        Skills ({skills?.length || 0})
                    </h3>
                </div>

                {/* Show skills when NOT editing */}
                {/* {!isEditing || ( */}
                    <div className="mb-6">
                        {skills && skills.length > 0 ? (
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Your Skills ({skills.length})
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill, index) => {
                                        const skillName = skill.skillName || skill.skill || skill.skillId?.name || skill.name || 'Unknown Skill';
                                       
                                        return (
                                            <div
                                                key={index}
                                                className="px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 text-primary-700 rounded-full font-medium flex items-center gap-2"
                                            >
                                                <span className="font-semibold">{skillName}</span>
                                                {skill.experience > 0 && (
                                                    <span className="text-xs bg-primary-200 px-2 py-0.5 rounded-full">
                                                        {skill.experience}y
                                                    </span>
                                                )}
                                                {skill.rating > 0 && (
                                                    <span className="text-xs bg-primary-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        ⭐ {skill.rating}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-500">
                                    No skills added yet. Click 'Edit Profile' to add your first skill!
                                </p>
                            </div>
                        )}
                    </div>
                {/* )} */}

                {/* Error from parent */}
                {skillError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {skillError}
                    </div>
                )}

                {/* Add Skills Section - Only shown when editing */}
                {isEditing && (
                    <div className="border-t border-slate-200 pt-8">
                        <h4 className="text-lg font-bold text-slate-900 mb-4">Search & Add Skills</h4>

                        {/* Search Box */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search a skill... (e.g., React, Python, AWS)"
                                    className={`${THEME_CLASSES.inputs} pl-11`}
                                    disabled={skillsLoading}
                                />
                                {isSearching && (
                                    <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 animate-spin" size={20} />
                                )}
                            </div>

                            {/* Search Results Dropdown - ONLY SHOWN WHEN SEARCHING */}
                            {searchTerm.length >= 2 && (
                                <div className="mt-2">
                                    {searchResults.length > 0 ? (
                                        <div className="bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                            {searchResults.map((skill) => {
                                                const skillName = skill.skill || skill.name;
                                                return (
                                                    <button
                                                        key={skill._id}
                                                        onClick={() => handleSelectSkill(skill)}
                                                        className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-slate-100 last:border-b-0 flex justify-between items-center group"
                                                    >
                                                        <div>
                                                            <div className="font-semibold text-slate-900 group-hover:text-primary-600">
                                                                {skillName}
                                                            </div>
                                                            {skill.category && (
                                                                <div className="text-xs text-slate-500 mt-0.5">{skill.category}</div>
                                                            )}
                                                        </div>
                                                        <Plus size={18} className="text-slate-400 group-hover:text-primary-600" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : !isSearching ? (
                                        <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 text-center">
                                            No skills found matching "{searchTerm}"
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {searchTerm.length > 0 && searchTerm.length < 2 && (
                                <div className="text-sm text-slate-500 mt-2">
                                    Please type at least 2 characters to search
                                </div>
                            )}
                        </div>

                        {/* Skills to Add List */}
                        {skillsToAdd.length > 0 && (
                            <div className="space-y-4 mb-6">
                                <h5 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Skills to Add ({skillsToAdd.length})
                                </h5>

                                {skillsToAdd.map((skill, index) => (
                                    <div
                                        key={skill.skillId}
                                        className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h6 className="font-bold text-lg text-primary-900">{skill.skill}</h6>
                                                <span className="text-xs text-primary-600 bg-primary-200 px-2 py-1 rounded-full mt-1 inline-block">
                                                    {skill.category}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(skill.skillId)}
                                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Experience Input */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Experience (years)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    step="0.5"
                                                    value={skill.experience || ''}
                                                    onChange={(e) => handleChangeExp(e, index)}
                                                    placeholder="e.g., 2.5"
                                                    className={THEME_CLASSES.inputs}
                                                />
                                            </div>

                                            {/* Rating Input */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Rating (1-5)
                                                </label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((rating) => (
                                                        <button
                                                            key={rating}
                                                            type="button"
                                                            onClick={() => handleRating(rating, index)}
                                                            className="transition-all hover:scale-110"
                                                        >
                                                            <Star
                                                                size={28}
                                                                className={
                                                                    rating <= (skill.rating || 0)
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-slate-300 hover:text-yellow-200'
                                                                }
                                                            />
                                                        </button>
                                                    ))}
                                                    <span className="ml-2 text-lg font-bold text-slate-700 flex items-center">
                                                        {skill.rating || 0}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Save Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={saveSkills}
                                        disabled={isSaving || skillsLoading}
                                        className={`${THEME_CLASSES.buttons.primary} px-8 py-3 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                                    >
                                        {isSaving || skillsLoading ? (
                                            <>
                                                <Loader size={20} className="animate-spin" />
                                                Saving Skills...
                                            </>
                                        ) : (
                                            <>Save {skillsToAdd.length} Skill{skillsToAdd.length !== 1 ? 's' : ''}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {errorMsg && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-center">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold text-center">
                                {successMsg}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};