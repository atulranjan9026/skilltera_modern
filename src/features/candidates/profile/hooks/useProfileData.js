import { useState, useEffect } from 'react';
import { candidateService } from '../../../../services/candidateService';
import { toast } from '../../../../utils/toast';

export const useProfileData = (user) => {
    const [editedData, setEditedData] = useState({});
    const [newExperience, setNewExperience] = useState({
        position: '',
        company: '',
        employmentType: 'full-time',
        startDate: '',
        endDate: '',
        isCurrentlyWorking: false,
        description: ''
    });
    const [newEducation, setNewEducation] = useState({
        degree: '', institution: '', startDate: '', endDate: '', fieldOfStudy: '', isCurrentlyStudying: false, description: ''
    });
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [skillError, setSkillError] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Load profile data from backend
    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;

            setProfileLoading(true);
            try {
                const response = await candidateService.getProfile();

                if (response?.success && response?.data) {
                    const profile = response.data;
                    setEditedData({
                        name: profile.name || user?.name,
                        email: profile.email || user?.email,
                        phone: profile.phone || user?.phone,
                        currentCity: profile.currentCity || user?.currentCity,
                        country: profile.country || user?.country,
                        avatar: profile.avatar || user?.avatar,
                        currentCompany: profile.currentCompany || user?.currentCompany,
                        overallExperience: profile.overallExperience || user?.overallExperience,
                        experienceSummary: profile.experienceSummary || user?.experienceSummary,
                        linkedInUrl: profile.linkedInUrl || user?.linkedInUrl,
                        expectedSalary: profile.expectedSalary || user?.expectedSalary || '',
                        noticePeriod: profile.noticePeriod || user?.noticePeriod,
                        skills: profile.skills?.map(skill => ({
                            ...skill,
                            skillName: skill.skillId?.name || skill.skillName || skill.name || 'Unknown Skill'
                        })) || user?.skills?.map(skill => ({
                            ...skill,
                            skillName: skill.skillId?.name || skill.skillName || 'Unknown Skill'
                        })) || [],
                        experiences: profile.experiences || user?.experiences || [],
                        education: profile.education || user?.education || []
                    });
                } else {
                    // Fallback to user context if API fails
                    setEditedData({
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                        currentCity: user?.currentCity,
                        country: user?.country,
                        currentCompany: user?.currentCompany,
                        overallExperience: user?.overallExperience,
                        experienceSummary: user?.experienceSummary,
                        linkedInUrl: user?.linkedInUrl,
                        expectedSalary: user?.expectedSalary || '',
                        noticePeriod: user?.noticePeriod,
                        skills: user?.skills?.map(skill => ({
                            ...skill,
                            skillName: skill.skillId?.name || skill.skillName || 'Unknown Skill'
                        })) || [],
                        experiences: user?.experiences || [],
                        education: user?.education || [],
                        avatar:  user?.avatar || [],
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                // Fallback to user context on error
                setEditedData({
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    currentCity: user?.currentCity,
                    country: user?.country,
                    currentCompany: user?.currentCompany,
                    overallExperience: user?.overallExperience,
                    experienceSummary: user?.experienceSummary,
                    linkedInUrl: user?.linkedInUrl,
                    expectedSalary: user?.expectedSalary || '',
                    noticePeriod: user?.noticePeriod,
                    skills: user?.skills?.map(skill => ({
                        ...skill,
                        skillName: skill.skillId?.name || skill.skillName || 'Unknown Skill'
                    })) || [],
                    experiences: user?.experiences || [],
                    education: user?.education || [],
                    avatar:  user?.avatar || [],
                });
            } finally {
                setProfileLoading(false);
            }
        };

        loadProfile();
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
                skillName: skillData.name,
                experience: skillData.experience || skillData.experienceYears, // Handle both key names
                rating: skillData.rating,
                category: skillData.category,
            };

            setEditedData(prev => ({
                ...prev,
                skills: [...(prev.skills || []), tempSkill]
            }));

            // Service now handles formatting, just pass the data
            const response = await candidateService.addSkill({
                skillId: skillData.skillId, // Ensure skillId is passed
                experience: skillData.experience || skillData.experienceYears,
                rating: skillData.rating,
                category: skillData.category,
            });

            // Backend returns { message: "success", result: [Array of skills] }
            const skillsArray = response.result || response.data || [];

            // Find our newly added skill in the returned array
            // The backend populates skillId, so we check ID match
            const createdSkill = skillsArray.find(s =>
                (s.skillId._id === skillData.skillId) ||
                (s.skillId === skillData.skillId)
            );

            if (createdSkill) {
                // Ensure data structure matches what UI expects
                const formattedSkill = {
                    ...createdSkill,
                    skillName: createdSkill.skillId?.skill || createdSkill.skillId?.name || skillData.name,
                    name: createdSkill.skillId?.skill || createdSkill.skillId?.name || skillData.name
                };

                setEditedData(prev => ({
                    ...prev,
                    skills: prev.skills.map(s => s._id === tempSkill._id ? formattedSkill : s)
                }));
            } else {
                // Fallback if not found (unexpected)
                console.warn('Newly added skill not found in response', skillsArray);
                setEditedData(prev => ({
                    ...prev,
                    skills: prev.skills.filter(s => s._id !== tempSkill._id)
                }));
                setSkillError('Failed to verify added skill');
            }
        } catch (error) {
            console.error('Error adding skill:', error);
            setSkillError(error.response?.data?.message || error.message || 'Failed to add skill');

            setEditedData(prev => ({
                ...prev,
                skills: prev.skills.filter(s => !s._id?.startsWith('temp-'))
            }));
        } finally {
            setSkillsLoading(false);
        }
    };

    const addExperience = () => {
        // Validate required fields
        if (!newExperience.position || !newExperience.company || !newExperience.startDate) {
            toast.error('Please fill in all required fields (Position, Company, and Start Date)');
            return;
        }

        // Validate endDate if not currently working
        if (!newExperience.isCurrentlyWorking && !newExperience.endDate) {
            toast.error('Please provide an End Date or check "Currently working here"');
            return;
        }

        setEditedData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { ...newExperience }]
        }));
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
            setNewEducation({
                degree: '',
                institution: '',
                startDate: '',
                endDate: '',
                fieldOfStudy: '',
                isCurrentlyStudying: false,
                description: ''
            });
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
        profileLoading,
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
