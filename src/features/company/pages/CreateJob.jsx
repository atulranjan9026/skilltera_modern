import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const JOB_TYPES         = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead", "Executive"];
const REMOTE_TYPES      = ["On-site", "Hybrid", "Fully-remote"];
const SALARY_PERIODS    = ["Hourly", "Monthly", "Yearly"];
const CURRENCIES        = ["USD", "EUR", "GBP", "INR"];

const NAV_ITEMS = [
  { icon: "▦",  label: "Overview",     id: "overview" },
  { icon: "💼", label: "Job Postings", id: "jobs",    badge: 2 },
  { icon: "👥", label: "Applications", id: "apps",    badge: 14 },
  { icon: "📅", label: "Interviews",   id: "interviews", badge: 3 },
  { icon: "📊", label: "Analytics",    id: "analytics" },
];

// ─── MOCK SKILLS ──────────────────────────────────────────────────────────────
const MOCK_SKILLS = [
  { _id: "1", skillName: "React",       category: "Frontend" },
  { _id: "2", skillName: "Node.js",     category: "Backend"  },
  { _id: "3", skillName: "TypeScript",  category: "Language" },
  { _id: "4", skillName: "Python",      category: "Language" },
  { _id: "5", skillName: "AWS",         category: "Cloud"    },
  { _id: "6", skillName: "Docker",      category: "DevOps"   },
  { _id: "7", skillName: "PostgreSQL",  category: "Database" },
  { _id: "8", skillName: "GraphQL",     category: "API"      },
  { _id: "9", skillName: "Vue.js",      category: "Frontend" },
  { _id: "10",skillName: "Kubernetes",  category: "DevOps"   },
  { _id: "11",skillName: "MongoDB",     category: "Database" },
  { _id: "12",skillName: "Figma",       category: "Design"   },
];

// ─── STEP CONFIG ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info"    },
  { id: 2, label: "Location"      },
  { id: 3, label: "Experience"    },
  { id: 4, label: "Salary"        },
  { id: 5, label: "Details"       },
  { id: 6, label: "Skills"        },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function InputField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function StyledInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
        transition-all hover:border-slate-300 ${className}`}
      {...props}
    />
  );
}

function StyledSelect({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800
        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
        transition-all hover:border-slate-300 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CreateJobWithLayout() {
  const [activeNav,    setActiveNav]    = useState("jobs");
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [currentStep,  setCurrentStep]  = useState(1);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [apiError,     setApiError]     = useState(null);
  const [salaryEnabled,setSalaryEnabled]= useState(false);
  const [skills,       setSkills]       = useState([]);
  const [skillInput,   setSkillInput]   = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMock, setFilteredMock] = useState([]);
  const dropdownRef = useRef(null);

  // Outside click closes dropdown
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Filter mock skills
  useEffect(() => {
    if (skillInput.length < 2) { setFilteredMock([]); return; }
    const q = skillInput.toLowerCase();
    setFilteredMock(
      MOCK_SKILLS.filter(
        (s) => s.skillName.toLowerCase().includes(q) && !skills.find((x) => x._id === s._id)
      )
    );
  }, [skillInput, skills]);

  const addSkill    = (s) => { setSkills((p) => [...p, s]); setSkillInput(""); setShowDropdown(false); };
  const removeSkill = (id) => setSkills((p) => p.filter((s) => s._id !== id));

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "", description: "", jobType: "Full-time", experienceLevel: "Mid-level",
      minExperience: "", maxExperience: "",
      location: { city: "", state: "", country: "", isRemote: false, remoteType: "On-site" },
      salary: { min: "", max: "", currency: "USD", period: "Yearly" },
      deadline: "", openings: 1,
      benefits: "", responsibilities: "", qualifications: "", tags: "", category: "",
    },
    mode: "onChange",
  });

  const isRemote = watch("location.isRemote");

  const onSubmit = async (data) => {
    if (skills.length === 0) { setApiError("Please add at least one required skill."); return; }
    setSubmitting(true);
    setApiError(null);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    reset();
    setSkills([]);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const totalSteps    = STEPS.length;
  const progressPct   = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .nav-item:hover { background: rgba(255,255,255,0.07); }
        .step-done { background: #4f46e5; }
        .step-active { background: #fff; border: 2px solid #4f46e5; }
        .step-todo { background: #e2e8f0; }
      `}</style>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0 h-full select-none">

          {/* Logo */}
          <div className="px-5 py-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-black tracking-tighter">S</div>
              <span className="font-bold text-white text-sm tracking-wide">SkillTera</span>
              <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">PRO</span>
            </div>
          </div>

          {/* Company */}
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-sm">A</div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">Acme Corp</p>
                <p className="text-slate-400 text-[10px] truncate">hiring@acme.com</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left
                  ${activeNav === item.id
                    ? "bg-white/15 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"}`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
            <button className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-all">
              <span>⚙️</span><span>Settings</span>
            </button>
            <button className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-all">
              <span>🚪</span><span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN AREA ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top header */}
        <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none transition-colors"
          >
            ☰
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setActiveNav("jobs")}>Job Postings</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Create New Job</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Step progress in header */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium">Step {currentStep} of {totalSteps}</span>
              <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[10px] text-indigo-600 font-bold">{progressPct}%</span>
            </div>

            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        {/* ── CONTENT AREA ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">

            {/* Page title */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Job</h1>
                <p className="text-sm text-slate-500 mt-1">Fill in the details below to post a new job opening.</p>
              </div>
              <button
                onClick={() => setActiveNav("jobs")}
                className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl px-4 py-2 transition-all font-medium"
              >
                ← Back to Jobs
              </button>
            </div>

            {/* Step pills */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
              {STEPS.map((step, idx) => {
                const done   = currentStep > step.id;
                const active = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border
                      ${active  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                      : done    ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                      :           "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black
                      ${active ? "bg-white text-indigo-600"
                      : done   ? "bg-indigo-600 text-white"
                      :          "bg-slate-200 text-slate-500"}`}>
                      {done ? "✓" : step.id}
                    </span>
                    {step.label}
                  </button>
                );
              })}
            </div>

            {/* Alerts */}
            {submitted && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6 text-sm font-medium">
                <span className="text-lg">✅</span>
                Job posted successfully! It's now pending admin approval.
              </div>
            )}
            {apiError && (
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-5 py-4 mb-6 text-sm font-medium">
                <span className="text-lg">⚠️</span>
                {apiError}
                <button onClick={() => setApiError(null)} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* ── STEP 1: Basic Info ─────────────────────────────────── */}
              {currentStep === 1 && (
                <SectionCard title="Basic Information" subtitle="The core details of your job listing">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Job Title" required error={errors.title?.message}>
                      <StyledInput
                        {...register("title", { required: "Job title is required" })}
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </InputField>
                    <InputField label="Job Type" required error={errors.jobType?.message}>
                      <StyledSelect {...register("jobType", { required: true })}>
                        {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </StyledSelect>
                    </InputField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Experience Level">
                      <StyledSelect {...register("experienceLevel")}>
                        {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                      </StyledSelect>
                    </InputField>
                    <InputField label="Category">
                      <StyledInput
                        {...register("category")}
                        placeholder="e.g. Engineering, Design"
                      />
                    </InputField>
                  </div>
                  <InputField label="Job Description" required error={errors.description?.message}>
                    <textarea
                      {...register("description", { required: "Description is required" })}
                      rows={5}
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting…"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800
                        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                        transition-all hover:border-slate-300 resize-none"
                    />
                  </InputField>
                </SectionCard>
              )}

              {/* ── STEP 2: Location ───────────────────────────────────── */}
              {currentStep === 2 && (
                <SectionCard title="Location" subtitle="Where will this role be based?">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Country">
                      <StyledInput {...register("location.country")} placeholder="e.g. United States" />
                    </InputField>
                    <InputField label="State / Province">
                      <StyledInput {...register("location.state")} placeholder="e.g. California" />
                    </InputField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="City">
                      <StyledInput {...register("location.city")} placeholder="e.g. San Francisco" />
                    </InputField>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input {...register("location.isRemote")} type="checkbox" className="sr-only peer" />
                          <div className="w-10 h-5 bg-slate-200 peer-checked:bg-indigo-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-indigo-400" />
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Remote Work Available</span>
                      </label>
                    </div>
                  </div>
                  {isRemote && (
                    <InputField label="Remote Type">
                      <StyledSelect {...register("location.remoteType")}>
                        {REMOTE_TYPES.map((t) => <option key={t} value={t.toLowerCase().replace(" ", "-")}>{t}</option>)}
                      </StyledSelect>
                    </InputField>
                  )}
                </SectionCard>
              )}

              {/* ── STEP 3: Experience ─────────────────────────────────── */}
              {currentStep === 3 && (
                <SectionCard title="Experience Requirements" subtitle="How much experience should applicants have?">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Minimum Experience (years)">
                      <StyledInput
                        {...register("minExperience", { valueAsNumber: true })}
                        type="number" min="0" max="50" placeholder="e.g. 2"
                      />
                    </InputField>
                    <InputField label="Maximum Experience (years)">
                      <StyledInput
                        {...register("maxExperience", { valueAsNumber: true })}
                        type="number" min="0" max="50" placeholder="e.g. 10"
                      />
                    </InputField>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs text-indigo-700">
                    💡 Tip — Widening the experience range increases your applicant pool. Consider whether a motivated junior could grow into this role.
                  </div>
                </SectionCard>
              )}

              {/* ── STEP 4: Salary ─────────────────────────────────────── */}
              {currentStep === 4 && (
                <SectionCard title="Salary Information" subtitle="Transparent pay attracts better-fit candidates">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={salaryEnabled}
                        onChange={(e) => setSalaryEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-checked:bg-indigo-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-indigo-400" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Show Salary Range on Job Post</span>
                  </label>

                  {salaryEnabled && (
                    <div className="space-y-5 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <InputField label="Minimum Salary">
                          <StyledInput
                            {...register("salary.min", { valueAsNumber: true })}
                            type="number" min="0" step="1000" placeholder="50,000"
                          />
                        </InputField>
                        <InputField label="Maximum Salary">
                          <StyledInput
                            {...register("salary.max", { valueAsNumber: true })}
                            type="number" min="0" step="1000" placeholder="80,000"
                          />
                        </InputField>
                        <InputField label="Pay Period">
                          <StyledSelect {...register("salary.period")}>
                            {SALARY_PERIODS.map((p) => <option key={p}>{p}</option>)}
                          </StyledSelect>
                        </InputField>
                      </div>
                    </div>
                  )}

                  <InputField label="Currency">
                    <StyledSelect {...register("salary.currency")} className="md:w-40">
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </StyledSelect>
                  </InputField>
                </SectionCard>
              )}

              {/* ── STEP 5: Details ────────────────────────────────────── */}
              {currentStep === 5 && (
                <>
                  <SectionCard title="Application Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField label="Number of Openings">
                        <StyledInput
                          {...register("openings", { valueAsNumber: true })}
                          type="number" min="1" max="1000" placeholder="1"
                        />
                      </InputField>
                      <InputField label="Application Deadline">
                        <StyledInput {...register("deadline")} type="date" />
                      </InputField>
                    </div>
                  </SectionCard>

                  <SectionCard title="Additional Details" subtitle="Separate multiple items with commas">
                    {[
                      ["responsibilities", "Responsibilities", "e.g. Build new features, Lead code reviews"],
                      ["qualifications",   "Qualifications",   "e.g. Bachelor's in CS, 3+ years React"],
                      ["benefits",         "Benefits",         "e.g. Health insurance, 401k, Remote stipend"],
                      ["tags",             "Tags / Keywords",  "e.g. React, Node.js, AWS, Startup"],
                    ].map(([name, label, ph]) => (
                      <InputField key={name} label={label}>
                        <StyledInput {...register(name)} placeholder={ph} />
                      </InputField>
                    ))}
                  </SectionCard>
                </>
              )}

              {/* ── STEP 6: Skills ─────────────────────────────────────── */}
              {currentStep === 6 && (
                <SectionCard title="Required Skills" subtitle="Add skills candidates must have — at least one is required">
                  <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                      <StyledInput
                        type="text"
                        value={skillInput}
                        onChange={(e) => { setSkillInput(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && filteredMock.length > 0) { e.preventDefault(); addSkill(filteredMock[0]); }
                          if (e.key === "Escape") setShowDropdown(false);
                        }}
                        placeholder="Type to search skills (min 2 chars)…"
                        className="pr-10"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                    </div>

                    {showDropdown && skillInput.length >= 2 && (
                      <div className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="max-h-56 overflow-y-auto">
                          {filteredMock.length === 0 ? (
                            <div className="px-4 py-4 text-sm text-slate-400 text-center">No skills found for "{skillInput}"</div>
                          ) : (
                            filteredMock.map((skill) => (
                              <button
                                key={skill._id}
                                type="button"
                                onClick={() => addSkill(skill)}
                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-sm font-semibold text-slate-800">{skill.skillName}</span>
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                                    {skill.category}
                                  </span>
                                </div>
                                <span className="text-indigo-400 text-lg leading-none">+</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {skills.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                      <span className="text-3xl mb-2">🛠️</span>
                      <p className="text-sm font-medium text-slate-500">No skills added yet</p>
                      <p className="text-xs text-slate-400 mt-1">Search above to add required skills</p>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="space-y-2.5">
                      {skills.map((skill) => (
                        <div key={skill._id} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800">{skill.skillName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{skill.category}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Exp (yrs)</p>
                              <input
                                {...register(`skillExp_${skill._id}`, { valueAsNumber: true })}
                                type="number" min="0" max="30" defaultValue={1}
                                className="w-14 text-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Rating</p>
                              <input
                                {...register(`skillRating_${skill._id}`, { valueAsNumber: true })}
                                type="number" min="1" max="5" defaultValue={3}
                                className="w-14 text-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill._id)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              )}

              {/* ── NAVIGATION FOOTER ──────────────────────────────────── */}
              <div className="flex items-center justify-between pt-2 pb-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-xl
                    hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {STEPS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentStep(s.id)}
                      className={`rounded-full transition-all ${
                        s.id === currentStep ? "w-6 h-2 bg-indigo-500" :
                        s.id < currentStep  ? "w-2 h-2 bg-indigo-300" :
                                              "w-2 h-2 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Posting…
                      </>
                    ) : "Post Job ✓"}
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}