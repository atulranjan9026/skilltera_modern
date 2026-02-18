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
import { CertificatesSection } from './profile/components/CertificatesSection';

export default function ProfileEditor() {
  const { user, isLoading } = useAuthContext();
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
    newCertificate,
    setNewCertificate,
    setEditedData
  } = useProfileData(user);

  const handleResumeUpdate = async () => {
    try {
      const response = await candidateService.getProfile();
      if (response?.success && response?.data) {
        setEditedData(prev => ({
          ...prev,
          resume: response.data.resume
        }));
      }
    } catch (error) {
      console.error('Failed to refresh resume data:', error);
    }
  };

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!editedData) {
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
    { id: 'certificates', label: 'Certificates', icon: User },
  ];

  // const needsResume = editedData?.resume?.url;
  // const isGoogleUser = editedData?.authProvider === 'google';
  // console.log(needsResume);
  // console.log(isGoogleUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Complete profile banner for users without resume (especially Google sign-ups) */}
        {/* {needsResume && (
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
        )} */}

        {/* Header */}
        <div className={`${THEME_CLASSES.cards} p-8 mb-8 shadow-xl`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {editedData?.name}
              </h1>
              <p className="text-slate-600">{editedData.email}</p>
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
            resume={editedData?.resume}
            onResumeUpdate={handleResumeUpdate}
          />
        )}

        {activeTab === 'overview' && (
          <PersonalInfoSection
            data={editedData}
            onChange={handleInputChange}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsSection
            skills={editedData.skills}
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
            newExperience={newExperience}
            setNewExperience={setNewExperience}
            onEditExperience={(exp) => {
              setNewExperience({
                _id: exp._id,
                position: exp.position,
                company: exp.company,
                employmentType: exp.employmentType || 'full-time',
                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                isCurrentlyWorking: exp.isCurrentlyWorking,
                description: exp.description || ''
              });
              // Scroll to form
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
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

                let response;
                if (payload._id) {
                  // Update existing experience
                  response = await candidateService.updateExperience(payload._id, payload);
                  if (response?.success && response?.data) {
                    // Update local state by replacing the updated experience
                    const updatedExperiences = editedData.experiences.map(exp =>
                      exp._id === payload._id ? response.data : exp
                    );
                    handleInputChange('experiences', updatedExperiences);
                    toast.success('Experience updated successfully');
                  }
                } else {
                  // Add new experience
                  response = await candidateService.addExperience(payload);
                  if (response?.success && response?.data) {
                    // Update local state with the new experience
                    handleInputChange('experiences', [...(editedData.experiences || []), response.data]);
                    toast.success('Experience added successfully');
                  }
                }

                if (response?.success) {
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
                console.error('Error saving experience:', error);
                toast.error(error.message || 'Failed to save experience. Please try again.');
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
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            onEditEducation={(edu) => {
              setNewEducation({
                _id: edu._id,
                degree: edu.degree,
                institution: edu.institution,
                fieldOfStudy: edu.fieldOfStudy,
                startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
                endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
                isCurrentlyStudying: edu.isCurrentlyStudying,
                description: edu.description || ''
              });
              // Scroll to form
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
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

                let response;
                if (payload._id) {
                  // Update existing education
                  response = await candidateService.updateEducation(payload._id, payload);
                  if (response?.success && response?.data) {
                    // Update local state by replacing the updated item
                    const updatedEducation = editedData.education.map(edu =>
                      edu._id === payload._id ? response.data : edu
                    );
                    handleInputChange('education', updatedEducation);
                    toast.success('Education updated successfully');
                  }
                } else {
                  // Add new education
                  response = await candidateService.addEducation(payload);
                  if (response?.success && response?.data) {
                    // Update local state with new education
                    handleInputChange('education', [...(editedData.education || []), response.data]);
                    toast.success('Education added successfully');
                  }
                }

                if (response?.success) {
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
                console.error('Error saving education:', error);
                toast.error(error.message || 'Failed to save education. Please try again.');
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

        {activeTab === 'certificates' && (
          <CertificatesSection
            newCertificate={newCertificate}
            setNewCertificate={setNewCertificate}
            onEditCertificate={(cert) => {
              setNewCertificate({
                _id: cert._id,
                name: cert.name,
                issuingOrganization: cert.issuingOrganization,
                issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
                expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
                credentialId: cert.credentialId || '',
                credentialUrl: cert.credentialUrl || '',
                description: cert.description || '',
                skills: Array.isArray(cert.skills) ? cert.skills.join(', ') : (cert.skills || '')
              });
              // Scroll to form
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            onAddCertificate={async (certificateData) => {
              try {
                // Validate required fields
                if (!certificateData.name || !certificateData.issuingOrganization || !certificateData.issueDate) {
                  toast.error('Please fill in all required fields (Name, Issuing Organization, Issue Date)');
                  return;
                }

                // Sanitize payload
                const payload = { ...certificateData };
                if (!payload.expiryDate) delete payload.expiryDate;
                if (typeof payload.credentialUrl === 'string' && !payload.credentialUrl.trim()) delete payload.credentialUrl;
                if (typeof payload.credentialId === 'string' && !payload.credentialId.trim()) delete payload.credentialId;
                if (typeof payload.description === 'string' && !payload.description.trim()) delete payload.description;

                // Skills: allow comma-separated string
                if (typeof payload.skills === 'string') {
                  const skillsArray = payload.skills
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                  if (skillsArray.length > 0) payload.skills = skillsArray;
                  else delete payload.skills;
                }

                let response;
                if (payload._id) {
                  // Update existing certificate
                  response = await candidateService.updateCertificate(payload._id, payload);
                  if (response?.success && response?.data) {
                    const updatedCertificates = editedData.certificates.map(cert =>
                      cert._id === payload._id ? response.data : cert
                    );
                    handleInputChange('certificates', updatedCertificates);
                    toast.success('Certificate updated successfully');
                  }
                } else {
                  // Add new certificate
                  response = await candidateService.addCertificate(payload);
                  if (response?.success && response?.data) {
                    handleInputChange('certificates', [...(editedData.certificates || []), response.data]);
                    toast.success('Certificate added successfully');
                  }
                }

                if (response?.success) {
                  setNewCertificate({
                    name: '',
                    issuingOrganization: '',
                    issueDate: '',
                    expiryDate: '',
                    credentialId: '',
                    credentialUrl: '',
                    description: '',
                    skills: '',
                  });
                }

                return response;
              } catch (error) {
                console.error('Error saving certificate:', error);
                toast.error(error.message || 'Failed to save certificate. Please try again.');
                throw error;
              }
            }}
            onRemoveCertificate={async (certificateId) => {
              try {
                const response = await candidateService.deleteCertificate(certificateId);
                if (response?.success) {
                  handleInputChange(
                    'certificates',
                    (editedData.certificates || []).filter(cert => cert._id !== certificateId)
                  );
                }
                return response;
              } catch (error) {
                console.error('Error removing certificate:', error);
                toast.error('Failed to remove certificate. Please try again.');
                throw error;
              }
            }}
            certificates={editedData.certificates || []}
          />
        )}
      </div>
    </div>
  );
}
