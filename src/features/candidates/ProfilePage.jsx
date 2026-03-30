import React, { useState, useRef } from "react";
import { Edit3, Save, X, Loader, User } from "lucide-react";
import { useAuthContext } from "../../store/context/AuthContext";
import { THEME_CLASSES } from "../../theme";
import { toast } from "../../utils/toast";
import { useProfileData } from "./profile/hooks/useProfileData";
import { SkillsSection } from "./profile/components/SkillsSection";
import { ExperienceSection } from "./profile/components/ExperienceSection";
import { EducationSection } from "./profile/components/EducationSection";
import { PersonalInfoSection } from "./profile/components/PersonalInfoSection";
import { EnhancedResumeSection } from "./profile/components/EnhancedResumeSection";
import { candidateService } from "../../services/candidateService";
import resumeUploadService from "../../services/resumeUploadService";
import { CertificatesSection } from "./profile/components/CertificatesSection";

export default function ProfileEditor() {
  const { user, isLoading } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

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
    setEditedData,
  } = useProfileData();

  const handleResumeUpdate = async () => {
    try {
      const response = await resumeUploadService.getCurrentResume();
      if (response) {
        setEditedData((prev) => ({
          ...prev,
          resume: response,
        }));
        toast.success('Resume updated successfully!');
      }
    } catch (error) {
      console.error("Failed to refresh resume data:", error);
      toast.error('Failed to update resume data');
    }
  };

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!editedData || Object.keys(editedData).length === 0) {
    return (
      <div className="text-center p-8">Please log in to view your profile.</div>
    );
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar image size must be less than 2MB');
      return;
    }

    setAvatarUploading(true);

    try {
      const response = await candidateService.uploadAvatar(file);
      if (response?.success && response?.data) {
        setEditedData((prev) => ({
          ...prev,
          ...response.data,
        }));
        toast.success('Profile avatar updated successfully!');
      } else {
        throw new Error(response?.message || 'Avatar upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...editedData };

      if (
        typeof payload.expectedSalary === "string" &&
        !payload.expectedSalary.trim()
      )
        delete payload.expectedSalary;
      if (payload.overallExperience === "") delete payload.overallExperience;
      if (payload.noticePeriod === "") delete payload.noticePeriod;

      const response = await candidateService.updateProfile(payload);

      if (response?.success) {
        toast.success("Profile saved successfully!");
      } else {
        throw new Error(response?.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "resume", label: "Resume" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "certificates", label: "Certificates" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 items-start">
          {/* ── LEFT PANEL (3/10) ── Profile Header */}
          <div className="w-3/10 sticky top-12" style={{ flex: "3" }}>
            <div className={`${THEME_CLASSES.cards} p-6 shadow-xl`}>
              {editedData?.avatar?.url ? (
                <div className="relative mx-auto mb-4 w-24 h-24">
                  <img
                    src={editedData.avatar.url}
                    alt="Profile Avatar"
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600"
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? <Loader size={14} className="animate-spin" /> : <Edit3 size={14} />}
                  </button>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <div className="mx-auto w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-lg flex items-center justify-center text-slate-500">
                    <User size={36} />
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? 'Uploading...' : 'Upload Avatar'}
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={avatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={avatarUploading}
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {editedData?.name}
                </h1>
                <p className="text-slate-500 text-sm break-all">
                  {editedData.email}
                </p>
              </div>

              {editedData?.profileStrength && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">
                      Profile Strength
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {editedData.profileStrength}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        editedData.profileStrength >= 80
                          ? "bg-green-500"
                          : editedData.profileStrength >= 60
                            ? "bg-yellow-500"
                            : editedData.profileStrength >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${editedData.profileStrength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Sidebar nav mirrors the tabs */}
              <nav className="mt-6 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-primary-500 text-white shadow"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* ── RIGHT PANEL (7/10) ── Tab Content */}
          <div style={{ flex: "7" }}>
            {activeTab === "resume" && (
              <EnhancedResumeSection
                resume={editedData?.resume}
                onResumeUpdate={handleResumeUpdate}
              />
            )}

            {activeTab === "overview" && (
              <PersonalInfoSection
                data={editedData}
                onChange={handleInputChange}
              />
            )}

            {activeTab === "skills" && (
              <SkillsSection
                skills={editedData.skills}
                onAddSkill={async (skillData) => {
                  try {
                    const response = await candidateService.addSkill(skillData);
                    if (response?.data?.skills) {
                      handleInputChange("skills", response.data.skills);
                    }
                    return response;
                  } catch (error) {
                    console.error("Error adding skill:", error);
                    throw error;
                  }
                }}
                onRemoveSkill={async (skillEntryId) => {
                  try {
                    const response =
                      await candidateService.deleteSkill(skillEntryId);
                    handleInputChange(
                      "skills",
                      (editedData.skills || []).filter(
                        (s) => (s.id || s._id) !== skillEntryId,
                      ),
                    );
                    return response;
                  } catch (error) {
                    console.error("Error removing skill:", error);
                    throw error;
                  }
                }}
              />
            )}

            {activeTab === "experience" && (
              <ExperienceSection
                experiences={editedData.experiences}
                newExperience={newExperience}
                setNewExperience={setNewExperience}
                onEditExperience={(exp) => {
                  setNewExperience({
                    _id: exp._id,
                    position: exp.position,
                    company: exp.company,
                    employmentType: exp.employmentType,
                    startDate: exp.startDate
                      ? new Date(exp.startDate).toISOString().split("T")[0]
                      : "",
                    endDate: exp.endDate
                      ? new Date(exp.endDate).toISOString().split("T")[0]
                      : "",
                    isCurrentlyWorking: exp.isCurrentlyWorking,
                    jobDescription: exp.jobDescription || "",
                  });
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                onAddExperience={async (experienceData) => {
                  try {
                    if (
                      !experienceData.position ||
                      !experienceData.company ||
                      !experienceData.startDate
                    ) {
                      toast.error(
                        "Please fill in all required fields (Position, Company, and Start Date)",
                      );
                      return;
                    }
                    if (
                      !experienceData.isCurrentlyWorking &&
                      !experienceData.endDate
                    ) {
                      toast.error(
                        'Please provide an End Date or check "Currently working here"',
                      );
                      return;
                    }

                    const payload = { ...experienceData };
                    if (payload.isCurrentlyWorking || !payload.endDate)
                      delete payload.endDate;

                    let response;
                    if (payload._id) {
                      response = await candidateService.updateExperience(
                        payload._id,
                        payload,
                      );
                      if (response?.success && response?.data) {
                        handleInputChange(
                          "experiences",
                          editedData.experiences.map((exp) =>
                            exp._id === payload._id ? response.data : exp,
                          ),
                        );
                        toast.success("Experience updated successfully");
                      }
                    } else {
                      response = await candidateService.addExperience(payload);
                      if (response?.success && response?.data) {
                        handleInputChange("experiences", [
                          ...(editedData.experiences || []),
                          response.data,
                        ]);
                        toast.success("Experience added successfully");
                      }
                    }

                    if (response?.success) {
                      setNewExperience({
                        company: "",
                        position: "",
                        employmentType: "",
                        startDate: "",
                        endDate: "",
                        isCurrentlyWorking: false,
                        jobDescription: "",
                      });
                    }
                    return response;
                  } catch (error) {
                    console.error("Error saving experience:", error);
                    toast.error(
                      error.message ||
                        "Failed to save experience. Please try again.",
                    );
                    throw error;
                  }
                }}
                onRemoveExperience={async (experienceId) => {
                  try {
                    const response =
                      await candidateService.deleteExperience(experienceId);
                    if (response?.success) {
                      handleInputChange(
                        "experiences",
                        editedData.experiences.filter(
                          (exp) => exp._id !== experienceId,
                        ),
                      );
                    }
                    return response;
                  } catch (error) {
                    console.error("Error removing experience:", error);
                    toast.error(
                      "Failed to remove experience. Please try again.",
                    );
                    throw error;
                  }
                }}
              />
            )}

            {activeTab === "education" && (
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
                    startDate: edu.startDate
                      ? new Date(edu.startDate).toISOString().split("T")[0]
                      : "",
                    endDate: edu.endDate
                      ? new Date(edu.endDate).toISOString().split("T")[0]
                      : "",
                    isCurrentlyStudying: edu.isCurrentlyStudying,
                    jobDescription: edu.jobDescription || "",
                  });
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                onAddEducation={async (educationData) => {
                  try {
                    if (
                      !educationData.degree ||
                      !educationData.institution ||
                      !educationData.startDate ||
                      !educationData.fieldOfStudy
                    ) {
                      toast.error(
                        "Please fill in all required fields (Degree, Institution, Field of Study, and Start Date)",
                      );
                      return;
                    }
                    if (
                      !educationData.isCurrentlyStudying &&
                      !educationData.endDate
                    ) {
                      toast.error(
                        'Please provide an End Date or check "Currently studying here"',
                      );
                      return;
                    }

                    const payload = { ...educationData };
                    if (payload.isCurrentlyStudying || !payload.endDate)
                      delete payload.endDate;

                    let response;
                    if (payload._id) {
                      response = await candidateService.updateEducation(
                        payload._id,
                        payload,
                      );
                      if (response?.success && response?.data) {
                        handleInputChange(
                          "education",
                          editedData.education.map((edu) =>
                            edu._id === payload._id ? response.data : edu,
                          ),
                        );
                        toast.success("Education updated successfully");
                      }
                    } else {
                      response = await candidateService.addEducation(payload);
                      if (response?.success && response?.data) {
                        handleInputChange("education", [
                          ...(editedData.education || []),
                          response.data,
                        ]);
                        toast.success("Education added successfully");
                      }
                    }

                    if (response?.success) {
                      setNewEducation({
                        institution: "",
                        degree: "",
                        fieldOfStudy: "",
                        startDate: "",
                        endDate: "",
                        isCurrentlyStudying: false,
                        jobDescription: "",
                      });
                    }
                    return response;
                  } catch (error) {
                    console.error("Error saving education:", error);
                    toast.error(
                      error.message ||
                        "Failed to save education. Please try again.",
                    );
                    throw error;
                  }
                }}
                onRemoveEducation={async (educationId) => {
                  try {
                    const response =
                      await candidateService.deleteEducation(educationId);
                    if (response?.success) {
                      handleInputChange(
                        "education",
                        editedData.education.filter(
                          (edu) => edu._id !== educationId,
                        ),
                      );
                    }
                    return response;
                  } catch (error) {
                    console.error("Error removing education:", error);
                    toast.error(
                      "Failed to remove education. Please try again.",
                    );
                    throw error;
                  }
                }}
              />
            )}

            {activeTab === "certificates" && (
              <CertificatesSection
                newCertificate={newCertificate}
                setNewCertificate={setNewCertificate}
                onEditCertificate={(cert) => {
                  setNewCertificate({
                    _id: cert._id,
                    name: cert.name,
                    issuingOrganization: cert.issuingOrganization,
                    issueDate: cert.issueDate
                      ? new Date(cert.issueDate).toISOString().split("T")[0]
                      : "",
                    expiryDate: cert.expiryDate
                      ? new Date(cert.expiryDate).toISOString().split("T")[0]
                      : "",
                    credentialId: cert.credentialId || "",
                    credentialUrl: cert.credentialUrl || "",
                    jobDescription: cert.jobDescription || "",
                    skills: Array.isArray(cert.skills)
                      ? cert.skills.join(", ")
                      : cert.skills || "",
                  });
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                onAddCertificate={async (certificateData) => {
                  try {
                    if (
                      !certificateData.name ||
                      !certificateData.issuingOrganization ||
                      !certificateData.issueDate
                    ) {
                      toast.error(
                        "Please fill in all required fields (Name, Issuing Organization, Issue Date)",
                      );
                      return;
                    }

                    const payload = { ...certificateData };
                    if (!payload.expiryDate) delete payload.expiryDate;
                    if (
                      typeof payload.credentialUrl === "string" &&
                      !payload.credentialUrl.trim()
                    )
                      delete payload.credentialUrl;
                    if (
                      typeof payload.credentialId === "string" &&
                      !payload.credentialId.trim()
                    )
                      delete payload.credentialId;
                    if (
                      typeof payload.jobDescription === "string" &&
                      !payload.jobDescription.trim()
                    )
                      delete payload.jobDescription;

                    if (typeof payload.skills === "string") {
                      const skillsArray = payload.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      if (skillsArray.length > 0) payload.skills = skillsArray;
                      else delete payload.skills;
                    }

                    let response;
                    if (payload._id) {
                      response = await candidateService.updateCertificate(
                        payload._id,
                        payload,
                      );
                      if (response?.success && response?.data) {
                        handleInputChange(
                          "certificates",
                          editedData.certificates.map((cert) =>
                            cert._id === payload._id ? response.data : cert,
                          ),
                        );
                        toast.success("Certificate updated successfully");
                      }
                    } else {
                      response = await candidateService.addCertificate(payload);
                      if (response?.success && response?.data) {
                        handleInputChange("certificates", [
                          ...(editedData.certificates || []),
                          response.data,
                        ]);
                        toast.success("Certificate added successfully");
                      }
                    }

                    if (response?.success) {
                      setNewCertificate({
                        name: "",
                        issuingOrganization: "",
                        issueDate: "",
                        expiryDate: "",
                        credentialId: "",
                        credentialUrl: "",
                        jobDescription: "",
                        skills: "",
                      });
                    }
                    return response;
                  } catch (error) {
                    console.error("Error saving certificate:", error);
                    toast.error(
                      error.message ||
                        "Failed to save certificate. Please try again.",
                    );
                    throw error;
                  }
                }}
                onRemoveCertificate={async (certificateId) => {
                  try {
                    const response =
                      await candidateService.deleteCertificate(certificateId);
                    if (response?.success) {
                      handleInputChange(
                        "certificates",
                        (editedData.certificates || []).filter(
                          (cert) => cert._id !== certificateId,
                        ),
                      );
                    }
                    return response;
                  } catch (error) {
                    console.error("Error removing certificate:", error);
                    toast.error(
                      "Failed to remove certificate. Please try again.",
                    );
                    throw error;
                  }
                }}
                certificates={editedData.certificates || []}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
