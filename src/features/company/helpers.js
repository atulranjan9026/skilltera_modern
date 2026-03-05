// ─── Date Formatters ──────────────────────────────────────────────────────────
export const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const fmtShort = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "—";

export const daysLeft = (iso) =>
    iso ? Math.ceil((new Date(iso) - new Date()) / 86_400_000) : null;
