import { useEffect, useMemo, useRef, useState } from "react";
import { companyService } from "../../../../services/companyService";

/**
 * JobEditPage
 *
 * Props:
 *  job        – the job to edit (pre-populates the form)
 *  onBack     – () => void
 *  onSave     – (updatedJob) => Promise<void>  — call your API here
 */
export function JobEditPage({ job, onBack, onSave }) {
    const location = job?.location ?? {};
    const initialJobType = job?.jobType ?? "Full Time";
    const initialSalaryEnabled = Boolean(job?.salary?.min ?? job?.salaryMin);
    const initialRequiredSkills = Array.isArray(job?.requiredSkills)
        ? job.requiredSkills
        : [];

    const csvFromArr = (arr) => Array.isArray(arr) ? arr.join(", ") : (arr ?? "");
    const arrFromCsv = (str) => (str || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const [form, setForm] = useState({
        title: job?.title ?? job?.jobTitle ?? "",
        city: location.city ?? job?.city ?? "",
        state: location.state ?? job?.state ?? "",
        country: location.country ?? job?.country ?? "",
        isRemote: Boolean(location.isRemote ?? job?.isRemote ?? false),
        remoteType: location.remoteType ?? (Boolean(location.isRemote) ? "fully-remote" : "on-site"),
        jobType: initialJobType,
        experienceLevel: job?.experienceLevel ?? "mid",
        minExperience: typeof job?.minExperience === "number" ? job.minExperience : (job?.workExperience ?? 0),
        maxExperience: typeof job?.maxExperience === "number" ? job.maxExperience : (typeof job?.minExperience === "number" ? job.minExperience + 2 : (job?.workExperience ?? 0) + 2),
        openings: typeof job?.openings === "number" ? job.openings : 1,
        applicationDeadline: (job?.applicationDeadline ?? job?.lastDate) ? (job?.applicationDeadline ?? job?.lastDate).slice(0, 10) : "",  // yyyy-mm-dd
        jobDescription: job?.jobDescription,

        category: job?.category ?? "",
        tags: csvFromArr(job?.tags),
        benefits: csvFromArr(job?.benefits),
        responsibilities: csvFromArr(job?.responsibilities),
        qualifications: csvFromArr(job?.qualifications),

        salaryMin: job?.salary?.min ?? "",
        salaryMax: job?.salary?.max ?? "",
        salaryCurrency: job?.salary?.currency ?? "USD",
        salaryPeriod: job?.salary?.period ?? "yearly",

        status: job?.status ?? "active",
        isActive: Boolean(job?.isActive ?? job?.active ?? true),
        isFeatured: Boolean(job?.isFeatured ?? false),
    });
    const [salaryEnabled, setSalaryEnabled] = useState(initialSalaryEnabled);

    // Skills editing (Required Skills)
    const [requiredSkills, setRequiredSkills] = useState(
        initialRequiredSkills.map((s) => ({
            skillId: s.skillId?._id ?? s.skillId ?? "",
            skillName: s.skillName ?? s.skillId?.skillName ?? s.skillId?.name ?? "",
            experience: Number(s.experience ?? s.experience ?? 0),
            rating: Number(s.rating ?? 3),
            isMandatory: s.isMandatory ?? true,
        }))
    );
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const skillDropdownRef = useRef(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const set = (field) => (e) => {
        const value =
            field === "isRemote" || field === "isActive" || field === "isFeatured"
                ? e.target.checked
                : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const handler = (e) => {
            if (skillDropdownRef.current && !skillDropdownRef.current.contains(e.target)) {
                setShowSkillDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (skillInput.trim().length < 2) return;
        let cancelled = false;
        const t = setTimeout(async () => {
            setSkillsLoading(true);
            try {
                const data = await companyService.getAllActiveSkills(skillInput.trim());
                if (!cancelled) setAvailableSkills(Array.isArray(data) ? data : []);
            } catch {
                if (!cancelled) setAvailableSkills([]);
            } finally {
                if (!cancelled) setSkillsLoading(false);
            }
        }, 250);
        return () => { cancelled = true; clearTimeout(t); };
    }, [skillInput]);

    const filteredSkills = useMemo(() => {
        const existing = new Set(requiredSkills.map((s) => String(s.skillId)));
        return (availableSkills || []).filter((s) => !existing.has(String(s._id)));
    }, [availableSkills, requiredSkills]);

    function addRequiredSkill(s) {
        setRequiredSkills((prev) => ([
            ...prev,
            {
                skillId: s._id,
                skillName: s.skillName,
                experience: 1,
                rating: 3,
                isMandatory: true,
            }
        ]));
        setSkillInput("");
        setShowSkillDropdown(false);
    }

    function updateRequiredSkill(idx, field, value) {
        setRequiredSkills((prev) =>
            prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
        );
    }

    function removeRequiredSkill(idx) {
        setRequiredSkills((prev) => prev.filter((_, i) => i !== idx));
    }

    const jobTypeOptions = useMemo(() => ([
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" },
        { label: "Contract", value: "contract" },
        { label: "Internship", value: "internship" },
        { label: "Freelance", value: "freelance" },
    ]), []);

    const experienceLevelOptions = useMemo(() => ([
        { label: "Entry-level", value: "entry" },
        { label: "Mid-level", value: "mid" },
        { label: "Senior", value: "senior" },
        { label: "Lead", value: "lead" },
        { label: "Executive", value: "executive" },
    ]), []);

    const statusOptions = useMemo(() => ([
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Closed", value: "closed" },
        { label: "On-hold", value: "on-hold" },
    ]), []);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const minExperience = Number(form.minExperience);
            const maxExperience = Number(form.maxExperience);
            const openings = Number(form.openings) || 1;

            const salary =
                salaryEnabled && String(form.salaryMin).trim() !== ""
                    ? {
                        min: Number(form.salaryMin),
                        max: String(form.salaryMax).trim() !== "" ? Number(form.salaryMax) : Number(form.salaryMin),
                        currency: form.salaryCurrency || "USD",
                        period: (form.salaryPeriod || "yearly"),
                    }
                    : undefined;

            await onSave({
                ...job,
                title: form.title,
                jobDescription: form.jobDescription,
                jobType: form.jobType,
                experienceLevel: form.experienceLevel,
                minExperience,
                maxExperience,
                openings,
                category: form.category,
                tags: arrFromCsv(form.tags),
                benefits: arrFromCsv(form.benefits),
                responsibilities: arrFromCsv(form.responsibilities),
                qualifications: arrFromCsv(form.qualifications),
                salary,
                requiredSkills: requiredSkills
                    .filter((s) => String(s.skillId || "").trim() !== "")
                    .map((s) => ({
                        skillId: s.skillId,
                        skillName: s.skillName,
                        experience: Number(s.experience) || 0,
                        rating: Number(s.rating) || 3,
                        isMandatory: Boolean(s.isMandatory),
                    })),
                status: form.status,
                isActive: Boolean(form.isActive),
                isFeatured: Boolean(form.isFeatured),
                applicationDeadline: form.applicationDeadline ? new Date(form.applicationDeadline).toISOString() : null,
                location: {
                    city: form.city,
                    state: form.state,
                    country: form.country,
                    isRemote: Boolean(form.isRemote),
                    remoteType: Boolean(form.isRemote) ? form.remoteType : "on-site",
                },
            });
            onBack(); // return to list / detail after save
        } catch (err) {
            setError(err.message ?? "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="w-full space-y-8 pb-12">
            {/* ── Top bar ── */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                    onClick={onBack}
                    className="group text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span> Cancel
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Job Posting</h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-widest">Update your recruitment details</p>
                </div>
                <div className="w-24" /> {/* spacer */}
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl px-6 py-4 shadow-sm flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    
                    {/* ── Left/Main Column: Primary Info ── */}
                    <div className="xl:col-span-2 space-y-8">
                        
                        {/* Section: General Information */}
                        <FormSection title="General Information" icon="📝">
                            <Field label="Job Title" required>
                                <input
                                    value={form.title}
                                    onChange={set("title")}
                                    required
                                    className={inputCls}
                                    placeholder="e.g. Senior React Developer"
                                />
                            </Field>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="Category" required>
                                    <input value={form.category} onChange={set("category")} required className={inputCls} placeholder="e.g. Engineering" />
                                </Field>
                                <Field label="Experience Level">
                                    <select value={form.experienceLevel} onChange={set("experienceLevel")} className={inputCls}>
                                        {experienceLevelOptions.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Tags (comma separated)">
                                <input value={form.tags} onChange={set("tags")} className={inputCls} placeholder="e.g. React, Node.js, AWS" />
                            </Field>
                        </FormSection>

                        {/* Section: Role Details */}
                        <FormSection title="Role Specifications" icon="🎯">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="Job Type">
                                    <select value={form.jobType} onChange={set("jobType")} className={inputCls}>
                                        {jobTypeOptions.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Openings">
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.openings}
                                        onChange={set("openings")}
                                        className={inputCls}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="Min. Experience (yrs)">
                                    <input type="number" min={0} value={form.minExperience} onChange={set("minExperience")} className={inputCls} />
                                </Field>
                                <Field label="Max. Experience (yrs)">
                                    <input type="number" min={0} value={form.maxExperience} onChange={set("maxExperience")} className={inputCls} />
                                </Field>
                            </div>

                            <Field label="Job Description">
                                <textarea
                                    value={form.jobDescription}
                                    onChange={set("jobDescription")}
                                    rows={10}
                                    className={`${inputCls} resize-y leading-relaxed`}
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                />
                            </Field>
                        </FormSection>

                        {/* Section: Skills */}
                        <FormSection title="Required Technical Expertise" icon="✨">
                            <div className="space-y-4">
                                <div className="relative" ref={skillDropdownRef}>
                                    <div className="relative">
                                        <input
                                            value={skillInput}
                                            onChange={(e) => { setSkillInput(e.target.value); setShowSkillDropdown(true); }}
                                            onFocus={() => setShowSkillDropdown(true)}
                                            placeholder="Search and add skills… (min 2 chars)"
                                            className={`${inputCls} pr-12 h-12 bg-slate-50/50 border-slate-200/60`}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                            {skillsLoading ? (
                                                <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                            ) : (
                                                <span className="text-slate-300 text-lg">🔍</span>
                                            )}
                                        </div>
                                    </div>

                                    {showSkillDropdown && skillInput.trim().length >= 2 && (
                                        <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-200/50">
                                            <div className="max-h-60 overflow-y-auto">
                                                {skillsLoading ? (
                                                    <div className="px-6 py-8 text-sm text-slate-400 text-center animate-pulse">Searching repository…</div>
                                                ) : filteredSkills.length === 0 ? (
                                                    <div className="px-6 py-8 text-sm text-slate-400 text-center">No matching skills found</div>
                                                ) : (
                                                    <div className="p-2 space-y-1">
                                                        {filteredSkills.map((s) => (
                                                            <button
                                                                key={s._id}
                                                                type="button"
                                                                onClick={() => addRequiredSkill(s)}
                                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50/50 rounded-xl transition-colors text-left group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                                        {s.skillName?.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-sm font-bold text-slate-800 block">{s.skillName}</span>
                                                                        {s.category && (
                                                                            <span className="text-[10px] text-slate-400 font-semibold uppercase">{s.category}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-all font-bold text-lg">+</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {requiredSkills.length === 0 ? (
                                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                                        <p className="text-slate-400 text-sm font-medium">No skills added yet. Search above to begin.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {requiredSkills.map((s, idx) => (
                                            <div key={`${s.skillId}-${idx}`} className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm group hover:border-indigo-100 transition-all">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-slate-800 truncate">{s.skillName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate opacity-60">ID: {s.skillId}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Years</p>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={s.experience}
                                                            onChange={(e) => updateRequiredSkill(idx, "experience", e.target.value)}
                                                            className="w-12 text-center bg-slate-50 border-none rounded-lg py-1 text-xs font-black focus:ring-2 focus:ring-indigo-100"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Rating</p>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={s.rating}
                                                            onChange={(e) => updateRequiredSkill(idx, "rating", e.target.value)}
                                                            className="w-12 text-center bg-slate-50 border-none rounded-lg py-1 text-xs font-black focus:ring-2 focus:ring-indigo-100"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRequiredSkill(idx)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all text-xs"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FormSection>
                    </div>

                    {/* ── Right Column: Sidebar Settings ── */}
                    <div className="space-y-8">
                        
                        {/* Section: Location */}
                        <FormSection title="Work Location" icon="📍">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${form.isRemote ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                            {form.isRemote ? '🏠' : '🏢'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Remote Policy</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Is this a remote role?</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={form.isRemote}
                                        onChange={set("isRemote")}
                                        className="w-5 h-5 text-indigo-600 border-slate-300 rounded-lg focus:ring-indigo-500"
                                    />
                                </div>

                                {form.isRemote && (
                                    <Field label="Remote Strategy">
                                        <select value={form.remoteType} onChange={set("remoteType")} className={inputCls}>
                                            <option value="fully-remote">Fully Remote</option>
                                            <option value="hybrid">Hybrid Work</option>
                                            <option value="on-site">On-site (Fixed)</option>
                                        </select>
                                    </Field>
                                )}

                                <Field label="City" required>
                                    <input value={form.city} onChange={set("city")} required className={inputCls} placeholder="e.g. New York" />
                                </Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="State" required>
                                        <input value={form.state} onChange={set("state")} required className={inputCls} placeholder="NY" />
                                    </Field>
                                    <Field label="Country" required>
                                        <input value={form.country} onChange={set("country")} required className={inputCls} placeholder="USA" />
                                    </Field>
                                </div>
                            </div>
                        </FormSection>

                        {/* Section: Compensation */}
                        <FormSection title="Compensation" icon="💰">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">💵</span>
                                        <label className="text-sm font-bold text-slate-800">Display Salary Range</label>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={salaryEnabled}
                                        onChange={(e) => setSalaryEnabled(e.target.checked)}
                                        className="w-5 h-5 text-emerald-600 border-emerald-300 rounded-lg focus:ring-emerald-500"
                                    />
                                </div>

                                {salaryEnabled && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Min Salary">
                                                <input type="number" min={0} value={form.salaryMin} onChange={set("salaryMin")} className={inputCls} placeholder="0" />
                                            </Field>
                                            <Field label="Max Salary">
                                                <input type="number" min={0} value={form.salaryMax} onChange={set("salaryMax")} className={inputCls} placeholder="0" />
                                            </Field>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Currency">
                                                <select value={form.salaryCurrency} onChange={set("salaryCurrency")} className={inputCls}>
                                                    {["USD", "INR", "EUR", "GBP"].map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field label="Period">
                                                <select value={form.salaryPeriod} onChange={set("salaryPeriod")} className={inputCls}>
                                                    {["yearly", "monthly", "hourly"].map((p) => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        {/* Section: Status & Visibility */}
                        <FormSection title="Status & Visibility" icon="👁️">
                            <div className="space-y-5">
                                <Field label="Current Lifecycle Status">
                                    <select value={form.status} onChange={set("status")} className={inputCls}>
                                        {statusOptions.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Application Deadline">
                                    <input type="date" value={form.applicationDeadline} onChange={set("applicationDeadline")} className={inputCls} />
                                </Field>
                                
                                <div className="h-px bg-slate-100 my-2" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${form.isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}
                                         onClick={() => setForm(f => ({...f, isActive: !f.isActive}))}>
                                        <span className="text-lg">{form.isActive ? '✅' : '⏸️'}</span>
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Active</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${form.isFeatured ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}
                                         onClick={() => setForm(f => ({...f, isFeatured: !f.isFeatured}))}>
                                        <span className="text-lg">{form.isFeatured ? '⭐' : '☆'}</span>
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Featured</span>
                                    </div>
                                </div>
                            </div>
                        </FormSection>
                    </div>
                </div>

                {/* ── Fixed Bottom Actions ── */}
                <div className="sticky bottom-8 z-30 bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-slate-800">Ready to update?</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Changes will be visible immediately to candidates.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 md:flex-none text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-8 py-3 rounded-2xl transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-black px-10 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Saving…</span>
                                </>
                            ) : (
                                "Apply Changes"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

/* ── helpers ── */
const inputCls =
    "w-full border border-slate-200 bg-white rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm";

function Field({ label, required, children }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                {label} {required && <span className="text-rose-500 text-sm">*</span>}
            </label>
            {children}
        </div>
    );
}

function FormSection({ title, icon, children }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                {icon && <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>}
                <h2 className="text-lg font-black text-slate-800 tracking-tight">{title}</h2>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}