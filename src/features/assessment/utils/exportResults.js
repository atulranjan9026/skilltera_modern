import html2pdf from 'html2pdf.js';

/**
 * Build a styled HTML string from evaluation data for PDF rendering.
 */
function buildResultsHTML(evalData, userName) {
  const score = evalData.overallScore ?? 0;
  const rating = evalData.rating || 'N/A';
  const evaluations = evalData.evaluations || [];
  const recommendations = evalData.summary?.recommendations || [];

  let problemRows = '';
  evaluations.forEach((item, i) => {
    const ev = item.evaluation || {};
    const pScore = ev.finalScore ?? ev.baseScore ?? 0;
    const title = item.problem?.title || `Problem ${i + 1}`;
    const feedback = ev.feedback || '';
    problemRows += `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;color:${pScore >= 70 ? '#16a34a' : '#d97706'}">${pScore}/100</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#475569;">${feedback}</td>
      </tr>`;
  });

  let recsHTML = '';
  if (recommendations.length > 0) {
    recsHTML = `
      <h3 style="margin:24px 0 8px;font-size:15px;color:#334155;">Recommendations</h3>
      <ul style="margin:0;padding-left:20px;color:#475569;font-size:13px;">
        ${recommendations.map(r => `<li style="margin-bottom:4px;">${r}</li>`).join('')}
      </ul>`;
  }

  return `
    <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:700px;margin:0 auto;padding:32px;color:#1e293b;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="font-size:22px;margin:0 0 4px;">Skilltera Assessment Results</h1>
        ${userName ? `<p style="margin:0;font-size:14px;color:#64748b;">${userName}</p>` : ''}
        <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">${new Date().toLocaleDateString()}</p>
      </div>

      <div style="text-align:center;margin-bottom:24px;">
        <span style="font-size:36px;font-weight:700;">${score}/100</span>
        <br/>
        <span style="display:inline-block;margin-top:6px;padding:4px 14px;border-radius:9999px;font-size:13px;font-weight:500;background:#f1f5f9;color:#475569;">${rating}</span>
      </div>

      ${evaluations.length > 0 ? `
        <h3 style="margin:0 0 8px;font-size:15px;color:#334155;">Problem Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #e2e8f0;">Problem</th>
              <th style="text-align:center;padding:8px 12px;border-bottom:2px solid #e2e8f0;">Score</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #e2e8f0;">Feedback</th>
            </tr>
          </thead>
          <tbody>${problemRows}</tbody>
        </table>
      ` : ''}

      ${recsHTML}
    </div>`;
}

/**
 * Format evaluation data as plain text for clipboard.
 */
function formatResultsText(evalData) {
  const lines = [];
  lines.push('Skilltera Assessment Results');
  lines.push('='.repeat(30));
  lines.push(`Overall Score: ${evalData.overallScore ?? 0}/100`);
  if (evalData.rating) lines.push(`Rating: ${evalData.rating}`);
  lines.push('');

  const evaluations = evalData.evaluations || [];
  if (evaluations.length > 0) {
    lines.push('Problem Breakdown:');
    evaluations.forEach((item, i) => {
      const ev = item.evaluation || {};
      const score = ev.finalScore ?? ev.baseScore ?? 0;
      const title = item.problem?.title || `Problem ${i + 1}`;
      lines.push(`  ${title}: ${score}/100`);
      if (ev.feedback) lines.push(`    ${ev.feedback}`);
    });
    lines.push('');
  }

  const recs = evalData.summary?.recommendations || [];
  if (recs.length > 0) {
    lines.push('Recommendations:');
    recs.forEach(r => lines.push(`  - ${r}`));
  }

  return lines.join('\n');
}

/**
 * Generate and download a PDF of the assessment results.
 */
export async function downloadPDF(evalData, user) {
  const userName = user?.displayName || user?.name || '';
  const html = buildResultsHTML(evalData, userName);

  const container = document.createElement('div');
  container.innerHTML = html;

  await html2pdf()
    .set({
      margin: [10, 10],
      filename: 'skilltera-assessment-results.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(container)
    .save();
}

/**
 * Copy formatted results text to clipboard.
 * Returns true on success, false on failure.
 */
export async function copyToClipboard(evalData) {
  const text = formatResultsText(evalData);
  await navigator.clipboard.writeText(text);
}
