import React, { useState, useEffect } from "react";
import { X, ClipboardCheck, Star, MessageSquare, Check, XCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { companyService } from "../../../services/companyService";
import { fmtDate } from "../helpers";

export default function FeedbackReviewModal({ 
  isOpen, 
  onClose, 
  application, 
  onAction 
}) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && application) {
      fetchFeedback();
    }
  }, [isOpen, application]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await companyService.getFeedbackForApplication(application._id);
      setFeedback(response.data?.feedback || []);
    } catch (err) {
      setError("Failed to load interviewer feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setSubmitting(true);
    setError(null);
    try {
      await onAction(application._id, status);
      onClose();
    } catch (err) {
      setError("Failed to update application status");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Interviewer Feedback</h3>
              <p className="text-xs text-slate-500 font-medium">Reviewing {application?.candidate?.name || "Candidate"}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-medium text-sm">Collating feedback...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-500 flex flex-col items-center gap-2">
              <AlertCircle className="w-10 h-10" />
              <p className="font-semibold">{error}</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No feedback submitted yet</p>
              <p className="text-xs text-slate-400 mt-1">Interviewers are still evaluating the candidate.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedback.map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm">
                        {item.interviewerId?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.interviewerId?.name || "Unknown Interviewer"}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{fmtDate(item.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.decision === 'accept' ? 'bg-emerald-100 text-emerald-700' :
                        item.decision === 'reject' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.decision.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{item.feedback}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                <ArrowRight className="w-3 h-3" />
                Final Decision for Hiring Manager
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus('selected')}
                  disabled={submitting || loading}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Final Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus('shortlisted')} // Recommend next round / back to shortlist
                  disabled={submitting || loading}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" /> Next Round
                </button>
                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={submitting || loading}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject Candidate
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
