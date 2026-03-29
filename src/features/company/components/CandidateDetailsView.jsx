import { useState, useEffect } from "react";
import { companyService } from "../../../services/companyService";
import { getCompanyId } from "../../../utils/auth";

/* ─── Helpers ────────────────────────────────────────────────── */
function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Score Ring ─────────────────────────────────────────────── */
function ScoreRing({ score }) {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const filled = circ - (score / 100) * circ;
    const color = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";
    return (
        <div className="relative" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="55" cy="55" r={r} fill="none" strokeWidth="9" stroke="#f1f5f9" />
                <circle
                    cx="55" cy="55" r={r} fill="none" strokeWidth="9"
                    stroke={color} strokeDasharray={circ} strokeDashoffset={filled}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{score}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 1 }}>/ 100</span>
            </div>
        </div>
    );
}

/* ─── Status pill ────────────────────────────────────────────── */
const STATUS_STYLES = {
    applied: { bg: "#eff6ff", color: "#2563eb", label: "Applied" },
    shortlisted: { bg: "#f0fdf4", color: "#16a34a", label: "Shortlisted" },
    interviewed: { bg: "#fdf4ff", color: "#9333ea", label: "Interviewed" },
    selected: { bg: "#ecfdf5", color: "#059669", label: "Selected" },
    rejected: { bg: "#fff1f2", color: "#e11d48", label: "Rejected" },
};
function StatusPill({ status }) {
    const s = STATUS_STYLES[status] || { bg: "#f8fafc", color: "#64748b", label: status };
    return (
        <span style={{ background: s.bg, color: s.color, padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, letterSpacing: 0.4 }}>
            {s.label}
        </span>
    );
}

/* ─── Section wrapper ────────────────────────────────────────── */
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

function Field({ label, children }) {
    return (
        <div>
            <span style={{ display: "block", fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{children}</div>
        </div>
    );
}

/* ─── Severity badge ─────────────────────────────────────────── */
const SEV = {
    critical: { bg: "#fff1f2", color: "#e11d48" },
    major: { bg: "#fffbeb", color: "#d97706" },
    minor: { bg: "#f8fafc", color: "#64748b" },
};
function SevBadge({ sev }) {
    const s = SEV[sev] || SEV.minor;
    return (
        <span style={{ background: s.bg, color: s.color, borderRadius: 99, padding: "2px 10px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
            {sev}
        </span>
    );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CandidateDetailsView({ application, onBack, onStatusChange }) {
    const { candidate, job, resume, appliedAt, status: initStatus, notes } = application;

    const [status, setStatus] = useState(initStatus);
    const [expandedEval, setExpandedEval] = useState(null);
    const [testData, setTestData] = useState(null);
    const [testLoading, setTestLoading] = useState(true);

    const statusOptions = ["applied", "shortlisted", "interviewed", "selected", "rejected"];

    useEffect(() => {
        let cancelled = false;
        const fetchTestResults = async () => {
            const companyId = getCompanyId();
            const candidateId = candidate?._id;
            if (!companyId || !candidateId) { setTestLoading(false); return; }
            try {
                const res = await companyService.getCandidateTestResults(companyId, candidateId);
                if (!cancelled && res?.data?.hasTestData) {
                    setTestData(res.data.testData);
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
      `}</style>

            <div style={{  margin: "0 auto" }}>

                {/* ── TOP HEADER ── */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", padding: "24px 28px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <button
                            onClick={onBack}
                            style={{
                                background: "#f1f5f9",
                                border: "none",
                                borderRadius: "12px",
                                padding: "10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                color: "#64748b",
                                transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => e.target.style.background = "#e2e8f0"}
                            onMouseOut={(e) => e.target.style.background = "#f1f5f9"}
                        >
                            ←
                        </button>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                            {candidate.name.charAt(0)}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{candidate.name}</h1>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12.5, color: "#64748b", fontWeight: 500 }}>
                                <span>✉️ {candidate.email}</span>
                                {candidate.phone && <span>📞 {candidate.phone}</span>}
                                <span>📅 Applied {fmtDate(appliedAt)}</span>
                            </div>
                        </div>
                    </div>
                    <StatusPill status={status} />
                </div>

                {/* ── TWO COLUMNS ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* LEFT ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Job Info */}
                        <Card>
                            <SectionLabel icon="🏢">Job Information</SectionLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <Field label="Position">{job.jobTitle}</Field>
                                <Field label="Type">{job.jobType}</Field>
                                <Field label="Department">{job.department}</Field>
                                <Field label="Resume">
                                    {resume?.url
                                        ? <a href={resume.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6366f1", fontWeight: 700, fontSize: 12.5, background: "#f0f0ff", padding: "4px 12px", borderRadius: 8 }}>📄 {resume.filename || "View Resume"}</a>
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
                                    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
                                </div>
                            ) : !testData ? (
                                <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8" }}>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>No Assessment Taken</div>
                                    <div style={{ fontSize: 12, marginTop: 4 }}>Candidate hasn't completed a skill test yet.</div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                                    {/* Score + meta */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                                        <ScoreRing score={testData.overallScore} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                            <Field label="Rating">
                                                <span style={{ color: "#6366f1", fontWeight: 800 }}>{testData.rating}</span>
                                            </Field>
                                            <Field label="Type">{testData.testType}</Field>
                                            {testData.testDate && <Field label="Date">{fmtDate(testData.testDate)}</Field>}
                                            {testData.violationCount > 0 && (
                                                <span style={{ fontSize: 11, background: "#fffbeb", color: "#b45309", borderRadius: 8, padding: "4px 10px", fontWeight: 700, display: "inline-block" }}>
                                                    ⚠️ {testData.violationCount} proctoring violation{testData.violationCount > 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    {testData.summary && (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                            {[
                                                { label: "Passed", val: testData.summary.passedCount, color: "#22c55e" },
                                                { label: "Penalty", val: testData.summary.totalPenalty, color: "#f59e0b" },
                                                { label: "Mismatches", val: testData.summary.criticalMismatches, color: "#ef4444" },
                                            ].map(({ label, val, color }) => (
                                                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1.5px solid #f1f5f9" }}>
                                                    <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{val}</div>
                                                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {testData.skillsTested?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Skills Tested</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                                {testData.skillsTested.map((s, i) => (
                                                    <span key={i} className="tag">
                                                        {s.skill}
                                                        <span className="tag-diff">{s.difficulty}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mismatches */}
                                    {testData.technicalAnalysis?.mismatches?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Technical Mismatches</div>
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

                                    {/* AI Evaluations */}
                                    {testData.evaluations?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>AI Code Evaluations</div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                {testData.evaluations.map((ev, i) => (
                                                    <div key={i} style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 12, overflow: "hidden" }}>
                                                        <button
                                                            className="eval-toggle"
                                                            onClick={() => setExpandedEval(expandedEval === i ? null : i)}
                                                            style={{ width: "100%", background: "transparent", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                                                        >
                                                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#334155", textAlign: "left" }}>
                                                                Problem {i + 1}: {typeof ev.problem === 'string' ? ev.problem.slice(0, 55) : String(ev.problem).slice(0, 55)}…
                                                            </span>
                                                            <span style={{ color: "#6366f1", fontSize: 11, flexShrink: 0 }}>{expandedEval === i ? "▲ Hide" : "▼ Show"}</span>
                                                        </button>
                                                        {expandedEval === i && (
                                                            <div className="fade-in" style={{ padding: "0 14px 14px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 12 }}>
                                                                <div style={{ paddingTop: 12 }}>
                                                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Problem</div>
                                                                    <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6 }}>{ev?.problem}</p>
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Solution</div>
                                                                    <pre style={{ fontSize: 11.5, background: "#0f172a", color: "#e2e8f0", padding: 14, borderRadius: 10, overflowX: "auto", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
                                                                        {ev.solution}
                                                                    </pre>
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>AI Verdict</div>
                                                                    <p style={{ fontSize: 12.5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", color: "#166534", lineHeight: 1.6 }}>{ev.evaluation}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Non-Technical */}
                                    {testData.nonTechnicalProblems?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Non-Technical Questions</div>
                                            {testData.nonTechnicalProblems.map((q, i) => (
                                                <div key={i} style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 12, padding: "12px 14px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                                                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>{q.title}</span>
                                                        {q.skill && <span style={{ fontSize: 10, background: "#f0f4ff", color: "#6366f1", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{q.skill}</span>}
                                                        {q.questionType && <span style={{ fontSize: 10, background: "#f8fafc", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{q.questionType}</span>}
                                                    </div>
                                                    <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{q.jobDescription}</p>
                                                    {q.timeSpent != null && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>⏱ {q.timeSpent}s spent</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {testData.summary?.recommendations?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Recommendations</div>
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

                    {/* RIGHT ── */}
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
                                            onClick={() => {
    setStatus(opt);
    onStatusChange(opt);
}}
                                            style={{
                                                border: isCurrent ? "2px solid transparent" : "1.5px solid #e2e8f0",
                                                background: isCurrent ? s.color : "#fff",
                                                color: isCurrent ? "#fff" : "#334155",
                                                borderRadius: 10,
                                                padding: "10px 16px",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                textAlign: "left",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                opacity: 1,
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

                        {/* Quick guide */}
                        <Card style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
                            <SectionLabel icon="💡">How to read this page</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    ["Score Ring", "The circle on the left shows the candidate's overall test score out of 100."],
                                    ["Passed / Penalty / Mismatches", "Quick summary of how many questions were answered correctly, how many carried a penalty, and how many answers didn't match expected results."],
                                    ["Severity Badges", "Critical = major impact on role; Major = noticeable gap; Minor = small slip."],
                                    ["AI Verdict", "An AI-generated evaluation of the candidate's coding solution — expand any problem to read it."],
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