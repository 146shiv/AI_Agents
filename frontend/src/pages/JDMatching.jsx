import { useState, useEffect } from 'react';
import { FileSearch, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { jdApi, resumeApi } from '../api/client';

export default function JDMatching() {
  const [resumes, setResumes] = useState([]);
  const [form, setForm] = useState({ resumeId: '', jobTitle: '', company: '', description: '' });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    resumeApi.list().then(setResumes).catch(() => {});
    jdApi.history().then(setHistory).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await jdApi.match(form);
      setResult(data);
      jdApi.history().then(setHistory).catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">JD Matching</h1>
        <p className="mt-1 text-sm text-gray-500">Compare your resume against a job description</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Select Resume</label>
            <select
              className="input-field"
              required
              value={form.resumeId}
              onChange={(e) => setForm({ ...form, resumeId: e.target.value })}
            >
              <option value="">Choose a resume...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.fileName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Job Title</label>
            <input className="input-field" required value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Company (optional)</label>
          <input className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            className="input-field min-h-[120px]"
            required
            minLength={50}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Paste the full job description here (min 50 characters)..."
          />
        </div>

        {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary gap-2">
          <FileSearch className="h-4 w-4" /> {loading ? 'Analyzing...' : 'Match Resume'}
        </button>
      </form>

      {result && (
        <div className="space-y-6">
          <div className="card text-center">
            <p className="text-sm text-gray-500">Match Score</p>
            <p className={`text-5xl font-bold ${result.matchScore >= 70 ? 'text-green-600' : result.matchScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {result.matchScore}%
            </p>
            <p className="mt-1 text-sm text-gray-400">{result.jobDescription?.title} {result.jobDescription?.company && `at ${result.jobDescription.company}`}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {result.matchedSkills?.length > 0 && (
              <div className="card">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><CheckCircle className="h-5 w-5 text-green-500" /> Matched Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((s, i) => (
                    <span key={i} className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {result.missingSkills?.length > 0 && (
              <div className="card">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><XCircle className="h-5 w-5 text-red-500" /> Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((s, i) => (
                    <span key={i} className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result.suggestions?.length > 0 && (
            <div className="card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><Lightbulb className="h-5 w-5 text-brand-500" /> Suggestions</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => <li key={i} className="text-sm text-gray-600">• {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Match History</h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{h.jobDescription?.title} {h.jobDescription?.company && `at ${h.jobDescription.company}`}</p>
                  <p className="text-xs text-gray-400">{h.resume?.fileName} · {new Date(h.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${h.matchScore >= 70 ? 'bg-green-50 text-green-700' : h.matchScore >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                  {h.matchScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
