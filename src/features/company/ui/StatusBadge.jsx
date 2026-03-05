import { STATUS_CFG } from "../constants";

export function StatusBadge({ status }) {
    const c = STATUS_CFG[status?.toLowerCase()] || STATUS_CFG.applied;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}
