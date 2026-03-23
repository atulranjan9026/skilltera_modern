import React, { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  LogOut, 
  ChevronRight, 
  Star, 
  ClipboardCheck, 
  Loader2, 
  Search,
  LayoutDashboard,
  UserCircle
} from "lucide-react";
import { companyService } from "../../../services/companyService";
import { getCompanyUser } from "../../../utils/auth";
import { Avatar } from "../ui/Avatar";
import { StatusBadge } from "../ui/StatusBadge";
import { fmtDate } from "../helpers";
import ChatPage from "../../chat/pages/ChatPage";

// ─── Feedback Form Modal ──────────────────────────────────────────────────────
const FeedbackFormModal = ({ isOpen, onClose, application, onSubmit }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [decision, setDecision] = useState("accept");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please provide a star rating");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await companyService.submitFeedback({
        applicationId: application._id,
        feedback,
        rating,
        decision
      });
      onSubmit();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Evaluate Candidate</h3>
              <p className="text-xs text-slate-500 font-medium">{application?.candidate?.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Feedback</label>
            <textarea
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts on the candidate's technical skills, culture fit, etc."
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommendation</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'accept', label: 'Accept', color: 'emerald' },
                { id: 'next_round', label: 'Next Round', color: 'blue' },
                { id: 'reject', label: 'Reject', color: 'rose' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDecision(opt.id)}
                    className="py-3 px-2 rounded-xl text-xs font-bold transition-all border-2"
                    style={
                      decision === opt.id
                        ? {
                            ...(opt.id === "accept"
                              ? { backgroundColor: "#ECFDF5", borderColor: "#10B981", color: "#047857" }
                              : opt.id === "next_round"
                                ? { backgroundColor: "#EEF2FF", borderColor: "#6366F1", color: "#3730A3" }
                                : { backgroundColor: "#FFF1F2", borderColor: "#F43F5E", color: "#BE123C" }),
                          }
                        : { backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", color: "#94A3B8" }
                    }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
              <LogOut className="w-4 h-4 rotate-180" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InterviewerDashboard() {
  const user = getCompanyUser();
  const [activeTab, setActiveTab] = useState("candidates");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchAssignedCandidates();
  }, []);

  const fetchAssignedCandidates = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAssignedCandidates();
      setCandidates(response.data?.applications || []);
    } catch (err) {
      console.error("Failed to fetch assigned candidates", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.job?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyUser");
    window.location.href = "/company/login";
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">Interviewer</span>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("candidates")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "candidates" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" /> My Candidates
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "messages" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="w-5 h-5" /> Messages
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
           <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name || "I"} className="border-2 border-white" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">Interviewer</p>
                </div>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
           >
             <LogOut className="w-5 h-5" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "candidates" ? (
          <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Candidate Pipeline</h1>
                <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
                   Managing {candidates.length} Assignments 
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </p>
              </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-12 h-12 text-indigo-200 animate-spin" />
                  <p className="text-slate-300 font-black text-sm uppercase tracking-widest">Hydrating Dashboard...</p>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">No active assignments</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    You haven't been assigned to any candidate interviews yet. When you are, they'll appear here for evaluation.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredCandidates.map(app => (
                    <div key={app._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
                       <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                             <Avatar name={app.candidate?.name || "?"} className="w-14 h-14 border-4 border-slate-50 group-hover:scale-110 transition-transform duration-300" />
                             <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{app.candidate?.name}</h3>
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={app.status} />
                                  <span className="text-slate-300">•</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{fmtDate(app.appliedAt)}</span>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedApp(app);
                              setShowFeedbackModal(true);
                            }}
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          >
                             <ClipboardCheck className="w-5 h-5" />
                          </button>
                       </div>

                       <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-4">
                          <div className="flex justify-between items-center text-sm">
                             <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Position</span>
                             <span className="font-black text-slate-700">{app.job?.jobTitle}</span>
                          </div>
                          <div className="h-px bg-slate-200/50"></div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Job Type</span>
                             <span className="font-black text-slate-700">{app.job?.jobType}</span>
                          </div>
                        {app.job?.description && (
                          <>
                            <div className="h-px bg-slate-200/50"></div>
                            <div className="flex justify-between items-start text-sm gap-3">
                              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest flex-shrink-0 mt-1">Description</span>
                              <span className="font-black text-slate-700 text-[10px] leading-relaxed text-right line-clamp-3">
                                {app.job.description}
                              </span>
                            </div>
                          </>
                        )}
                       </div>

                       <div className="flex gap-3">
                          {app.resume?.url && (
                            <a 
                              href={app.resume.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex-1 py-3.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center hover:bg-slate-50 transition-all shadow-sm"
                            >
                               See Resume
                            </a>
                          )}
                          <button 
                            onClick={() => setActiveTab("messages")}
                            className="flex-1 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                             <MessageSquare className="w-3.5 h-3.5" /> Start Chat
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
             <ChatPage />
          </div>
        )}
      </main>

      {/* Feedback Modal */}
      <FeedbackFormModal 
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
        onSubmit={fetchAssignedCandidates}
      />
    </div>
  );
}
