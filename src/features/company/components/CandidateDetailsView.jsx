import { useState, useEffect } from "react";
import { companyService } from "../../../services/companyService";
import { getCompanyId } from "../../../utils/auth";

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtDateTime(d) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ScoreRing({ score }) {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const filled = circ - (score / 100) * circ;
    const color = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";
    return (
        <div className="relative" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="55" cy="55" r={r} fill="none" strokeWidth="9" stroke="#f1f5f9" />
                <circle cx="55" cy="55" r={r} fill="none" strokeWidth="9"
                    stroke={color} strokeDasharray={circ} strokeDashoffset={filled}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{score}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 1 }}>/ 100</span>
            </div>
        </div>
    );
}

const STATUS_STYLES = {
    applied:     { bg: "#eff6ff", color: "#2563eb", label: "Applied" },
    shortlisted: { bg: "#f0fdf4", color: "#16a34a", label: "Shortlisted" },
    interviewed: { bg: "#fdf4ff", color: "#9333ea", label: "Interviewed" },
    selected:    { bg: "#ecfdf5", color: "#059669", label: "Selected" },
    rejected:    { bg: "#fff1f2", color: "#e11d48", label: "Rejected" },
};

function StatusPill({ status }) {
    const s = STATUS_STYLES[status] || { bg: "#f8fafc", color: "#64748b", label: status };
    return (
        <span style={{ background: s.bg, color: s.color, padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, letterSpacing: 0.4 }}>
            {s.label}
        </span>
    );
}

function Card({ children, style }) {
    return (
        <div style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16, padding: "20px 22px", ...style }}>
            {children}
        </div>
    );
}

function SectionLabel({ icon, children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: "#94a3b8", textTransform: "uppercase" }}>{children}</span>
        </div>
    );
}

function SubLabel({ children }) {
    return (
        <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <span style={{ display: "block", fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{children}</div>
        </div>
    );
}

const SEV = {
    critical: { bg: "#fff1f2", color: "#e11d48" },
    major:    { bg: "#fffbeb", color: "#d97706" },
    minor:    { bg: "#f8fafc", color: "#64748b" },
};

function SevBadge({ sev }) {
    const s = SEV[sev] || SEV.minor;
    return (
        <span style={{ background: s.bg, color: s.color, borderRadius: 99, padding: "2px 10px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
            {sev}
        </span>
    );
}

// ─── NEW: Collapsible Violations List ───────────────────────────────────────
function ViolationsPanel({ violations = [], count }) {
    const [open, setOpen] = useState(false);
    if (!count || count === 0) return null;

    // Group consecutive same-type violations to reduce noise
    const grouped = [];
    violations.forEach((v) => {
        const last = grouped[grouped.length - 1];
        if (last && last.alert === v.alert) {
            last.times.push(v.timestamp);
        } else {
            grouped.push({ type: v.type, alert: v.alert, times: [v.timestamp] });
        }
    });

    return (
        <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, overflow: "hidden" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{ width: "100%", background: "transparent", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#c2410c" }}>
                        {count} Proctoring Violation{count !== 1 ? "s" : ""} Detected
                    </span>
                </div>
                <span style={{ fontSize: 11, color: "#c2410c" }}>{open ? "▲ Hide" : "▼ Details"}</span>
            </button>

            {open && (
                <div className="fade-in" style={{ borderTop: "1px solid #fed7aa", padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {grouped.map((g, i) => (
                        <div key={i} style={{ background: "#fff", border: "1px solid #fdba74", borderRadius: 9, padding: "9px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#7c2d12" }}>{g.alert}</span>
                                <span style={{ fontSize: 10, background: "#fee2e2", color: "#b91c1c", borderRadius: 99, padding: "2px 9px", fontWeight: 800 }}>
                                    ×{g.times.length}
                                </span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {g.times.map((t, j) => (
                                    <span key={j} style={{ fontSize: 10, background: "#fff7ed", color: "#9a3412", borderRadius: 6, padding: "2px 7px", fontFamily: "'DM Mono', monospace" }}>
                                        {new Date(t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                    </span>
                                ))}
                            </div>
                            <div style={{ fontSize: 10, color: "#9a3412", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Type: {g.type}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── NEW: Condition Skills / Candidate Profile Panel ─────────────────────────
function ConditionSkillsPanel({ data }) {
    if (!data) return null;
    const hasContent = data.overallExperience != null || data.roleYouWant || data.skillsRating?.length > 0;
    if (!hasContent) return null;

    return (
        <div>
            <SubLabel>Candidate Profile (Self-Reported)</SubLabel>
            <div style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {data.overallExperience != null && (
                        <Field label="Overall Experience">
                            {data.overallExperience} yr{data.overallExperience !== 1 ? "s" : ""}
                        </Field>
                    )}
                    {data.roleYouWant && (
                        <Field label="Desired Role">{data.roleYouWant}</Field>
                    )}
                </div>
                {data.skillsRating?.length > 0 && (
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Skills Self-Rating</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                            {data.skillsRating.map((s, i) => (
                                <div key={i} style={{ background: "#f0f4ff", borderRadius: 8, padding: "5px 11px", display: "flex", alignItems: "center", gap: 7 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#3730a3" }}>{s.skill || s.name}</span>
                                    {s.rating != null && (
                                        <span style={{ fontSize: 11, background: "#e0e7ff", color: "#4338ca", borderRadius: 5, padding: "1px 7px", fontWeight: 800 }}>
                                            {s.rating}/10
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── NEW: Self Intro Videos Panel ────────────────────────────────────────────
function SelfIntroPanel({ selfIntro = [] }) {
    const [expandedIdx, setExpandedIdx] = useState(null);
    if (!selfIntro || selfIntro.length === 0) return null;

    return (
        <div>
            <SubLabel>🎥 Self Introduction Videos</SubLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selfIntro.map((item, i) => (
                    <div key={i} style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 12, overflow: "hidden" }}>
                        <button
                            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                            style={{ width: "100%", background: "transparent", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                        >
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#334155", textAlign: "left" }}>
                                Q{i + 1}: {item.question}
                            </span>
                            <span style={{ fontSize: 11, color: "#6366f1", flexShrink: 0 }}>
                                {expandedIdx === i ? "▲ Hide" : "▼ Show"}
                            </span>
                        </button>

                        {expandedIdx === i && (
                            <div className="fade-in" style={{ borderTop: "1px solid #f1f5f9", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                                {/* Video Player */}
                                {item.videoFile && (
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Video Response</div>
                                        <video
                                            controls
                                            style={{ width: "100%", borderRadius: 10, background: "#0f172a", maxHeight: 220 }}
                                            src={item.videoFile}
                                        >
                                            Your browser does not support video.
                                        </video>
                                    </div>
                                )}

                                {/* Transcript */}
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Transcript</div>
                                    {item.audioText && item.audioText !== "No transcript available" ? (
                                        <p style={{ fontSize: 12.5, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "10px 14px", color: "#0c4a6e", lineHeight: 1.65 }}>
                                            {item.audioText}
                                        </p>
                                    ) : (
                                        <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No transcript available for this response.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── NEW: Environment Scan Panel ─────────────────────────────────────────────
function EnvScanPanel({ envScan = [] }) {
    if (!envScan || envScan.length === 0) return null;
    return (
        <div>
            <SubLabel>🖥️ Environment Scan</SubLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {envScan.map((item, i) => (
                    <div key={i} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 13px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#334155" }}>{item.label || item.check || `Scan #${i + 1}`}</span>
                        {item.status && (
                            <span style={{
                                fontSize: 10, fontWeight: 800, borderRadius: 99, padding: "2px 10px",
                                background: item.status === "pass" ? "#f0fdf4" : "#fff1f2",
                                color: item.status === "pass" ? "#16a34a" : "#e11d48",
                            }}>
                                {item.status.toUpperCase()}
                            </span>
                        )}
                        {item.value && <span style={{ fontSize: 11, color: "#64748b" }}>{item.value}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── NEW: Solution File URLs Panel ───────────────────────────────────────────
function SolutionFilesPanel({ urls = [] }) {
    if (!urls || urls.length === 0) return null;
    return (
        <div>
            <SubLabel>📁 Submitted Solution Files</SubLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {urls.map((url, i) => {
                    const name = url.split("/").pop() || `Solution ${i + 1}`;
                    return (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#f0f4ff", color: "#4338ca", border: "1.5px solid #c7d2fe", borderRadius: 9, padding: "7px 13px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                        >
                            📄 {name}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default function CandidateDetailsView({ application, onBack, onStatusChange }) {
    const { candidate, job, resume, appliedAt, status: initStatus, notes } = application;

    const [status, setStatus]             = useState(initStatus);
    const [expandedEval, setExpandedEval] = useState(null);
    const [testData, setTestData]         = useState(null);
    const [testLoading, setTestLoading]   = useState(true);
    // Raw full response stored for fields outside testData
    const [rawData, setRawData]           = useState(null);

    const statusOptions = ["applied", "shortlisted", "interviewed", "selected", "rejected"];

    useEffect(() => {
        let cancelled = false;
        const fetchTestResults = async () => {
            const companyId   = getCompanyId();
            const candidateId = candidate?._id;
            if (!companyId || !candidateId) { setTestLoading(false); return; }
            try {
                const res = await companyService.getCandidateTestResults(companyId, candidateId);
                if (!cancelled && res?.data?.hasTestData) {
                    setTestData(res.data.testData);
                    setRawData(res.data.testData);   // keep full object
                }
            } catch { /* silent */ }
            finally { if (!cancelled) setTestLoading(false); }
        };
        fetchTestResults();
        return () => { cancelled = true; };
    }, [candidate?._id]);

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f8fafc", padding: "24px 16px" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; font-family: inherit; }
        a { text-decoration: none; }
        .eval-toggle:hover { background: #f8fafc !important; }
        .status-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
        .status-btn { transition: all 0.15s; }
        .tag { display: inline-flex; align-items: center; gap: 6px; background: #f0f4ff; color: #4f6ef7; border-radius: 8px; padding: 4px 10px; font-size: 11.5px; font-weight: 700; }
        .tag-diff { font-size: 10px; background: #e0e7ff; color: #4338ca; border-radius: 5px; padding: 2px 7px; }
        .rec-item { display: flex; gap: 10px; align-items: flex-start; background: #f8fafc; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; font-size: 12.5px; color: #334155; line-height: 1.55; }
        .rec-arrow { color: #6366f1; font-size: 14px; flex-shrink: 0; margin-top: 1px; }
        .fade-in { animation: fadein 0.3s ease; }
        @keyframes fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        video:focus { outline: none; }
      `}</style>

            <div style={{ margin: "0 auto" }}>

                {/* HEADER */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", padding: "24px 28px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <button
                            onClick={onBack}
                            style={{ background: "#f1f5f9", border: "none", borderRadius: "12px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#64748b", transition: "all 0.2s" }}
                            onMouseOver={e => e.currentTarget.style.background = "#e2e8f0"}
                            onMouseOut={e => e.currentTarget.style.background = "#f1f5f9"}
                        >←</button>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                            {candidate?.name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{candidate?.name}</h1>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12.5, color: "#64748b", fontWeight: 500 }}>
                                {candidate?.email && <span>✉️ {candidate.email}</span>}
                                {candidate?.phone && <span>📞 {candidate.phone}</span>}
                                {appliedAt && <span>📅 Applied {fmtDate(appliedAt)}</span>}
                            </div>
                        </div>
                    </div>
                    <StatusPill status={status} />
                </div>

                {/* TWO COLUMNS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* LEFT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Job Info */}
                        <Card>
                            <SectionLabel icon="🏢">Job Information</SectionLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {job?.jobTitle   && <Field label="Position">{job.jobTitle}</Field>}
                                {job?.jobType    && <Field label="Type">{job.jobType}</Field>}
                                {job?.department && <Field label="Department">{job.department}</Field>}
                                <Field label="Resume">
                                    {resume?.url
                                        ? <a href={resume.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6366f1", fontWeight: 700, fontSize: 12.5, background: "#f0f0ff", padding: "4px 12px", borderRadius: 8 }}>
                                            📄 {resume.filename || "View Resume"}
                                          </a>
                                        : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No resume</span>}
                                </Field>
                            </div>
                        </Card>

                        {/* Assessment */}
                        <Card style={{ background: "linear-gradient(135deg,#fafaff,#f0f4ff)", border: "1.5px solid #e0e7ff" }}>
                            <SectionLabel icon="🧪">Skill Assessment</SectionLabel>

                            {testLoading ? (
                                <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8" }}>
                                    <div style={{ width: 24, height: 24, border: "3px solid #e0e7ff", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
                                </div>
                            ) : !testData ? (
                                <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8" }}>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>No Assessment Taken</div>
                                    <div style={{ fontSize: 12, marginTop: 4 }}>Candidate hasn't completed a skill test yet.</div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                                    {/* ── Score + Meta ── */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                                        <ScoreRing score={testData.overallScore ?? 0} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                            {testData.rating   && <Field label="Rating"><span style={{ color: "#6366f1", fontWeight: 800 }}>{testData.rating}</span></Field>}
                                            {testData.testType && <Field label="Type">{testData.testType}</Field>}
                                            {testData.testDate && <Field label="Date">{fmtDate(testData.testDate)}</Field>}
                                        </div>
                                    </div>

                                    {/* ── Violations Banner ── (expanded list) */}
                                    <ViolationsPanel
                                        violations={rawData?.violations ?? []}
                                        count={rawData?.violationCount ?? 0}
                                    />

                                    {/* ── Stats row ── */}
                                    {testData.summary && (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                            {[
                                                { label: "Passed",     val: testData.summary.passedCount,        color: "#22c55e" },
                                                { label: "Penalty",    val: testData.summary.totalPenalty,       color: "#f59e0b" },
                                                { label: "Mismatches", val: testData.summary.criticalMismatches, color: "#ef4444" },
                                            ].map(({ label, val, color }) => (
                                                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1.5px solid #f1f5f9" }}>
                                                    <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{val}</div>
                                                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* ── NEW: Condition Skills / Self-Reported Profile ── */}
                                    <ConditionSkillsPanel data={rawData?.conditionSkills} />

                                    {/* ── Skills Tested ── */}
                                    {testData.skillsTested?.length > 0 && (
                                        <div>
                                            <SubLabel>Skills Tested</SubLabel>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                                {testData.skillsTested.map((s, i) => (
                                                    <span key={i} className="tag">
                                                        {s.skill}
                                                        {s.difficulty && <span className="tag-diff">{s.difficulty}</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── NEW: Self Intro Videos ── */}
                                    <SelfIntroPanel selfIntro={rawData?.selfIntro} />

                                    {/* ── NEW: Environment Scan ── */}
                                    <EnvScanPanel envScan={rawData?.envScan} />

                                    {/* ── Technical Mismatches ── */}
                                    {testData.technicalAnalysis?.mismatches?.length > 0 && (
                                        <div>
                                            <SubLabel>Technical Mismatches</SubLabel>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                {testData.technicalAnalysis.mismatches.map((m, i) => (
                                                    <div key={i} style={{ background: "#fff", border: "1.5px solid #fde68a", borderRadius: 12, padding: "12px 14px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>{m.problem}</span>
                                                            <SevBadge sev={m.severity} />
                                                        </div>
                                                        <div style={{ display: "flex", gap: 16, fontSize: 11.5, color: "#64748b" }}>
                                                            <span>Expected: <strong style={{ color: "#16a34a" }}>{m.expected}</strong></span>
                                                            <span>Got: <strong style={{ color: "#e11d48" }}>{m.submitted}</strong></span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── AI Code Evaluations ── */}
                                    {testData.evaluations?.length > 0 && (
                                        <div>
                                            <SubLabel>AI Code Evaluations</SubLabel>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                {testData.evaluations.map((ev, i) => {
                                                    const problemTitle = typeof ev.problem === "string"
                                                        ? ev.problem
                                                        : ev.problem?.title ?? ev.problem?.jobDescription ?? `Problem ${i + 1}`;
                                                    const problemBody = typeof ev.problem === "string"
                                                        ? ev.problem
                                                        : ev.problem?.jobDescription ?? "";
                                                    const feedbackText = typeof ev.evaluation === "string"
                                                        ? ev.evaluation
                                                        : ev.evaluation?.feedback ?? "";
                                                    const evalObj = typeof ev.evaluation === "object" ? ev.evaluation : null;

                                                    return (
                                                        <div key={i} style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 12, overflow: "hidden" }}>
                                                            <button
                                                                className="eval-toggle"
                                                                onClick={() => setExpandedEval(expandedEval === i ? null : i)}
                                                                style={{ width: "100%", background: "transparent", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                                                            >
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                                                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#334155", textAlign: "left" }}>
                                                                        Problem {i + 1}: {String(problemTitle).slice(0, 50)}{String(problemTitle).length > 50 ? "…" : ""}
                                                                    </span>
                                                                    {/* Language + Difficulty badges */}
                                                                    {ev.problem?.language && (
                                                                        <span style={{ fontSize: 10, background: "#f0fdf4", color: "#16a34a", borderRadius: 6, padding: "2px 7px", fontWeight: 800, flexShrink: 0 }}>
                                                                            {ev.problem.language}
                                                                        </span>
                                                                    )}
                                                                    {ev.problem?.difficulty && (
                                                                        <span style={{ fontSize: 10, background: "#fef3c7", color: "#b45309", borderRadius: 6, padding: "2px 7px", fontWeight: 800, flexShrink: 0 }}>
                                                                            {ev.problem.difficulty}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span style={{ color: "#6366f1", fontSize: 11, flexShrink: 0 }}>{expandedEval === i ? "▲ Hide" : "▼ Show"}</span>
                                                            </button>

                                                            {expandedEval === i && (
                                                                <div className="fade-in" style={{ padding: "0 14px 14px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 12 }}>

                                                                    {/* NEW: Scores row */}
                                                                    {evalObj && (
                                                                        <div style={{ paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                                                            {[
                                                                                { label: "Base Score",  val: evalObj.baseScore,  color: "#6366f1" },
                                                                                { label: "Final Score", val: evalObj.finalScore, color: evalObj.isPassing ? "#22c55e" : "#ef4444" },
                                                                                { label: "Passing",     val: evalObj.isPassing ? "✓ Yes" : "✗ No", color: evalObj.isPassing ? "#22c55e" : "#ef4444" },
                                                                            ].map(({ label, val, color }) => (
                                                                                <div key={label} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px", textAlign: "center", border: "1.5px solid #f1f5f9" }}>
                                                                                    <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{val}</div>
                                                                                    <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.7 }}>{label}</div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Tech Penalty */}
                                                                    {evalObj?.techPenalty && evalObj.techPenalty.points !== 0 && (
                                                                        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 9, padding: "8px 12px", fontSize: 12, color: "#92400e", fontWeight: 600 }}>
                                                                            ⚠️ Tech Penalty: <strong>{evalObj.techPenalty.points} pts</strong>
                                                                            {evalObj.techPenalty.reason && ` — ${evalObj.techPenalty.reason}`}
                                                                        </div>
                                                                    )}

                                                                    {/* Problem statement */}
                                                                    {problemBody && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Problem</div>
                                                                            <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6 }}>{problemBody}</p>
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Requirements */}
                                                                    {ev.problem?.requirements?.length > 0 && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Requirements</div>
                                                                            <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                                                                                {ev.problem.requirements.map((r, ri) => (
                                                                                    <li key={ri} style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{r}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Test Cases */}
                                                                    {ev.problem?.test_cases?.length > 0 && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Test Cases</div>
                                                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                                                {ev.problem.test_cases.map((tc, ti) => (
                                                                                    <div key={ti} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 9, padding: "9px 12px" }}>
                                                                                        <div style={{ display: "flex", gap: 14, fontSize: 11.5, fontFamily: "'DM Mono', monospace", flexWrap: "wrap", marginBottom: 4 }}>
                                                                                            <span><strong style={{ color: "#64748b" }}>In:</strong> {tc.input}</span>
                                                                                            <span><strong style={{ color: "#64748b" }}>Out:</strong> <span style={{ color: "#16a34a", fontWeight: 700 }}>{tc.output}</span></span>
                                                                                        </div>
                                                                                        {tc.explanation && (
                                                                                            <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, marginTop: 2 }}>{tc.explanation}</p>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Hints */}
                                                                    {ev.problem?.hints?.length > 0 && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Hints</div>
                                                                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                                                                {ev.problem.hints.map((h, hi) => (
                                                                                    <div key={hi} style={{ display: "flex", gap: 8, fontSize: 12, color: "#475569", background: "#fafafa", borderRadius: 8, padding: "7px 10px" }}>
                                                                                        <span style={{ color: "#6366f1", flexShrink: 0 }}>💡</span> {h}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Related Concepts */}
                                                                    {ev.problem?.relatedConcepts?.length > 0 && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Related Concepts</div>
                                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                                                {ev.problem.relatedConcepts.map((c, ci) => (
                                                                                    <span key={ci} style={{ background: "#ede9fe", color: "#5b21b6", borderRadius: 7, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{c}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Evaluation Criteria */}
                                                                    {ev.problem?.evaluation_criteria?.length > 0 && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Evaluation Criteria</div>
                                                                            <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                                                                                {ev.problem.evaluation_criteria.map((c, ci) => (
                                                                                    <li key={ci} style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{c}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: I/O Format */}
                                                                    {(ev.problem?.input_format || ev.problem?.output_format) && (
                                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                                                            {ev.problem.input_format && (
                                                                                <div style={{ background: "#f0fdf4", borderRadius: 9, padding: "9px 12px" }}>
                                                                                    <div style={{ fontSize: 9, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Input Format</div>
                                                                                    <p style={{ fontSize: 11.5, color: "#166534" }}>{ev.problem.input_format}</p>
                                                                                </div>
                                                                            )}
                                                                            {ev.problem.output_format && (
                                                                                <div style={{ background: "#eff6ff", borderRadius: 9, padding: "9px 12px" }}>
                                                                                    <div style={{ fontSize: 9, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Output Format</div>
                                                                                    <p style={{ fontSize: 11.5, color: "#1e40af" }}>{ev.problem.output_format}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* NEW: Constraints */}
                                                                    {ev.problem?.constraints?.length > 0 && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Constraints</div>
                                                                            <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                                                                                {ev.problem.constraints.map((c, ci) => (
                                                                                    <li key={ci} style={{ fontSize: 11.5, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{c}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* Solution code */}
                                                                    {ev.solution && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Submitted Solution</div>
                                                                            <pre style={{ fontSize: 11.5, background: "#0f172a", color: "#e2e8f0", padding: 14, borderRadius: 10, overflowX: "auto", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
                                                                                {ev.solution}
                                                                            </pre>
                                                                        </div>
                                                                    )}

                                                                    {/* AI Verdict */}
                                                                    {feedbackText && (
                                                                        <div>
                                                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>AI Verdict</div>
                                                                            <p style={{ fontSize: 12.5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", color: "#166534", lineHeight: 1.6 }}>
                                                                                {feedbackText}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Non-Technical Questions */}
                                    {testData.nonTechnicalProblems?.length > 0 && (
                                        <div>
                                            <SubLabel>Non-Technical Questions</SubLabel>
                                            {testData.nonTechnicalProblems.map((q, i) => (
                                                <div key={i} style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                                                        {q.title && <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>{q.title}</span>}
                                                        {q.skill && <span style={{ fontSize: 10, background: "#f0f4ff", color: "#6366f1", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{q.skill}</span>}
                                                        {q.questionType && <span style={{ fontSize: 10, background: "#f8fafc", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{q.questionType}</span>}
                                                    </div>
                                                    {q.jobDescription && <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{q.jobDescription}</p>}
                                                    {q.timeSpent != null && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>⏱ {q.timeSpent}s spent</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* ── NEW: Solution File URLs ── */}
                                    <SolutionFilesPanel urls={rawData?.solutionFileUrls} />

                                    {/* Recommendations */}
                                    {testData.summary?.recommendations?.length > 0 && (
                                        <div>
                                            <SubLabel>Recommendations</SubLabel>
                                            {testData.summary.recommendations.map((rec, i) => (
                                                <div key={i} className="rec-item">
                                                    <span className="rec-arrow">→</span>
                                                    <span>{rec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            )}
                        </Card>
                    </div>

                    {/* RIGHT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Status Changer */}
                        <Card style={{ background: "#f8f9ff", border: "1.5px solid #e0e7ff" }}>
                            <SectionLabel icon="⚡">Update Application Status</SectionLabel>
                            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>
                                Move the candidate to the next stage of your hiring pipeline.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {statusOptions.map((opt) => {
                                    const isCurrent = status === opt;
                                    const s = STATUS_STYLES[opt];
                                    return (
                                        <button
                                            key={opt}
                                            className="status-btn"
                                            disabled={isCurrent}
                                            onClick={() => { setStatus(opt); onStatusChange?.(opt); }}
                                            style={{
                                                border: isCurrent ? "2px solid transparent" : "1.5px solid #e2e8f0",
                                                background: isCurrent ? s.color : "#fff",
                                                color: isCurrent ? "#fff" : "#334155",
                                                borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700,
                                                textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
                                            }}
                                        >
                                            <span style={{ textTransform: "capitalize" }}>{opt}</span>
                                            {isCurrent && <span style={{ fontSize: 11, opacity: 0.85 }}>● Current</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Notes */}
                        {notes && (
                            <Card style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
                                <SectionLabel icon="📝">Internal Notes</SectionLabel>
                                <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.65 }}>{notes}</p>
                            </Card>
                        )}

                        {/* Guide */}
                        <Card style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
                            <SectionLabel icon="💡">How to read this page</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    ["Score Ring",                    "The circle shows the candidate's overall test score out of 100."],
                                    ["Violations Panel",              "Expands to list every proctoring alert with its timestamp and type."],
                                    ["Passed / Penalty / Mismatches", "Quick summary of correct answers, score deductions, and answer mismatches."],
                                    ["Self-Reported Profile",         "Experience, desired role, and self-rated skills entered by the candidate."],
                                    ["Self Intro Videos",             "Video responses with transcripts for each intro question."],
                                    ["Severity Badges",               "Critical = major impact; Major = noticeable gap; Minor = small slip."],
                                    ["AI Verdict",                    "AI evaluation of the coding solution — expand any problem to read it."],
                                    ["Solution Files",                "Downloadable files submitted by the candidate."],
                                ].map(([title, desc]) => (
                                    <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <span style={{ fontSize: 16, marginTop: 1 }}>›</span>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 2 }}>{title}</div>
                                            <div style={{ fontSize: 11.5, color: "#4b7c5c", lineHeight: 1.55 }}>{desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}