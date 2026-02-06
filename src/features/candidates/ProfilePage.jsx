import React, { useState } from 'react';
import { Edit3, Save, X, Loader, User } from 'lucide-react';
import { useAuthContext } from '../../store/context/AuthContext';
import { THEME_CLASSES } from '../../theme';
import { useProfileData } from './profile/hooks/useProfileData';
import { SkillsSection } from './profile/components/SkillsSection';
import { ExperienceSection } from './profile/components/ExperienceSection';
import { EducationSection } from './profile/components/EducationSection';
import { PersonalInfoSection } from './profile/components/PersonalInfoSection';

export default function ProfileEditor() {
  const { user, isLoading } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    editedData,
    handleInputChange,
    skillsLoading,
    skillError,
    newExperience,
    setNewExperience,
    addExperience,
    removeExperience,
    newEducation,
    setNewEducation,
    addEducation,
    removeEducation,
  } = useProfileData(user);

  if (isLoading) {
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
      // TODO: Implement save to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setIsEditing(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'skills', label: 'Skills', icon: User },
    { id: 'experience', label: 'Experience', icon: User },
    { id: 'education', label: 'Education', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${THEME_CLASSES.cards} p-8 mb-8 shadow-xl`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {editedData.fullname || 'Your Profile'}
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
            skillsLoading={skillsLoading}
            skillError={skillError}
            onAddSkill={async (skillData) => {
              try {
                // Call backend API to add skill
                const { candidateService } = await import('../../services/candidateService');
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
                const { candidateService } = await import('../../services/candidateService');
                const response = await candidateService.deleteSkill(skillEntryId);

                // Update local state with the response
                if (response?.data?.skills) {
                  handleInputChange('skills', response.data.skills);
                }

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
            onAddExperience={addExperience}
            onRemoveExperience={removeExperience}
          />
        )}

        {activeTab === 'education' && (
          <EducationSection
            education={editedData.education}
            isEditing={isEditing}
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            onAddEducation={addEducation}
            onRemoveEducation={removeEducation}
          />
        )}
      </div>
    </div>
  );
}