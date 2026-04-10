export function JobStatusBadge({ status }) {
// console.log(status);

    const cfg = {
        APPROVED: { cls: "bg-emerald-100 text-emerald-700", lbl: "Approved" },
        Pending: { cls: "bg-amber-100 text-amber-700", lbl: "Pending" },
        Closed: { cls: "bg-gray-100 text-gray-700", lbl: "Closed" },
        Draft: { cls: "bg-slate-100 text-slate-700", lbl: "Draft" },
    };
    const { cls, lbl } = cfg[status] || { cls: "bg-slate-100 text-slate-700", lbl: status };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
            {lbl}
        </span>
    );
}
