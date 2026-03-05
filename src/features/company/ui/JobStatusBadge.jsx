export function JobStatusBadge({ status, active }) {
    if (status === "APPROVED" && !active)
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                Closed
            </span>
        );

    const cfg = {
        APPROVED: { cls: "bg-emerald-100 text-emerald-700", lbl: "Approved" },
        PENDING: { cls: "bg-amber-100 text-amber-700", lbl: "Pending" },
        REJECTED: { cls: "bg-rose-100 text-rose-700", lbl: "Rejected" },
    };
    const { cls, lbl } = cfg[status] || cfg.PENDING;
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
            {lbl}
        </span>
    );
}
