export function JobStatusBadge({ status }) {
console.log(status);

    const cfg = {
        APPROVED: { cls: "bg-emerald-100 text-emerald-700", lbl: "Approved" },
        PENDING: { cls: "bg-amber-100 text-amber-700", lbl: "Pending" },
        REJECTED: { cls: "bg-rose-100 text-rose-700", lbl: "Rejected" },
        active: { cls: "bg-blue-100 text-blue-700", lbl: "Active" },
        "on-hold": { cls: "bg-amber-100 text-amber-700", lbl: "On Hold" },
    };
    const { cls, lbl } = cfg[status] || cfg.PENDING;
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
            {lbl}
        </span>
    );
}
