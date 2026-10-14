import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileJson, KeyRound, Loader2, RefreshCw, Send, ShieldCheck, X } from 'lucide-react';
import { fetchReviewQueue, previewOpportunityImport, submitReviewDecision } from '../api/opportunityReview.js';
import './opportunity-review.css';

const SAMPLE_IMPORT = JSON.stringify([{
  id: 'community-course-example-001',
  title: 'Community digital-skills course — replace with a verified listing',
  summary: 'Illustrative draft only. Replace this example with accurate, source-reviewed information before publishing.',
  type: 'COURSE', provider: 'Example provider', locationLabel: 'Confirm coverage',
  sourceName: 'SWAYAM', sourceUrl: 'https://swayam.gov.in/search_courses',
  applicationUrl: 'https://swayam.gov.in/search_courses', opensOn: null, deadline: null,
  languageCodes: ['en'], tags: ['digital skills', 'example'], eligibleEducationLevels: [], eligibleStates: [],
  minAge: null, maxAge: null, maxAnnualFamilyIncomeInr: null, eligibilityRulesConfigured: false,
  requiredDocuments: [], applicationInstruction: 'Open the source and confirm current details.'
}], null, 2);

export default function OpportunityReviewWorkbench({ onClose }) {
  const [token, setToken] = useState('');
  const [jsonText, setJsonText] = useState(SAMPLE_IMPORT);
  const [queue, setQueue] = useState([]);
  const [previewed, setPreviewed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});
  const [status, setStatus] = useState('PENDING');

  const importFile = async (file) => {
    if (!file) return;
    try { setJsonText(await file.text()); setError(''); setMessage(`Loaded ${file.name}. Review the JSON before previewing.`); }
    catch { setError('Could not read this file. Use a UTF-8 JSON file.'); }
  };

  const runPreview = async (event) => {
    event.preventDefault(); setLoading(true); setError(''); setMessage(''); setPreviewed([]);
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error('The import must be a JSON array of opportunity records.');
      const result = await previewOpportunityImport(token, parsed);
      setPreviewed(result); setMessage(`${result.length} record(s) staged for human review. Nothing is published automatically.`);
      await loadQueue();
    } catch (err) { setError(err instanceof SyntaxError ? 'The JSON could not be parsed. Check commas, quotation marks and brackets.' : err.message || 'Preview failed.'); }
    finally { setLoading(false); }
  };

  const loadQueue = async () => {
    if (!token.trim()) { setError('Enter the reviewer token for this local prototype.'); return; }
    setLoading(true); setError('');
    try { setQueue(await fetchReviewQueue(token, status)); }
    catch (err) { setError(err.message || 'Could not load the review queue.'); }
    finally { setLoading(false); }
  };

  const decide = async (item, approved) => {
    setLoading(true); setError(''); setMessage('');
    try {
      await submitReviewDecision(token, item.reviewId, approved, notes[item.reviewId] || '');
      setMessage(approved ? 'Record approved and added to the prototype catalogue.' : 'Record rejected; it was not published.');
      await loadQueue();
    } catch (err) { setError(err.message || 'Review decision failed.'); }
    finally { setLoading(false); }
  };

  return <div className="op-review-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="op-review-modal" role="dialog" aria-modal="true" aria-labelledby="op-review-title">
      <header className="op-review-head"><div className="op-review-head__icon"><ClipboardCheck size={21} /></div><div><span className="op-review-kicker">CURATION WORKSPACE · PROTOTYPE</span><h2 id="op-review-title">Opportunity source review</h2><p>Import candidate records, inspect validation findings and explicitly approve or reject each listing.</p></div><button onClick={onClose} className="op-review-close" aria-label="Close review workspace"><X size={18} /></button></header>
      <div className="op-review-warning"><ShieldCheck size={16} /><span>The reviewer token is held in this page's memory only. The endpoint uses a prototype token gate, not production identity/access management. Do not expose it on a public deployment.</span></div>
      <label className="op-review-label"><span><KeyRound size={14} /> Local reviewer token</span><input type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Enter APP_REVIEWER_TOKEN" /></label>
      <form className="op-review-import" onSubmit={runPreview}>
        <div className="op-review-form-head"><div><FileJson size={17} /><strong>Import preview</strong></div><label className="op-review-file">Choose JSON file<input type="file" accept="application/json,.json" onChange={(event) => importFile(event.target.files?.[0])} /></label></div>
        <textarea value={jsonText} onChange={(event) => setJsonText(event.target.value)} spellCheck="false" rows={11} aria-label="Opportunity JSON records" />
        <div className="op-review-actions"><span>HTTPS sources only · dates checked · source provenance required</span><button type="submit" disabled={loading || !token.trim()}>{loading ? <Loader2 size={15} className="op-spin" /> : <Send size={15} />}Preview and stage</button></div>
      </form>
      {previewed.length > 0 && <div className="op-review-results"><h3>Latest preview results</h3>{previewed.map((item) => <div className="op-review-item" key={item.reviewId}><div><strong>{item.candidate.title}</strong><small>{item.reviewStatus} · {item.candidate.sourceName}</small></div><div className="op-review-findings">{item.findings?.length ? item.findings.map((finding, index) => <p key={`${finding.code}-${index}`} className={`finding-${finding.severity.toLowerCase()}`}><AlertTriangle size={13} /><span><b>{finding.code}</b> — {finding.message}</span></p>) : <p className="finding-ok"><CheckCircle2 size={13} />No validation findings. Human approval is still required.</p>}</div></div>)}</div>}
      <div className="op-review-queue-head"><div><h3>Review queue</h3><p>Only an approved record appears in student discovery.</p></div><div className="op-review-queue-controls"><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Queue status"><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select><button onClick={loadQueue} disabled={loading || !token.trim()}><RefreshCw size={14} />Refresh queue</button></div></div>
      {queue.length ? <div className="op-review-queue">{queue.map((item) => <article className="op-review-item" key={item.reviewId}><div className="op-review-item__top"><div><strong>{item.candidate.title}</strong><small>{item.candidate.provider} · {item.candidate.sourceUrl}</small></div><span className={`review-status review-status--${item.reviewStatus.toLowerCase()}`}>{item.reviewStatus}</span></div>{item.findings?.map((finding, index) => <p key={`${finding.code}-${index}`} className={`op-review-finding finding-${finding.severity.toLowerCase()}`}><AlertTriangle size={13} />{finding.code}: {finding.message}</p>)}{item.reviewStatus === 'PENDING' && <div className="op-review-decision"><input value={notes[item.reviewId] || ''} onChange={(event) => setNotes((current) => ({ ...current, [item.reviewId]: event.target.value }))} placeholder="Reviewer note; required for non-allowlisted sources" maxLength={500} /><button className="review-reject" disabled={loading} onClick={() => decide(item, false)}>Reject</button><button className="review-approve" disabled={loading || item.findings?.some((finding) => finding.severity === 'BLOCKER')} onClick={() => decide(item, true)}><CheckCircle2 size={14} />Approve</button></div>}</article>)}</div> : <div className="op-review-queue-empty">Enter the reviewer token, then refresh the queue to load staged records.</div>}
      {error && <p className="op-review-error" role="alert">{error}</p>}{message && <p className="op-review-success" role="status">{message}</p>}
      <p className="op-review-footer">Prototype note: queue and catalogue are in-memory and reset on restart. Add durable storage, audited identity, authorization and source checks before production.</p>
    </section>
  </div>;
}
