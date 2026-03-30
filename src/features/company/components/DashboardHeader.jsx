import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../constants";
import { useAuthContext } from "../../../store/context/AuthContext";
import { UserPlus } from "lucide-react";

export function DashboardHeader({
    activeTab, showCreate, companyUser,
    sidebarOpen, setSidebarOpen,
    onRefresh, onPostJob, setShowCreate, onCreateInterviewer, goTo
}) {
    const navigate = useNavigate();
    const { logout } = useAuthContext();
    const currentNavLabel = NAV_ITEMS.find((n) => n.tab === activeTab)?.label;

    // const handleChatClick = () => {
    //     if (goTo) {
    //         goTo("messages");
    //     } else {
    //         navigate("/company/chat");
    //     }
    // };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/company/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Fallback: clear and redirect
            localStorage.clear();
            navigate("/company/login");
        }
    };

    return (
        <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
            {/* Sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-400 hover:text-slate-700 text-xl leading-none transition-colors"
            >
                ☰
            </button>

            {/* Breadcrumb / title */}
            <div>
                {showCreate ? (
                    <div className="flex items-center gap-2 text-xs">
                        <span
                            className="text-slate-400 cursor-pointer hover:text-slate-600"
                            onClick={() => setShowCreate(false)}
                        >
                            Job Postings
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-700 font-semibold">Create New Job</span>
                    </div>
                ) : (
                    <>
                        <h1 className="text-sm font-bold text-slate-900">{currentNavLabel}</h1>
                        <p className="text-xs text-slate-400">Company Dashboard · {companyUser?.companyName || ""}</p>
                    </>
                )}
            </div>

            {/* Right-side actions */}
            <div className="ml-auto flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    title="Refresh"
                    className="text-slate-400 hover:text-indigo-600 transition-colors text-base font-bold"
                >
                    ↻
                </button>
                {companyUser?.role === "company" && (
                    <button
                        onClick={onPostJob}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                        + Post Job
                    </button>
                )}
                {/* Create Interviewer Account - Only for Hiring Managers */}
                {["hiring_manager", "backup_hiring_manager"].includes(companyUser?.role) && (
                    <button
                        onClick={onCreateInterviewer}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <UserPlus className="w-3 h-3" />
                        Create Interviewer
                    </button>
                )}
                {/* Chat option */}
                {/* <button
                    onClick={handleChatClick}
                    title="Chat"
                    className="relative group w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-slate-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat
                    </span>
                </button> */}
                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="relative group w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-slate-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Logout
                    </span>
                </button>
            </div>
        </header>
    );
}
