import { NAV_ITEMS } from "../constants";

export function DashboardSidebar({ companyUser, activeTab, showCreate, goTo, navBadges = [] }) {
    // Merge static nav items with dynamic badge counts from parent
    // Filter and merge static nav items with dynamic badge counts from parent
    const items = NAV_ITEMS
        .filter(item => {
            const role = companyUser?.role;
            if (role === "interviewer") {
                return ["candidates", "messages"].includes(item.tab);
            }
            if (item.tab === "EnterpriseManagement") {
                return role === "company";
            }
            // Hide interviewer-only items from company/hiring_manager
            if (["candidates", "messages"].includes(item.tab)) {
                return false;
            }
            return true;
        })

        .map((item) => {
            const badgeEntry = navBadges.find((b) => b.tab === item.tab);
            return { ...item, badge: badgeEntry?.badge ?? null };
        });
    return (
        <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0 h-full select-none">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-black">S</div>
                    <span className="font-bold text-white text-sm tracking-wide">SkillTera</span>
                    <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">PRO</span>
                </div>
            </div>

            {/* Company info */}
            <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-sm">
                        {(companyUser?.name || "C")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{companyUser?.name || companyUser?.companyName || "Your Company"}</p>
                        <p className="text-slate-400 text-[10px] truncate">{companyUser?.email || ""}</p>
                        <div className="mt-1.5">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-indigo-300 text-[9px] font-extrabold uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md self-start shadow-sm">
                                    {(companyUser?.role || "").replace(/_/g, " ")}
                                </span>
                                <p className="text-slate-500 text-[10px] leading-tight pr-2 italic">
                                    {companyUser?.role === 'company' && "Full access & job management"}
                                    {(companyUser?.role === 'hiring_manager' || companyUser?.role === 'backup_hiring_manager') && 
                                        "Manage hiring workflow & assignments"}
                                    {companyUser?.role === 'interviewer' && "Conduct interviews & message candidates"}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {items.map((item) => (
                    <button
                        key={item.tab}
                        onClick={() => goTo(item.tab)}
                        className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${activeTab === item.tab && !showCreate
                            ? "bg-white/15 text-white font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge != null && (
                            <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Settings */}
            {companyUser?.role === 'company' && (
                <div className="px-3 py-4 border-t border-white/5">
                    <button onClick={() => goTo("CompanyProfile")} className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-all">
                        <span>⚙️</span>
                        <span>Company Profile</span>
                    </button>
                </div>
            )}
        </aside>
    );
}
