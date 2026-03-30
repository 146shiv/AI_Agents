import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../api/client';

export default function Analytics() {
  const [resumeHistory, setResumeHistory] = useState([]);
  const [interviewPerf, setInterviewPerf] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.resumeHistory().then(setResumeHistory),
      analyticsApi.interviewPerformance().then(setInterviewPerf),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center text-gray-400">Loading analytics...</div>;

  const chartResume = resumeHistory.map((r) => ({
    name: r.fileName?.replace(/\.[^.]+$/, '').slice(0, 15),
    Overall: r.scores.overall,
    Keywords: r.scores.keywords,
    Formatting: r.scores.formatting,
    Experience: r.scores.experience,
  }));

  const chartInterview = interviewPerf.map((s) => ({
    name: new Date(s.date).toLocaleDateString(),
    Score: s.overallScore,
    Confidence: s.confidence,
    Accuracy: s.accuracy,
    Clarity: s.clarity,
  }));

  const hasResume = chartResume.length > 0;
  const hasInterview = chartInterview.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Track your progress over time</p>
      </div>

      {hasResume && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Resume Score History</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartResume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Overall" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Keywords" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="Experience" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasInterview && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Interview Performance</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartInterview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Confidence" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Accuracy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Clarity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {interviewPerf.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Scores by Question Type</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Technical</th>
                  <th className="pb-2 font-medium">Behavioral</th>
                  <th className="pb-2 font-medium">HR</th>
                  <th className="pb-2 font-medium">Overall</th>
                </tr>
              </thead>
              <tbody>
                {interviewPerf.map((s) => (
                  <tr key={s.sessionId} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="py-2 capitalize text-gray-600">{s.type}</td>
                    <td className="py-2 text-gray-600">{s.scoresByType.technical ?? '—'}</td>
                    <td className="py-2 text-gray-600">{s.scoresByType.behavioral ?? '—'}</td>
                    <td className="py-2 text-gray-600">{s.scoresByType.hr ?? '—'}</td>
                    <td className="py-2 font-medium text-brand-700">{s.overallScore ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasResume && !hasInterview && (
        <div className="card py-16 text-center text-gray-400">
          <p className="text-lg">No data yet</p>
          <p className="mt-1 text-sm">Upload a resume or complete an interview to see analytics.</p>
        </div>
      )}
    </div>
  );
}
