import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../constants";

export function DashboardHeader({
    activeTab, showCreate, companyUser,
    sidebarOpen, setSidebarOpen,
    onRefresh, onPostJob, setShowCreate,
}) {
    const navigate = useNavigate();
    const currentNavLabel = NAV_ITEMS.find((n) => n.tab === activeTab)?.label;

    const handleChatClick = () => {
        navigate("/company/chat");
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
                <button
                    onClick={onPostJob}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    + Post Job
                </button>
                {/* Chat option */}
                <button
                    onClick={handleChatClick}
                    title="Chat"
                    className="text-slate-400 hover:text-emerald-600 transition-colors text-base font-bold cursor-pointer"
                >
                    💬
                </button>
                {/* Avatar */}
                <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(companyUser?.companyName || "C")[0].toUpperCase()}
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
            </div>
        </header>
    );
}
