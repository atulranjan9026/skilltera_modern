import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";
import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { StatCard } from "../ui/StatCard";

export function AnalyticsTab({
    jobsLoading, appsLoading,
    totalApps, shortlisted, selected, rejected,
    applications, funnelData, weeklyTrend, appsPerJob,
}) {
    const isLoading = jobsLoading || appsLoading;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Hiring Analytics</h2>
                <p className="text-sm text-slate-500">Computed from live API data</p>
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon="📬" label="Total Applications" value={totalApps} sub="From API" color="bg-indigo-50" />
                        <StatCard icon="🎯" label="Shortlist Rate"
                            value={applications.length > 0 ? `${Math.round((shortlisted / applications.length) * 100)}%` : "—"}
                            sub={`${shortlisted} of ${applications.length}`} color="bg-sky-50" />
                        <StatCard icon="✅" label="Hire Rate"
                            value={applications.length > 0 ? `${Math.round((selected / applications.length) * 100)}%` : "—"}
                            sub={`${selected} of ${applications.length}`} color="bg-emerald-50" />
                        <StatCard icon="❌" label="Rejection Rate"
                            value={applications.length > 0 ? `${Math.round((rejected / applications.length) * 100)}%` : "—"}
                            sub={`${rejected} of ${applications.length}`} color="bg-rose-50" />
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Line chart — weekly trend */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4">Application Activity by Week</h3>
                            {weeklyTrend.length === 0 ? (
                                <EmptyState icon="📈" message="No application data" />
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={weeklyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Line type="monotone" dataKey="applied" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} name="Applied" />
                                        <Line type="monotone" dataKey="shortlisted" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} name="Shortlisted" />
                                        <Line type="monotone" dataKey="selected" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Hired" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Pie chart — status distribution */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4">Status Distribution</h3>
                            {funnelData.every((f) => f.value === 0) ? (
                                <EmptyState icon="🥧" message="No data yet" />
                            ) : (
                                <div className="flex items-center gap-4">
                                    <ResponsiveContainer width="55%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={funnelData.filter((f) => f.value > 0)}
                                                cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                                                paddingAngle={3} dataKey="value"
                                            >
                                                {funnelData.filter((f) => f.value > 0).map((e, i) => (
                                                    <Cell key={i} fill={e.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex-1 space-y-2.5">
                                        {funnelData.map((d, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                                    <span className="text-xs text-slate-600">{d.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-slate-800">{d.value}</span>
                                                    <span className="text-[10px] text-slate-400 ml-1">
                                                        ({applications.length > 0 ? Math.round((d.value / applications.length) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bar chart — apps per job */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-1">Applications per Job</h3>
                        <p className="text-[10px] text-slate-400 mb-4">Matched by job ID across current page data</p>
                        {appsPerJob.every((j) => j.applications === 0) ? (
                            <EmptyState icon="📊" message="No matching data" />
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={appsPerJob} margin={{ left: 0, right: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={0} angle={-15} textAnchor="end" height={50} />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                                    <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} name="Applications" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
