import React, { useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import Input from '../../../components/common/Input';
import { MOCK_USER } from '../../../data/mockData';
import { THEME_CLASSES } from '../../../theme';

/**
 * Profile Page - User profile and resume upload
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_USER);
  const [resumeFile, setResumeFile] = useState(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsParsingResume(true);

    // Simulate resume parsing
    setTimeout(() => {
      // Mock auto-fill from resume
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, 'Python', 'AWS'],
      }));
      setIsParsingResume(false);
    }, 2000);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`${THEME_CLASSES.buttons.primary} px-4 py-2 rounded-lg font-medium text-sm`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Resume Upload */}
          <div className={`${THEME_CLASSES.cards} p-6 mb-8`}>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Resume</h2>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              {resumeFile || profile.resume ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    📄 {resumeFile?.name || profile.resume}
                  </p>
                  {isParsingResume && (
                    <p className="text-sm text-primary-600 animate-pulse">
                      Parsing resume...
                    </p>
                  )}
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    <button className={`${THEME_CLASSES.buttons.secondary} px-4 py-2 rounded-lg text-sm font-medium`}>
                      Upload New
                    </button>
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-sm text-slate-600">
                      Drag and drop your resume here or click to browse
                    </p>
                    <p className="text-xs text-slate-500">PDF, DOC, DOCX (max 5MB)</p>
                  </div>
                </label>
              )}
            </div>
            {isParsingResume && (
              <p className="text-sm text-primary-600 mt-4">Auto-filling form fields...</p>
            )}
          </div>

          {/* Personal Information */}
          <div className={`${THEME_CLASSES.cards} p-6 mb-8`}>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Personal Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Skills */}
          <div className={`${THEME_CLASSES.cards} p-6 mb-8`}>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-primary-900"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill"
                  className={`${THEME_CLASSES.inputs} text-sm flex-1`}
                />
                <button
                  onClick={addSkill}
                  className={`${THEME_CLASSES.buttons.primary} px-4 py-2 rounded-lg font-medium text-sm`}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className={`${THEME_CLASSES.cards} p-6 mb-8`}>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Experience</h2>
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="pb-4 border-b border-slate-200 last:border-0">
                  <p className="font-semibold text-slate-900">{exp.position}</p>
                  <p className="text-sm text-slate-600">{exp.company}</p>
                  <p className="text-xs text-slate-500">{exp.duration}</p>
                  <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className={`${THEME_CLASSES.cards} p-6`}>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Education</h2>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="pb-4 border-b border-slate-200 last:border-0">
                  <p className="font-semibold text-slate-900">{edu.degree}</p>
                  <p className="text-sm text-slate-600">{edu.school}</p>
                  <p className="text-xs text-slate-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
