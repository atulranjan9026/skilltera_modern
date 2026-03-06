import { useState } from "react";

/**
 * JobEditPage
 *
 * Props:
 *  job        – the job to edit (pre-populates the form)
 *  onBack     – () => void
 *  onSave     – (updatedJob) => Promise<void>  — call your API here
 */
export function JobEditPage({ job, onBack, onSave }) {
    const [form, setForm] = useState({
        jobTitle: job?.jobTitle ?? "",
        city: job?.city ?? "",
        state: job?.state ?? "",
        country: job?.country ?? "",
        jobType: job?.jobType ?? "Full-time",
        workExperience: job?.workExperience ?? 0,
        lastDate: job?.lastDate ? job.lastDate.slice(0, 10) : "",  // yyyy-mm-dd for <input type="date">
        jobDescription: job?.jobDescription ?? "",
        travelRequired: job?.travelRequired ?? false,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const set = (field) => (e) => {
        const value = field === 'travelRequired' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await onSave({
                ...job,
                ...form,
                workExperience: Number(form.workExperience),
            });
            onBack(); // return to list / detail after save
        } catch (err) {
            setError(err.message ?? "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* ── Top bar ── */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                    ← Cancel
                </button>
                <h1 className="text-lg font-bold text-slate-900">Edit Job</h1>
                <div className="w-16" /> {/* spacer */}
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">

                <Field label="Job Title" required>
                    <input
                        value={form.jobTitle}
                        onChange={set("jobTitle")}
                        required
                        className={inputCls}
                        placeholder="e.g. Senior React Developer"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="City" required>
                        <input value={form.city} onChange={set("city")} required className={inputCls} placeholder="e.g. Dallas" />
                    </Field>
                    <Field label="State" required>
                        <input value={form.state} onChange={set("state")} required className={inputCls} placeholder="e.g. Texas" />
                    </Field>
                </div>

                <Field label="Country" required>
                    <input value={form.country} onChange={set("country")} required className={inputCls} placeholder="e.g. USA" />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Job Type">
                        <select value={form.jobType} onChange={set("jobType")} className={inputCls}>
                            {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((t) => (
                                <option key={t}>{t}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Min. Experience (yrs)">
                        <input
                            type="number"
                            min={0}
                            max={30}
                            value={form.workExperience}
                            onChange={set("workExperience")}
                            className={inputCls}
                        />
                    </Field>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="travelRequired"
                        checked={form.travelRequired}
                        onChange={set("travelRequired")}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <Field label="Travel Required">
                        <label htmlFor="travelRequired" className="text-sm text-gray-700">
                            This position requires travel
                        </label>
                    </Field>
                </div>

                <Field label="Application Deadline">
                    <input type="date" value={form.lastDate} onChange={set("lastDate")} className={inputCls} />
                </Field>

                <Field label="Job Description">
                    <textarea
                        value={form.jobDescription}
                        onChange={set("jobDescription")}
                        rows={8}
                        className={`${inputCls} resize-y`}
                        placeholder="Describe the role, responsibilities, requirements, and what you offer..."
                    />
                </Field>

                {/* ── Submit ── */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl border border-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ── helpers ── */
const inputCls =
    "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white";

function Field({ label, required, children }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
                {label} {required && <span className="text-rose-400">*</span>}
            </label>
            {children}
        </div>
    );
}