import React, { useState } from 'react';
import { 
  Upload, Plus, Trash2, Camera, Mail, Phone, MapPin, Award, Calendar, 
  Edit3, Check, X, Download, FileText, User, Briefcase, 
  // Social Media Icons
  Github, Linkedin, Dribbble
} from 'lucide-react';
import Input from '../../../components/common/Input';
import { MOCK_USER } from '../../../data/mockData';
import { THEME_CLASSES } from '../../../theme';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    ...MOCK_USER,
    social: {
      linkedin: '',
      github: '',
      dribbble: ''
    }
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showProfilePreview, setShowProfilePreview] = useState(false);

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

    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, 'Python', 'AWS', 'Docker'],
        experience: [...prev.experience, {
          position: 'Software Engineer Intern',
          company: 'Tech Corp',
          duration: 'Jun 2024 - Present',
          description: 'Contributed to backend development'
        }]
      }));
      setIsParsingResume(false);
    }, 2500);
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

  const toggleEditMode = () => {
    if (isEditing) {
      console.log('Saving profile:', profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSocialChange = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  };

  const socialPlatforms = [
    { id: 'linkedin', icon: Linkedin, color: 'from-blue-600 to-blue-700', bg: 'bg-gradient-to-r from-blue-50 to-blue-100', hover: 'from-blue-500 to-blue-600' },
    { id: 'github', icon: Github, color: 'from-gray-800 to-gray-900', bg: 'bg-gradient-to-r from-gray-50 to-slate-100', hover: 'from-gray-700 to-gray-800' },
 
    { id: 'dribbble', icon: Dribbble, color: 'from-pink-500 to-rose-500', bg: 'bg-gradient-to-r from-pink-50 to-rose-50', hover: 'from-pink-400 to-rose-400' }
  ];

  const getCompletionPercentage = () => {
    const totalFields = 8;
    const filledFields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.location,
      profile.skills.length,
      profile.experience.length,
      Object.values(profile.social).filter(Boolean).length
    ].filter(field => field).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Header & Completion */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Avatar & Stats */}
            <div className={`${THEME_CLASSES.cards} p-8 text-center shadow-xl overflow-hidden`}>
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-primary-500 rounded-full mx-auto mb-4 shadow-lg border-4 border-white flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                {isEditing && (
                  <label className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-slate-50 transition-all hover:scale-110">
                    <input type="file" className="hidden" accept="image/*" />
                    <Camera size={18} className="text-slate-600" />
                  </label>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{profile.name}</h1>
              <p className="text-slate-600 mb-6 text-lg">{profile.jobTitle || 'Full Stack Developer'}</p>
              
              {/* Profile Completion */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-slate-900">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 relative overflow-hidden">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-1000 shadow-sm absolute inset-0"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={() => setShowProfilePreview(true)}
                  className={`${THEME_CLASSES.buttons.primary} py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200`}
                >
                  <Download size={16} />
                  Download Profile
                </button>
                <button
                  onClick={toggleEditMode}
                  className="py-3 px-4 text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-2 border border-slate-200"
                >
                  {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* ✨ BEAUTIFUL SOCIAL MEDIA SECTION */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 justify-center">
                  🌐 Connect With Me
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {socialPlatforms.slice(0, 4).map(({ id, icon: Icon, bg }) => (
                    <SocialMediaButton
                      key={id}
                      icon={Icon}
                      platform={id}
                      url={profile.social[id]}
                      gradient={bg}
                      isEditing={isEditing}
                      onChange={handleSocialChange}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {socialPlatforms.slice(4).map(({ id, icon: Icon, bg }) => (
                    <SocialMediaButton
                      key={id}
                      icon={Icon}
                      platform={id}
                      url={profile.social[id]}
                      gradient={bg}
                      isEditing={isEditing}
                      onChange={handleSocialChange}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${THEME_CLASSES.cards} p-6 shadow-lg`}>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User size={18} />
                Quick Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Skills</span>
                  <span className="font-semibold text-slate-900">{profile.skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Experience</span>
                  <span className="font-semibold text-slate-900">{profile.experience.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Education</span>
                  <span className="font-semibold text-slate-900">{profile.education.length}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Social Links</span>
                  <span className="font-semibold text-slate-900">{Object.values(profile.social).filter(Boolean).length}/3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Resume Upload */}
            <div className={`${THEME_CLASSES.cards} p-8 shadow-xl overflow-hidden`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Resume</h2>
                    <p className="text-slate-600">Upload your latest resume to auto-fill your profile</p>
                  </div>
                </div>
              </div>
              
              <div className={`transition-all duration-300 ${isParsingResume ? 'opacity-50' : ''}`}>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group cursor-pointer">
                  {resumeFile || profile.resume ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <FileText className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-slate-900 mb-2 truncate">
                          {resumeFile?.name || profile.resume}
                        </p>
                        <p className="text-sm text-slate-500 mb-6">✅ Successfully uploaded</p>
                      </div>
                      <label className="block">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        <button className={`${THEME_CLASSES.buttons.primary} px-8 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}>
                          Replace Resume
                        </button>
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer group w-full h-full flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                      <Upload className="w-16 h-16 mx-auto text-slate-400 group-hover:text-primary-500 transition-all duration-300 mb-4" />
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-slate-900 mb-1">Drop your resume here</p>
                        <p className="text-sm text-slate-600">or click to browse (PDF, DOC, DOCX - max 5MB)</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {isParsingResume && (
                <div className="mt-8 p-6 bg-primary-50 rounded-2xl border-2 border-primary-200">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary-400 rounded-full animate-spin border-2 border-white"></div>
                    <div>
                      <p className="font-semibold text-lg text-primary-800">Parsing your resume...</p>
                      <p className="text-sm text-primary-600">Extracting skills, experience, and education</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information & Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Personal Information */}
              <div className={`${THEME_CLASSES.cards} p-8 shadow-lg bg-white/80 backdrop-blur-sm md:col-span-1`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <User size={20} />
                    Personal Information
                  </h3>
                  {isEditing && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full animate-pulse">
                      Editing
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-lg font-semibold"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={Mail}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={Phone}
                  />
                  <Input
                    label="Location"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={MapPin}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className={`${THEME_CLASSES.cards} p-8 shadow-lg bg-white/80 backdrop-blur-sm md:col-span-1`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Award size={20} />
                    Skills
                  </h3>
                  <span className="text-sm text-slate-500 font-medium">{profile.skills.length} skills</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6 min-h-[120px] items-center">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill}
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 shadow-sm ${
                        isEditing 
                          ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:scale-105' 
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-md'
                      }`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-white/30 rounded-full p-1 transition-all hover:scale-110"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2 p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="e.g., React, Node.js, AWS"
                      className={`${THEME_CLASSES.inputs} text-sm bg-white border-slate-200 flex-1 focus:ring-2 focus:ring-primary-500 rounded-xl`}
                    />
                    <button
                      onClick={addSkill}
                      disabled={!newSkill.trim()}
                      className={`${THEME_CLASSES.buttons.primary} px-4 py-2.5 text-sm font-semibold flex-shrink-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-xl`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Experience & Education */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Experience */}
              <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase size={20} />
                  Experience
                </h3>
                <div className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-slate-200 hover:border-primary-200 hover:shadow-xl">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{exp.position}</h4>
                        <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full group-hover:bg-primary-100 group-hover:text-primary-700">{exp.duration}</span>
                      </div>
                      <p className="text-base font-semibold text-slate-800 mb-2">{exp.company}</p>
                      <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar size={20} />
                  Education
                </h3>
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-slate-200 hover:border-primary-200 hover:shadow-xl">
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{edu.degree}</h4>
                      <p className="text-base font-semibold text-slate-800 mb-1">{edu.school}</p>
                      <p className="text-sm text-slate-500 font-medium bg-slate-100 inline-block px-3 py-1 rounded-full">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Preview Modal */}
      {showProfilePreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  Profile Preview
                </h2>
                <button
                  onClick={() => setShowProfilePreview(false)}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:scale-110 shadow-lg"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-primary-500 rounded-full mx-auto mb-6 shadow-2xl border-8 border-white flex items-center justify-center text-4xl font-black text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{profile.name}</h3>
                  <p className="text-xl text-slate-600 mb-2">{profile.jobTitle || 'Full Stack Developer'}</p>
                  <p className="text-slate-500">{profile.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                  <button className={`${THEME_CLASSES.buttons.primary} py-4 text-lg font-bold shadow-2xl hover:shadow-3xl rounded-2xl`}>
                    Download PDF
                  </button>
                  <button className="py-4 px-6 bg-success hover:bg-success-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-200">
                    Share Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

/**
 * Beautiful Social Media Button Component
 */
function SocialMediaButton({ icon: Icon, platform, url, gradient, isEditing, onChange }) {
  const isActive = url && url.trim();

  return (
    <div className="group relative">
      <div className={`w-full p-4 rounded-2xl transition-all duration-400 shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 ${
        isActive ? 'bg-primary-50 shadow-xl ring-2 ring-white/50 ring-offset-2 ring-offset-slate-100' : 'bg-white'
      }`}>
        
        {/* Icon Container */}
        <div className="flex items-center justify-center p-3 bg-white rounded-xl mb-3 shadow-sm group-hover:bg-slate-50 transition-all duration-300 hover:shadow-md">
          <Icon 
            size={22} 
            className={`transition-all duration-400 group-hover:scale-110 group-hover:rotate-12 ${
              isActive ? 'text-primary-600 drop-shadow-lg shadow-black/20' : 'text-slate-500 group-hover:text-slate-800'
            }`} 
          />
        </div>

        {/* Editable Input */}
        {isEditing ? (
          <input
            type="url"
            value={url}
            onChange={(e) => onChange(platform, e.target.value)}
            placeholder={`yourprofile.${platform.slice(0, -2)}`}
            className="w-full text-xs text-center bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1 placeholder-slate-400 text-slate-800 font-semibold transition-all duration-200"
          />
        ) : (
          <div className="h-8 flex items-center justify-center">
            {isActive ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-800 hover:text-slate-900 hover:underline truncate block transition-all duration-200"
              >
                View Profile →
              </a>
            ) : (
              <span className="text-xs text-slate-400 font-semibold tracking-wide">Add link</span>
            )}
          </div>
        )}
      </div>

      {/* ✨ Animated Floating Badge */}
      {isActive && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-success rounded-2xl flex items-center justify-center shadow-xl border-4 border-white animate-pulse-slow hover:animate-none hover:scale-110 transition-all duration-200">
          <span className="text-white text-xs font-black">✓</span>
        </div>
      )}
    </div>
  );
}
