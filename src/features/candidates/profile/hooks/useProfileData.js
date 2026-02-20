import { useState, useEffect } from 'react';
import { candidateService } from '../../../../services/candidateService';

export const useProfileData = () => {
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
    const [newCertificate, setNewCertificate] = useState({
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        skills: '',
    });
    const [profileLoading, setProfileLoading] = useState(false);

    console.log('editedData', editedData);

    useEffect(() => {
        const loadProfile = async () => {
            setProfileLoading(true);
            try {
                const response = await candidateService.getProfile();

                if (response?.success && response?.data) {
                    const profile = response.data;
                    console.log('profile', profile);
                    setEditedData({
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        currentCity: profile.currentCity,
                        country: profile.country,
                        avatar: profile.avatar,
                        linkedInUrl: profile.linkedInUrl,
                        currentCompany: profile.currentCompany || profile.currentRole,
                        overallExperience: profile.overallExperience ?? '',
                        experienceSummary: profile.experienceSummary,
                        expectedSalary: profile.expectedSalary || '',
                        noticePeriod: profile.noticePeriod,
                        skills: profile.skills?.map(skill => ({
                            ...skill,
                            skillName: skill.skillId?.name || skill.skillName || skill.name || 'Unknown Skill'
                        })) || [],
                        experiences: profile.experiences || [],
                        education: profile.education || [],
                        certificates: profile.certificates || [],
                        resume: profile.resume || null,
                        profileStrength: profile.profileStrength || 0,
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setProfileLoading(false);
            }
        };

        loadProfile();
    }, []);

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
        newCertificate,
        setNewCertificate,
    };
};