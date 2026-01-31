import { useState, useEffect } from 'react';
import { candidateService } from '../../../../services/candidateService';

export const useProfileData = (user) => {
    const [editedData, setEditedData] = useState({});
    const [newExperience, setNewExperience] = useState({
        position: '', company: '', duration: '', description: ''
    });
    const [newEducation, setNewEducation] = useState({
        degree: '', school: '', year: '', fieldOfStudy: ''
    });
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [skillError, setSkillError] = useState(null);

    // Initialize edited data with user data
    useEffect(() => {
        setEditedData({
            fullname: user?.fullname,
            email: user?.email,
            phone: user?.phone,
            currentCity: user?.currentCity,
            country: user?.country,
            currentCompany: user?.currentCompany,
            overallExperience: user?.overallExperience,
            experienceSummary: user?.experienceSummary,
            linkedInUrl: user?.linkedInUrl,
            expectedSalary: user?.expectedSalary?.amount || '',
            noticePeriod: user?.noticePeriod,
            skills: user?.skills?.map(skill => ({
                ...skill,
                skillName: skill.skillId?.name || skill.skillName || 'Unknown Skill'
            })) || [],
            experiences: user?.experiences || [],
            education: user?.education || []
        });
    }, [user]);

    // Skills are now loaded on-demand via search in SkillsSection component
    // No need to fetch all skills on mount

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addSkill = async (skillData) => {
        if (!skillData.name.trim()) {
            setSkillError('Skill name is required');
            return;
        }

        const isDuplicate = editedData.skills?.some(
            skill => skill.skillName?.toLowerCase() === skillData.name.toLowerCase() ||
                skill.name?.toLowerCase() === skillData.name.toLowerCase()
        );

        if (isDuplicate) {
            setSkillError(`Skill "${skillData.name}" already exists in your profile`);
            return;
        }

        setSkillsLoading(true);
        setSkillError(null);

        try {
            const tempSkill = {
                _id: `temp-${Date.now()}`,
                name: skillData.name,
                experienceYears: skillData.experienceYears,
                rating: skillData.rating,
                category: skillData.category,
            };

            setEditedData(prev => ({
                ...prev,
                skills: [...(prev.skills || []), tempSkill]
            }));

            const response = await candidateService.addSkill({
                name: skillData.name,
                experienceYears: skillData.experienceYears,
                rating: skillData.rating,
                category: skillData.category,
            });

            const createdSkill = response?.data || response;

            setEditedData(prev => ({
                ...prev,
                skills: prev.skills.map(s => s._id === tempSkill._id ? createdSkill : s)
            }));
        } catch (error) {
            console.error('Error adding skill:', error);
            setSkillError(error.response?.data?.message || 'Failed to add skill');

            setEditedData(prev => ({
                ...prev,
                skills: prev.skills.filter(s => !s._id?.startsWith('temp-'))
            }));
        } finally {
            setSkillsLoading(false);
        }
    };

    const addExperience = () => {
        if (newExperience.position && newExperience.company) {
            setEditedData(prev => ({
                ...prev,
                experiences: [...prev.experiences, { ...newExperience }]
            }));
            setNewExperience({ position: '', company: '', duration: '', description: '' });
        }
    };

    const removeExperience = (index) => {
        setEditedData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index)
        }));
    };

    const addEducation = () => {
        if (newEducation.degree && newEducation.school) {
            setEditedData(prev => ({
                ...prev,
                education: [...prev.education, { ...newEducation }]
            }));
            setNewEducation({ degree: '', school: '', year: '', fieldOfStudy: '' });
        }
    };

    const removeEducation = (index) => {
        setEditedData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    return {
        editedData,
        setEditedData,
        handleInputChange,
        // Skills
        addSkill,
        skillsLoading,
        skillError,
        // Experience
        newExperience,
        setNewExperience,
        addExperience,
        removeExperience,
        // Education
        newEducation,
        setNewEducation,
        addEducation,
        removeEducation,
    };
};
