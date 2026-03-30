import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, BrainCircuit, FileSearch, TrendingUp, BarChart3, Target } from 'lucide-react';
import { analyticsApi } from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboard().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center text-gray-400">Loading dashboard...</div>;

  const s = data?.summary || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Your resume analytics at a glance</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Upload} label="Resumes Uploaded" value={s.totalResumes || 0} color="brand" />
        <StatCard icon={Target} label="Latest ATS Score" value={s.latestResumeScore != null ? s.latestResumeScore : '—'} color="green" />
        <StatCard icon={BrainCircuit} label="Interviews Done" value={s.totalInterviews || 0} color="purple" />
        <StatCard icon={BarChart3} label="Avg Interview Score" value={s.avgInterviewScore != null ? s.avgInterviewScore : '—'} color="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/upload" className="btn-primary justify-center gap-2">
              <Upload className="h-4 w-4" /> Upload Resume
            </Link>
            <Link to="/jd-match" className="btn-secondary justify-center gap-2">
              <FileSearch className="h-4 w-4" /> Match JD
            </Link>
            <Link to="/interview" className="btn-secondary justify-center gap-2">
              <BrainCircuit className="h-4 w-4" /> Start Interview
            </Link>
            <Link to="/analytics" className="btn-secondary justify-center gap-2">
              <TrendingUp className="h-4 w-4" /> View Analytics
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Latest Resume</h3>
          {data?.latestResume ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.latestResume.fileName}</span>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                  Score: {data.latestResume.score}/100
                </span>
              </div>
              {data.latestResume.strengths?.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium uppercase text-green-600">Strengths</span>
                  <ul className="mt-1 space-y-1">
                    {data.latestResume.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-sm text-gray-600">+ {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Link to={`/resume/${data.latestResume.id}`} className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700">
                View full analysis →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No resumes uploaded yet. Upload your first resume to get started.</p>
          )}
        </div>
      </div>

      {data?.recentInterviews?.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Recent Interviews</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Confidence</th>
                  <th className="pb-2 font-medium">Accuracy</th>
                  <th className="pb-2 font-medium">Clarity</th>
                </tr>
              </thead>
              <tbody>
                {data.recentInterviews.map((i, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">{new Date(i.date).toLocaleDateString()}</td>
                    <td className="py-2 font-medium text-brand-700">{i.score ?? '—'}</td>
                    <td className="py-2 text-gray-600">{i.confidence ?? '—'}</td>
                    <td className="py-2 text-gray-600">{i.accuracy ?? '—'}</td>
                    <td className="py-2 text-gray-600">{i.clarity ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
