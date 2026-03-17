// ─── Date Formatters ──────────────────────────────────────────────────────────
export const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const fmtShort = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "—";

export const getRelativeTime = (d) => {
    if (!d) return "";
    const now = new Date();
    const date = new Date(d);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

export const daysLeft = (iso) =>
    iso ? Math.ceil((new Date(iso) - new Date()) / 86_400_000) : null;
