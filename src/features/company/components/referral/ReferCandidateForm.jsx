import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { companyService } from "../../../../services/companyService";
import { Spinner } from "../../ui/Spinner";

export function ReferCandidateForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({ mode: "onChange" });

  const [jobs, setJobs] = useState([]);
  const [jobsByCompany, setJobsByCompany] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");
  const [candidateSearchResults, setCandidateSearchResults] = useState([]);
  const [isSearchingCandidates, setIsSearchingCandidates] = useState(false);
  const [candidateMode, setCandidateMode] = useState("new");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await companyService.getRecruiterAssignedJobs();
        const list = res?.data?.jobs || res?.jobs || [];
        if (cancelled) return;
        setJobs(list);
        const grouped = {};
        list.forEach((job) => {
          const cid = job.companyId?._id || job.companyId || "unknown";
          const cname = job.companyName || "Unknown Company";
          if (!grouped[cid]) grouped[cid] = { companyName: cname, jobs: [] };
          grouped[cid].jobs.push(job);
        });
        setJobsByCompany(grouped);
      } catch {
        if (!cancelled) setJobs([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (candidateMode !== "existing" || candidateSearchQuery.trim().length < 2) {
      setCandidateSearchResults([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingCandidates(true);
      try {
        const res = await companyService.searchCandidates(candidateSearchQuery, 20);
        const list = res?.data?.candidates || res?.candidates || [];
        setCandidateSearchResults(list);
      } catch {
        setCandidateSearchResults([]);
      } finally {
        setIsSearchingCandidates(false);
      }
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [candidateSearchQuery, candidateMode]);

  const handleCandidateSelect = (c) => {
    setSelectedCandidate(c);
    setValue("candidateName", c.name);
    setValue("candidateEmail", c.email);
    setCandidateSearchQuery("");
    setCandidateSearchResults([]);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setError(null);

    if (!data.jobId) {
      setError("Please select a job");
      return;
    }
    const name = candidateMode === "existing" && selectedCandidate ? selectedCandidate.name : (data.candidateName || "").trim();
    const email = candidateMode === "existing" && selectedCandidate ? selectedCandidate.email : (data.candidateEmail || "").trim();
    if (!name || !email) {
      setError("Please provide candidate name and email");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        jobId: data.jobId,
        candidateName: name,
        candidateEmail: email,
        candidateLinkedInUrl: (data.candidateLinkedInUrl || "").trim() || undefined,
        connectionType: (data.connectionType || "").trim() || undefined,
        description: (data.description || "").trim() || undefined,
      };
      const res = await companyService.createReferral(payload);
      const msg = res?.data?.message || res?.message || "Referral created successfully";
      if (onSuccess) onSuccess(msg);
      reset();
      setSelectedCandidate(null);
      setCandidateSearchQuery("");
      setCandidateMode("new");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create referral");
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTitle = (job) => job.title || job.jobTitle || "Job";
  const jobLocation = (job) => job.location?.city ? `${job.location.city}${job.location.state ? `, ${job.location.state}` : ""}` : "";

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Job Selection</h3>
          <div>
            <label htmlFor="jobId" className="block text-xs font-medium text-slate-700 mb-1.5 required">
              Select Job
            </label>
            <select
              id="jobId"
              {...register("jobId", { required: "Please select a job" })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.jobId ? "border-rose-300" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">-- Select a job --</option>
              {Object.keys(jobsByCompany).length > 0 ? (
                Object.entries(jobsByCompany).map(([cid, cd]) => (
                  <optgroup key={cid} label={cd.companyName}>
                    {cd.jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {jobTitle(j)} {jobLocation(j) ? `(${jobLocation(j)})` : ""}
                      </option>
                    ))}
                  </optgroup>
                ))
              ) : (
                jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {jobTitle(j)} {jobLocation(j) ? `(${jobLocation(j)})` : ""}
                  </option>
                ))
              )}
            </select>
            {errors.jobId && <p className="text-rose-500 text-xs mt-1">{errors.jobId.message}</p>}
            {jobs.length === 0 && (
              <p className="text-slate-500 text-xs mt-1.5">
                No jobs assigned. Please contact your administrator to get assigned to jobs.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Candidate Information</h3>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => { setCandidateMode("new"); setSelectedCandidate(null); setCandidateSearchQuery(""); setValue("candidateName", ""); setValue("candidateEmail", ""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${candidateMode === "new" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              New Candidate
            </button>
            <button
              type="button"
              onClick={() => { setCandidateMode("existing"); setValue("candidateName", ""); setValue("candidateEmail", ""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${candidateMode === "existing" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              Search Existing
            </button>
          </div>

          {candidateMode === "new" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Name *</label>
                  <input
                    {...register("candidateName", { required: candidateMode === "new" ? "Name is required" : false, minLength: 3 })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.candidateName ? "border-rose-300" : "border-slate-200"}`}
                    placeholder="Full name"
                  />
                  {errors.candidateName && <p className="text-rose-500 text-xs mt-1">{errors.candidateName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    {...register("candidateEmail", { required: candidateMode === "new" ? "Email is required" : false })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.candidateEmail ? "border-rose-300" : "border-slate-200"}`}
                    placeholder="email@example.com"
                  />
                  {errors.candidateEmail && <p className="text-rose-500 text-xs mt-1">{errors.candidateEmail.message}</p>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Search candidates (min 2 chars)</label>
                <input
                  type="text"
                  value={candidateSearchQuery}
                  onChange={(e) => setCandidateSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="Search by name or email"
                />
              </div>
              {isSearchingCandidates && <Spinner />}
              {candidateSearchResults.length > 0 && (
                <div className="border border-slate-200 rounded-xl divide-y max-h-48 overflow-y-auto">
                  {candidateSearchResults.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => handleCandidateSelect(c)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${selectedCandidate?._id === c._id ? "bg-indigo-50 text-indigo-700" : ""}`}
                    >
                      {c.name} {c.email && `(${c.email})`}
                    </button>
                  ))}
                </div>
              )}
              {selectedCandidate && (
                <p className="text-sm text-slate-600 mt-2">
                  Selected: <strong>{selectedCandidate.name}</strong> ({selectedCandidate.email})
                </p>
              )}
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">LinkedIn URL</label>
              <input
                {...register("candidateLinkedInUrl")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Connection type</label>
              <input
                {...register("connectionType")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                placeholder="e.g. colleague, former manager"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Description (optional)</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none"
              placeholder="Brief note about the candidate"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Referral"}
          </button>
        </div>
      </form>
    </div>
  );
}
