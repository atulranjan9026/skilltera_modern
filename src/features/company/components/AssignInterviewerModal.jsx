import React, { useState, useEffect } from "react";
import { X, Users, Check, AlertCircle, Loader2, Search } from "lucide-react";
import { companyService } from "../../../services/companyService";

export default function AssignInterviewerModal({ 
  isOpen, 
  onClose, 
  application, 
  onAssign 
}) {
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInterviewers();
      // Reset selection when opening for a new application
      setSelectedIds(application?.assignedInterviewers || []);
    }
  }, [isOpen, application]);

  const fetchInterviewers = async () => {
    setLoading(true);
    try {
      const response = await companyService.getInterviewers();
      setInterviewers(response.data?.interviewers || []);
    } catch (err) {
      setError("Failed to load interviewers");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      setError("Please select at least one interviewer");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await companyService.assignInterviewers({
        applicationId: application._id,
        interviewerIds: selectedIds
      });
      onAssign(selectedIds);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign interviewers");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredInterviewers = interviewers.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Assign Interviewers</h3>
              <p className="text-xs text-slate-500 font-medium">For {application?.candidate?.name || "Candidate"}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search interviewers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Loading interviewers...</p>
            </div>
          ) : filteredInterviewers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">No interviewers found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredInterviewers.map(interviewer => (
                <button
                  key={interviewer._id}
                  onClick={() => handleToggle(interviewer._id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    selectedIds.includes(interviewer._id)
                      ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                      : "hover:bg-slate-50 text-slate-600 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      selectedIds.includes(interviewer._id) ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {interviewer.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm leading-tight">{interviewer.name}</p>
                      <p className="text-[10px] opacity-70 leading-tight">{interviewer.email}</p>
                    </div>
                  </div>
                  {selectedIds.includes(interviewer._id) && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-3 bg-rose-50 border-t border-rose-100 flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loading || selectedIds.length === 0}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
