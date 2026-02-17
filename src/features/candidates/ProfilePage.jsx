import React, { useState } from 'react';
import { Edit3, Save, X, Loader, User } from 'lucide-react';
import { useAuthContext } from '../../store/context/AuthContext';
import { THEME_CLASSES } from '../../theme';
import { toast } from '../../utils/toast';
import { useProfileData } from './profile/hooks/useProfileData';
import { SkillsSection } from './profile/components/SkillsSection';
import { ExperienceSection } from './profile/components/ExperienceSection';
import { EducationSection } from './profile/components/EducationSection';
import { PersonalInfoSection } from './profile/components/PersonalInfoSection';
import { ResumeSection } from './profile/components/ResumeSection';
import { candidateService } from '../../services/candidateService';

export default function ProfileEditor() {
  const { user, isLoading } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    editedData,
    handleInputChange,
    profileLoading,
    newExperience,
    setNewExperience,
    newEducation,
    setNewEducation,
  } = useProfileData(user);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center p-8">Please log in to view your profile.</div>;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...editedData };

      // Avoid sending empty-string values (backend normalizes expectedSalary and strips unknown fields)
      if (typeof payload.expectedSalary === 'string' && !payload.expectedSalary.trim()) delete payload.expectedSalary;
      if (payload.overallExperience === '') delete payload.overallExperience;
      if (payload.noticePeriod === '') delete payload.noticePeriod;

      // Save profile to backend
      const response = await candidateService.updateProfile(payload);

      if (response?.success) {
        setIsEditing(false);
        toast.success('Profile saved successfully!');
      } else {
        throw new Error(response?.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'resume', label: 'Resume', icon: User },
    { id: 'skills', label: 'Skills', icon: User },
    { id: 'experience', label: 'Experience', icon: User },
    { id: 'education', label: 'Education', icon: User },
  ];

  const needsResume = !user?.resume?.url;
  const isGoogleUser = user?.authProvider === 'google';


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Complete profile banner for users without resume (especially Google sign-ups) */}
        {needsResume && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <p className="text-amber-800 text-sm font-medium">
              {isGoogleUser ? 'Welcome! Add your resume to get better job matches.' : 'Complete your profile by adding your resume.'}
            </p>
            <button
              onClick={() => setActiveTab('resume')}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
            >
              Add Resume
            </button>
          </div>
        )}

        {/* Header */}
        <div className={`${THEME_CLASSES.cards} p-8 mb-8 shadow-xl`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {editedData?.name }
              </h1>
              <p className="text-slate-600">{editedData.email}</p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`${THEME_CLASSES.buttons.primary} px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2`}
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`${THEME_CLASSES.buttons.primary} px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50`}
                  >
                    {isSaving ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'resume' && (
          <ResumeSection
            resume={user?.resume}
          />
        )}

        {activeTab === 'overview' && (
          <PersonalInfoSection
            data={editedData}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsSection
            skills={editedData.skills}
            isEditing={isEditing}
            onAddSkill={async (skillData) => {
              try {
                // Call backend API to add skill
                const response = await candidateService.addSkill(skillData);

                // Update local state with the response
                if (response?.data?.skills) {
                  handleInputChange('skills', response.data.skills);
                }

                return response;
              } catch (error) {
                console.error('Error adding skill:', error);
                throw error;
              }
            }}
            onRemoveSkill={async (skillEntryId) => {
              try {
                // Call backend API to delete skill
                const response = await candidateService.deleteSkill(skillEntryId);

                // Backend returns null data; update optimistically
                handleInputChange(
                  'skills',
                  (editedData.skills || []).filter(s => (s.id || s._id) !== skillEntryId)
                );

                return response;
              } catch (error) {
                console.error('Error removing skill:', error);
                throw error;
              }
            }}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceSection
            experiences={editedData.experiences}
            isEditing={isEditing}
            newExperience={newExperience}
            setNewExperience={setNewExperience}
            onAddExperience={async (experienceData) => {
              try {
                // Validate required fields
                if (!experienceData.position || !experienceData.company || !experienceData.startDate) {
                  toast.error('Please fill in all required fields (Position, Company, and Start Date)');
                  return;
                }

                // Validate endDate if not currently working
                if (!experienceData.isCurrentlyWorking && !experienceData.endDate) {
                  toast.error('Please provide an End Date or check "Currently working here"');
                  return;
                }

                // Sanitize payload
                const payload = { ...experienceData };

                // Remove endDate if currently working or if it's empty
                if (payload.isCurrentlyWorking || !payload.endDate) {
                  delete payload.endDate;
                }

                const response = await candidateService.addExperience(payload);

                if (response?.success && response?.data) {
                  // Update local state with the new experience
                  handleInputChange('experiences', [...(editedData.experiences || []), response.data]);
                  setNewExperience({
                    company: '',
                    position: '',
                    employmentType: 'full-time',
                    startDate: '',
                    endDate: '',
                    isCurrentlyWorking: false,
                    description: ''
                  });
                }

                return response;
              } catch (error) {
                console.error('Error adding experience:', error);
                toast.error(error.message || 'Failed to add experience. Please try again.');
                throw error;
              }
            }}
            onRemoveExperience={async (experienceId) => {
              try {
                const response = await candidateService.deleteExperience(experienceId);

                if (response?.success) {
                  // Update local state by removing the experience
                  handleInputChange('experiences', editedData.experiences.filter(exp => exp._id !== experienceId));
                }

                return response;
              } catch (error) {
                console.error('Error removing experience:', error);
                toast.error('Failed to remove experience. Please try again.');
                throw error;
              }
            }}
          />
        )}

        {activeTab === 'education' && (
          <EducationSection
            education={editedData.education}
            isEditing={isEditing}
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            onAddEducation={async (educationData) => {
              try {
                // Validate required fields
                if (!educationData.degree || !educationData.institution || !educationData.startDate || !educationData.fieldOfStudy) {
                  toast.error('Please fill in all required fields (Degree, Institution, Field of Study, and Start Date)');
                  return;
                }

                // Validate endDate if not currently studying
                if (!educationData.isCurrentlyStudying && !educationData.endDate) {
                  toast.error('Please provide an End Date or check "Currently studying here"');
                  return;
                }

                // Sanitize payload
                const payload = { ...educationData };

                // Remove endDate if currently studying or if it's empty
                if (payload.isCurrentlyStudying || !payload.endDate) {
                  delete payload.endDate;
                }

                const response = await candidateService.addEducation(payload);

                if (response?.success && response?.data) {
                  // Update local state with new education
                  handleInputChange('education', [...(editedData.education || []), response.data]);
                  setNewEducation({
                    institution: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    isCurrentlyStudying: false,
                    description: ''
                  });
                }

                return response;
              } catch (error) {
                console.error('Error adding education:', error);
                toast.error(error.message || 'Failed to add education. Please try again.');
                throw error;
              }
            }}
            onRemoveEducation={async (educationId) => {
              try {
                const response = await candidateService.deleteEducation(educationId);
                if (response?.success) {
                  // Update local state by removing education
                  handleInputChange('education', editedData.education.filter(edu => edu._id !== educationId));
                }

                return response;
              } catch (error) {
                console.error('Error removing education:', error);
                toast.error('Failed to remove education. Please try again.');
                throw error;
              }
            }}
          />
        )}
      </div>
    </div>
  );
}