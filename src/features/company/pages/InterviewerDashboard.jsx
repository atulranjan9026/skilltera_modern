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
  UserCircle,
  Check,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from "lucide-react";
import { companyService } from "../../../services/companyService";
import { chatService } from "../../../services/chatService";
import { getCompanyUser, getCompanyId } from "../../../utils/auth";

import { Avatar } from "../ui/Avatar";
import { StatusBadge } from "../ui/StatusBadge";
import { fmtDate } from "../helpers";
import ChatPage from "../../chat/pages/ChatPage";

/**
 * Format location object into a string
 */
const fmtLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  
  const parts = [loc.city, loc.state].filter(Boolean);
  const cityState = parts.join(", ");
  
  if (loc.isRemote) {
    return cityState ? `${cityState} (Remote)` : "Remote";
  }
  return cityState || loc.country || "On-site";
};

// Layout components
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";

// ─── Feedback Form Modal ──────────────────────────────────────────────────────
const FeedbackFormModal = ({ isOpen, onClose, application, onSubmit }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [decision, setDecision] = useState("accept");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFeedback("");
      setRating(0);
      setDecision("accept");
      setError(null);
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Evaluate Candidate</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{application?.candidate?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Overall Rating</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="transition-all hover:scale-125 focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${s <= rating ? "text-amber-400 fill-amber-400 drop-shadow-sm" : "text-slate-200"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Detailed Feedback</label>
            <textarea
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Technical skills, communication, culture fit..."
              className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm min-h-[140px] focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Recommendation</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'accept', label: 'Accept', color: 'bg-emerald-500', activeBg: 'bg-emerald-50 text-emerald-700 border-emerald-500' },
                { id: 'next_round', label: 'Next Round', color: 'bg-indigo-500', activeBg: 'bg-indigo-50 text-indigo-700 border-indigo-500' },
                { id: 'reject', label: 'Reject', color: 'bg-rose-500', activeBg: 'bg-rose-50 text-rose-700 border-rose-500' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDecision(opt.id)}
                  className={`py-3.5 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    decision === opt.id ? opt.activeBg : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> {error}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InterviewerDashboard() {
  const companyUser = getCompanyUser();
  const [activeTab, setActiveTab] = useState("candidates");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState(null);

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

  const handleStartChat = async (app) => {
    try {
      const companyId = getCompanyId();
      if (!app.candidate?._id || !companyId) return;

      const res = await chatService.initiateConversation(
        app.candidate._id,
        companyId,
        app.job._id,
        app.job?.jobTitle || "Interview Discussion"
      );
      
      if (res && res.success && res.conversation) {
        setSelectedConvId(res.conversation._id);
      }

      
      setActiveTab("messages");
    } catch (err) {
      console.error("Failed to initiate chat:", err);
      // Fallback: just switch tab
      setActiveTab("messages");
    }
  };

  const goTo = (tab) => {
    if (tab === "messages") {
      // Don't reset selectedConvId if we specifically want to start a chat
    } else {
      setSelectedConvId(null);
    }
    setActiveTab(tab);
  };



  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }} className="flex h-screen bg-slate-50 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
      `}</style>

      {sidebarOpen && (
        <DashboardSidebar 
          companyUser={companyUser}
          activeTab={activeTab}
          goTo={goTo}
          navBadges={[{ tab: 'candidates', badge: candidates.length }]}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          activeTab={activeTab}
          companyUser={companyUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onRefresh={fetchAssignedCandidates}
          showCreate={false}
          onPostJob={() => {}}
          setShowCreate={() => {}}
          onCreateInterviewer={() => {}}
          goTo={goTo}
        />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {activeTab === "candidates" ? (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interviews</h1>

                  <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-[0.2em] flex items-center gap-2">
                    {candidates.length} Assignments <span className="w-1 h-1 rounded-full bg-indigo-400"></span> ACTIVE SESSIONS
                  </p>
                </div>
                
                <div className="relative w-full md:w-80 group">
                  <Search className="w-4 h-4 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search candidate or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin opacity-20" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading candidates</span>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-24 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Users className="w-12 h-12 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3">No Assignments Found</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                    You don't have any active interview assignments at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                  {filteredCandidates.map(app => (
                    <div key={app._id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
                       {/* Top Section: Basic Info */}
                       <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-5">
                             <div className="relative group/avatar">
                               <Avatar name={app.candidate?.name || "?"} className="w-16 h-16 border-4 border-slate-50 ring-1 ring-slate-100 shadow-md group-hover:scale-105 transition-transform duration-500" />
                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                             </div>
                             <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{app.candidate?.name}</h3>
                                <div className="flex items-center gap-3">
                                  <StatusBadge status={app.status} />
                                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{fmtDate(app.appliedAt)}</span>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={() => { setSelectedApp(app); setShowFeedbackModal(true); }}
                            className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-sm group/btn"
                            title="Evaluate"
                          >
                             <ClipboardCheck className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                          </button>
                       </div>

                       {/* Candidate Stats/Details */}
                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-slate-50/50 rounded-2xl p-4 flex flex-col gap-1">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                             <span className="text-xs font-bold text-slate-700 truncate flex items-center gap-2">
                               <Mail className="w-3 h-3 text-slate-300" /> {app.candidate?.email || 'N/A'}
                             </span>
                          </div>
                          <div className="bg-slate-50/50 rounded-2xl p-4 flex flex-col gap-1">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
                             <span className="text-xs font-bold text-slate-700 truncate flex items-center gap-2">
                               <Phone className="w-3 h-3 text-slate-300" /> {app.candidate?.phone || 'N/A'}
                             </span>
                          </div>
                       </div>

                       {/* Job Info Section */}
                       <div className="bg-slate-50 rounded-3xl p-6 mb-8 flex-1 space-y-5 border border-slate-100/50">
                          <div className="space-y-4">
                             <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                   <Briefcase className="w-5 h-5 opacity-50" />
                                </div>
                                <div>
                                   <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Role Applied</span>
                                   <span className="text-sm font-black text-slate-800">{app.job?.jobTitle}</span>
                                </div>
                             </div>
                             
                             <div className="h-px bg-slate-200/50 mx-2"></div>

                             <div className="flex items-center justify-between text-xs px-2">
                                <div className="flex items-center gap-2">
                                   <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                   <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">{fmtLocation(app.job?.location)}</span>
                                </div>
                                <span className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">{app.job?.jobType}</span>
                             </div>
                          </div>
                          
                          {app.job?.jobDescription && (
                            <div className="pt-2 px-2">
                              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Key Requirements</span>
                              <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 italic">
                                "{app.job.jobDescription}"
                              </p>
                            </div>
                          )}
                       </div>

                       {/* Action Buttons */}
                       <div className="flex gap-4 mt-auto">
                          {app.resume?.url && (
                            <a 
                              href={app.resume.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex-1 py-4 bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 rounded-2xl text-center hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2 group/resume"
                            >
                               View Portfolio
                            </a>
                          )}
                          <button 
                            onClick={() => handleStartChat(app)}
                            className="flex-1 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 overflow-hidden"
                          >
                             <MessageSquare className="w-4 h-4 animate-pulse" /> Channel
                          </button>

                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col -mt-8 -mx-8 relative">
               <div className="flex-1 overflow-auto">
                  <ChatPage initialConversationId={selectedConvId} />
               </div>
            </div>
          )}

        </main>
      </div>

      <FeedbackFormModal 
        isOpen={showFeedbackModal}
        onClose={() => { setShowFeedbackModal(false); setSelectedApp(null); }}
        application={selectedApp}
        onSubmit={fetchAssignedCandidates}
      />
    </div>
  );
}
