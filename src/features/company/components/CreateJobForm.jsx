import { useState, useEffect, useRef } from "react";
import { companyService } from "../../../services/companyService";
import {
    JOB_TYPES,
    EXPERIENCE_LEVELS,
    REMOTE_TYPES,
    SALARY_PERIODS,
    CURRENCIES,
} from "../constants";

const inp =
    "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";
const lbl =
    "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";

const INITIAL_FORM = {
    jobTitle: "", jobDescription: "", jobType: "Full-time", experienceLevel: "Mid-level",
    minExperience: "", maxExperience: "", category: "", openings: 1, deadline: "",
    benefits: "", responsibilities: "", qualifications: "", tags: "",
    country: "", state: "", city: "", isRemote: false, remoteType: "On-site",
    salaryMin: "", salaryMax: "", salaryCurrency: "USD", salaryPeriod: "Yearly",
    lobId: "", hiringManagerId: "", backupHiringManagerId: "", recruiterIds: []
};

export function CreateJobForm({ companyId, onSuccess, onCancel }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [salaryEnabled, setSalaryEnabled] = useState(false);

    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});

    // Enterprise data state
    const [lobs, setLobs] = useState([]);
    const [hiringManagers, setHiringManagers] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [recruiterInput, setRecruiterInput] = useState("");
    const [showRecruiterDropdown, setShowRecruiterDropdown] = useState(false);
    const recruiterDropdownRef = useRef(null);

    const setField = (k, v) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((p) => ({ ...p, [k]: "" }));
    };

    useEffect(() => {
        const h = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setShowDropdown(false);
            if (recruiterDropdownRef.current && !recruiterDropdownRef.current.contains(e.target))
                setShowRecruiterDropdown(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // Fetch skills from API (debounced)
    useEffect(() => {
        if (skillInput.length > 0 && skillInput.length < 2) return;
        let cancelled = false;
        const load = async () => {
            setSkillsLoading(true);
            try {
                const data = await companyService.getAllActiveSkills(skillInput);
                if (!cancelled) setAvailableSkills(data || []);
            } catch {
                if (!cancelled) setAvailableSkills([]);
            } finally {
                if (!cancelled) setSkillsLoading(false);
            }
        };
        const t = setTimeout(load, 300);
        return () => { cancelled = true; clearTimeout(t); };
    }, [skillInput]);

    // Fetch Enterprise data
    useEffect(() => {
        const fetchEnterprise = async () => {
            try {
                const [lobsRes, hmRes, recruitersRes] = await Promise.all([
                    companyService.getLOBs(),
                    companyService.getHiringManagers(),
                    companyService.getRecruiters()
                ]);
                setLobs(lobsRes.lobs || []);
                setHiringManagers(hmRes.hiringManagers || []);
                setRecruiters(recruitersRes.recruiters || []);
            } catch (error) {
                console.error("Failed to fetch enterprise data:", error);
            }
        };
        fetchEnterprise();
    }, []);

    const filteredSkills = availableSkills.filter(
        (s) => !skills.find((x) => x._id === s._id)
    );

    const addSkill = (s) => { setSkills((p) => [...p, { ...s, exp: 1, rating: 3 }]); setSkillInput(""); setShowDropdown(false); };
    const removeSkill = (id) => setSkills((p) => p.filter((s) => s._id !== id));
    const updateSkill = (id, k, v) => setSkills((p) => p.map((s) => (s._id === id ? { ...s, [k]: v } : s)));

    const validate = () => {
        const e = {};
        if (!form.jobTitle.trim()) e.jobTitle = "Job title is required";
        if (!form.jobDescription.trim()) e.jobDescription = "Description is required";
        if (skills.length === 0) e.skills = "Add at least one required skill";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);
        try {
            const csv = (str) => (str || "").split(",").map((s) => s.trim()).filter(Boolean);
            const mapType = { "Full Time": "Full Time", "Part Time": "Part Time", Contract: "contract", Internship: "internship" };
            const mapLevel = { "Entry-level": "entry", "Mid-level": "mid", Senior: "senior", Lead: "lead", Executive: "executive" };
            const mapRemote = { "On-site": "on-site", Hybrid: "hybrid", "Fully-remote": "fully-remote" };

            await companyService.postJob(companyId, {
                jobTitle: form.jobTitle.trim(),
                jobDescription: form.jobDescription.trim(),
                jobType: mapType[form.jobType] || "Full Time",
                experienceLevel: mapLevel[form.experienceLevel] || "mid",
                minExperience: parseInt(form.minExperience) || 0,
                maxExperience: parseInt(form.maxExperience) || parseInt(form.minExperience) + 5 || 5,
                category: form.category.trim(),
                openings: parseInt(form.openings) || 1,
                applicationDeadline: form.deadline ? new Date(form.deadline) : null,
                benefits: csv(form.benefits),
                responsibilities: csv(form.responsibilities),
                qualifications: csv(form.qualifications),
                tags: csv(form.tags),
                location: {
                    city: form.city.trim(),
                    state: form.state.trim(),
                    country: form.country.trim(),
                    isRemote: form.isRemote,
                    remoteType: form.isRemote ? mapRemote[form.remoteType] || "on-site" : "on-site",
                },
                salary:
                    salaryEnabled && form.salaryMin
                        ? {
                            min: parseFloat(form.salaryMin),
                            max: parseFloat(form.salaryMax) || parseFloat(form.salaryMin),
                            currency: form.salaryCurrency,
                            period: form.salaryPeriod.toLowerCase(),
                        }
                        : undefined,
                requiredSkills: skills.map((s) => ({
                    skillId: s._id,
                    skillName: s.skillName,
                    experience: parseInt(s.exp) || 1,
                    rating: parseInt(s.rating) || 3,
                    isMandatory: true,
                })),
                enterpriseAssignment: {
                    lobId: form.lobId || null,
                    hiringManagerId: form.hiringManagerId || null,
                    backupHiringManagerId: form.backupHiringManagerId || null,
                    recruiterIds: form.recruiterIds || []
                }
            });

            setSubmitted(true);
            setTimeout(() => { setSubmitted(false); onSuccess?.(); }, 1800);
        } catch (err) {
            setApiError(err?.response?.data?.message || "Failed to create job. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Create New Job</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Fill in the details to post a new opening.</p>
                </div>
                <button
                    onClick={onCancel}
                    className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl px-4 py-2 transition-all font-medium"
                >
                    ← Back to Jobs
                </button>
            </div>

            {submitted && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 text-sm font-medium">
                    <span>✅</span> Job posted successfully! Pending admin approval.
                </div>
            )}
            {apiError && (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-5 py-4 text-sm font-medium">
                    <span>⚠️</span> {apiError}
                    <button onClick={() => setApiError(null)} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">

                {/* ── Basic Info ──────────────────────────────────────────────────── */}
                <FormSection title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={lbl}>Job Title <span className="text-rose-500">*</span></label>
                            <input value={form.jobTitle} onChange={(e) => setField("jobTitle", e.target.value)}
                                placeholder="e.g. Senior Frontend Developer" className={inp} />
                            {errors.jobTitle && <p className="text-rose-500 text-xs mt-1">{errors.jobTitle}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Job Type</label>
                            <select value={form.jobType} onChange={(e) => setField("jobType", e.target.value)} className={inp}>
                                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={lbl}>Experience Level</label>
                            <select value={form.experienceLevel} onChange={(e) => setField("experienceLevel", e.target.value)} className={inp}>
                                {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={lbl}>Category</label>
                            <input value={form.category} onChange={(e) => setField("category", e.target.value)}
                                placeholder="e.g. Engineering, Design" className={inp} />
                        </div>
                    </div>
                    <div>
                        <label className={lbl}>Job Description <span className="text-rose-500">*</span></label>
                        <textarea value={form.jobDescription} onChange={(e) => setField("jobDescription", e.target.value)}
                            rows={5} placeholder="Describe the role, responsibilities…" className={`${inp} resize-none`} />
                        {errors.jobDescription && <p className="text-rose-500 text-xs mt-1">{errors.jobDescription}</p>}
                    </div>
                </FormSection>

                {/* ── Enterprise Assignment ────────────────────────────────────────── */}
                <FormSection title="Enterprise Assignment" subtitle="Assign this job to a specific business unit or manager">
                    <div className="mb-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setField("lobId", "");
                                setField("hiringManagerId", "");
                                setField("backupHiringManagerId", "");
                                setField("recruiterIds", []);
                                setRecruiterInput("");
                            }}
                            className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                            Clear Assignment
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={lbl}>Line of Business</label>
                            <select value={form.lobId} onChange={(e) => setField("lobId", e.target.value)} className={inp}>
                                <option value="">Select LOB (Optional)</option>
                                {lobs.map((lob) => <option key={lob._id} value={lob._id}>{lob.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={lbl}>Hiring Manager</label>
                            <select value={form.hiringManagerId} onChange={(e) => setField("hiringManagerId", e.target.value)} className={inp}>
                                <option value="">Select Hiring Manager (Optional)</option>
                                {hiringManagers.map((hm) => (
                                    <option key={hm._id} value={hm._id}>{hm.name} ({hm.email})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={lbl}>Backup Hiring Manager</label>
                            <select value={form.backupHiringManagerId} onChange={(e) => setField("backupHiringManagerId", e.target.value)} className={inp}>
                                <option value="">Select Backup Manager (Optional)</option>
                                {hiringManagers.map((hm) => (
                                    <option key={hm._id} value={hm._id}>{hm.name} ({hm.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative" ref={recruiterDropdownRef}>
                            <label className={lbl}>Recruiters</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={recruiterInput}
                                    onChange={(e) => { setRecruiterInput(e.target.value); setShowRecruiterDropdown(true); }}
                                    onFocus={() => setShowRecruiterDropdown(true)}
                                    placeholder="Search recruiters…"
                                    className={`${inp} pr-10`}
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                            </div>

                            {showRecruiterDropdown && (
                                <div className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="max-h-52 overflow-y-auto">
                                        {recruiters
                                            .filter(r => 
                                                !form.recruiterIds.includes(r._id) && 
                                                (r.name.toLowerCase().includes(recruiterInput.toLowerCase()) || 
                                                 r.email.toLowerCase().includes(recruiterInput.toLowerCase()))
                                            )
                                            .map((r) => (
                                                <button
                                                    key={r._id} type="button" 
                                                    onClick={() => {
                                                        setField("recruiterIds", [...form.recruiterIds, r._id]);
                                                        setRecruiterInput(""); 
                                                        setShowRecruiterDropdown(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                                                        <span className="text-[10px] text-slate-500">{r.email}</span>
                                                    </div>
                                                    <span className="text-indigo-400 text-lg leading-none">+</span>
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}

                            {form.recruiterIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {recruiters
                                        .filter(r => form.recruiterIds.includes(r._id))
                                        .map(r => (
                                            <div key={r._id} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-100">
                                                <span>{r.name}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setField("recruiterIds", form.recruiterIds.filter(id => id !== r._id))}
                                                    className="hover:text-indigo-900"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </FormSection>

                {/* ── Location ────────────────────────────────────────────────────── */}
                <FormSection title="Location">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className={lbl}>Country</label>
                            <input value={form.country} onChange={(e) => setField("country", e.target.value)} placeholder="e.g. United States" className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>State</label>
                            <input value={form.state} onChange={(e) => setField("state", e.target.value)} placeholder="e.g. California" className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>City</label>
                            <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="e.g. San Francisco" className={inp} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Toggle checked={form.isRemote} onChange={(v) => setField("isRemote", v)} label="Remote Work Available" />
                        {form.isRemote && (
                            <select value={form.remoteType} onChange={(e) => setField("remoteType", e.target.value)} className={`${inp} w-44`}>
                                {REMOTE_TYPES.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        )}
                    </div>
                </FormSection>

                {/* ── Experience & Application Details ───────────────────────────── */}
                <FormSection title="Experience & Application Details">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <div>
                            <label className={lbl}>Min Exp (yrs)</label>
                            <input type="number" min="0" max="50" value={form.minExperience}
                                onChange={(e) => setField("minExperience", e.target.value)} placeholder="0" className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Max Exp (yrs)</label>
                            <input type="number" min="0" max="50" value={form.maxExperience}
                                onChange={(e) => setField("maxExperience", e.target.value)} placeholder="10" className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Openings</label>
                            <input type="number" min="1" value={form.openings}
                                onChange={(e) => setField("openings", e.target.value)} placeholder="1" className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Deadline</label>
                            <input type="date" value={form.deadline} onChange={(e) => setField("deadline", e.target.value)} className={inp} />
                        </div>
                    </div>
                </FormSection>

                {/* ── Salary ──────────────────────────────────────────────────────── */}
                <FormSection title="Salary Information">
                    <Toggle checked={salaryEnabled} onChange={setSalaryEnabled} label="Show Salary Range" bold />
                    {salaryEnabled && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            <div>
                                <label className={lbl}>Min Salary</label>
                                <input type="number" min="0" value={form.salaryMin} onChange={(e) => setField("salaryMin", e.target.value)} placeholder="50,000" className={inp} />
                            </div>
                            <div>
                                <label className={lbl}>Max Salary</label>
                                <input type="number" min="0" value={form.salaryMax} onChange={(e) => setField("salaryMax", e.target.value)} placeholder="80,000" className={inp} />
                            </div>
                            <div>
                                <label className={lbl}>Currency</label>
                                <select value={form.salaryCurrency} onChange={(e) => setField("salaryCurrency", e.target.value)} className={inp}>
                                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={lbl}>Period</label>
                                <select value={form.salaryPeriod} onChange={(e) => setField("salaryPeriod", e.target.value)} className={inp}>
                                    {SALARY_PERIODS.map((p) => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </FormSection>

                {/* ── Additional Details ──────────────────────────────────────────── */}
                <FormSection title="Additional Details" subtitle="Separate multiple items with commas">
                    {[
                        ["responsibilities", "Responsibilities", "e.g. Build features, Lead code reviews"],
                        ["qualifications", "Qualifications", "e.g. Bachelor's in CS, 3+ years React"],
                        ["benefits", "Benefits", "e.g. Health insurance, 401k, Remote stipend"],
                        ["tags", "Tags / Keywords", "e.g. React, Node.js, AWS"],
                    ].map(([k, label, ph]) => (
                        <div key={k}>
                            <label className={lbl}>{label}</label>
                            <input value={form[k]} onChange={(e) => setField(k, e.target.value)} placeholder={ph} className={inp} />
                        </div>
                    ))}
                </FormSection>

                {/* ── Required Skills ─────────────────────────────────────────────── */}
                <FormSection title="Required Skills *" subtitle="Type to search skills from the database">
                    <div className="relative" ref={dropdownRef}>
                        <div className="relative">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => { setSkillInput(e.target.value); setShowDropdown(true); }}
                                onFocus={() => setShowDropdown(true)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && filteredSkills.length > 0) { e.preventDefault(); addSkill(filteredSkills[0]); }
                                    if (e.key === "Escape") setShowDropdown(false);
                                }}
                                placeholder="Search skills… (min 2 chars)"
                                className={`${inp} pr-10`}
                            />
                            {skillsLoading
                                ? <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                : <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>}
                        </div>

                        {showDropdown && skillInput.length >= 2 && (
                            <div className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                                <div className="max-h-52 overflow-y-auto">
                                    {skillsLoading ? (
                                        <div className="px-4 py-4 text-sm text-slate-400 text-center">Loading skills…</div>
                                    ) : filteredSkills.length === 0 ? (
                                        <div className="px-4 py-4 text-sm text-slate-400 text-center">No skills found for "{skillInput}"</div>
                                    ) : (
                                        filteredSkills.map((skill) => (
                                            <button
                                                key={skill._id} type="button" onClick={() => addSkill(skill)}
                                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-sm font-semibold text-slate-800">{skill.skillName}</span>
                                                    {skill.category && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">{skill.category}</span>
                                                    )}
                                                </div>
                                                <span className="text-indigo-400 text-lg leading-none">+</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.skills && <p className="text-rose-500 text-xs">{errors.skills}</p>}

                    {skills.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                            <span className="text-3xl mb-2">🛠️</span>
                            <p className="text-sm font-medium text-slate-500">No skills added yet</p>
                            <p className="text-xs text-slate-400 mt-0.5">Search above to add required skills</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {skills.map((skill) => (
                                <div key={skill._id} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">{skill.skillName}</p>
                                        {skill.category && <p className="text-[10px] text-slate-400 font-medium">{skill.category}</p>}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="text-center">
                                            <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Exp (yrs)</p>
                                            <input type="number" min="0" max="30" value={skill.exp}
                                                onChange={(e) => updateSkill(skill._id, "exp", e.target.value)}
                                                className="w-14 text-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Rating</p>
                                            <input type="number" min="1" max="5" value={skill.rating}
                                                onChange={(e) => updateSkill(skill._id, "rating", e.target.value)}
                                                className="w-14 text-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeSkill(skill._id)}
                                        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-xs ml-1">
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </FormSection>

                {/* ── Submit ──────────────────────────────────────────────────────── */}
                <div className="flex items-center justify-end gap-3 pb-6">
                    <button type="button" onClick={onCancel}
                        className="px-5 py-2.5 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={submitting}
                        className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-60">
                        {submitting
                            ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Posting…</>
                            : "Post Job ✓"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Local helpers ─────────────────────────────────────────────────────────────
function FormSection({ title, subtitle, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/60 rounded-t-2xl">
                <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <div className="px-6 py-5 space-y-5">{children}</div>
        </div>
    );
}

function Toggle({ checked, onChange, label, bold }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-200 peer-checked:bg-indigo-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className={`text-sm text-slate-700 ${bold ? "font-semibold" : "font-medium"}`}>{label}</span>
        </label>
    );
}
