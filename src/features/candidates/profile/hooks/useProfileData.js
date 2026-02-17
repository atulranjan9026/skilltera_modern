import { useState, useEffect } from 'react';
import { candidateService } from '../../../../services/candidateService';

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
                        linkedInUrl: profile.linkedInUrl || user?.linkedInUrl,
                        currentCompany: profile.currentCompany || profile.currentRole || user?.currentCompany,
                        overallExperience: profile.overallExperience ?? user?.overallExperience ?? user?.experience ?? '',
                        experienceSummary: profile.experienceSummary || user?.experienceSummary,
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
                        avatar:  user?.avatar || [],
                        linkedInUrl: user?.linkedInUrl,
                        currentCompany: user?.currentCompany,
                        overallExperience: user?.overallExperience ?? user?.experience ?? '',
                        experienceSummary: user?.experienceSummary,
                        expectedSalary: user?.expectedSalary || '',
                        noticePeriod: user?.noticePeriod,
                        skills: user?.skills?.map(skill => ({
                            ...skill,
                            skillName: skill.skillId?.name || skill.skillName || 'Unknown Skill'
                        })) || [],
                        experiences: user?.experiences || [],
                        education: user?.education || [],
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
                    avatar:  user?.avatar || [],
                    linkedInUrl: user?.linkedInUrl,
                    currentCompany: user?.currentCompany,
                    overallExperience: user?.overallExperience ?? user?.experience ?? '',
                    experienceSummary: user?.experienceSummary,
                    expectedSalary: user?.expectedSalary || '',
                    noticePeriod: user?.noticePeriod,
                    skills: user?.skills?.map(skill => ({
                        ...skill,
                        skillName: skill.skillId?.name || skill.skillName || 'Unknown Skill'
                    })) || [],
                    experiences: user?.experiences || [],
                    education: user?.education || [],
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

    return {
        editedData,
        setEditedData,
        handleInputChange,
        profileLoading,
        newExperience,
        setNewExperience,
        newEducation,
        setNewEducation,
    };
};
