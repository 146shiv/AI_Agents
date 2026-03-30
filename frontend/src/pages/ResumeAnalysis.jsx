import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Lightbulb, Code, Briefcase, GraduationCap, FolderGit2 } from 'lucide-react';
import { resumeApi } from '../api/client';

export default function ResumeAnalysis() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeApi.get(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-64 items-center justify-center text-gray-400">Loading analysis...</div>;
  if (!data) return <div className="text-center text-gray-400">Resume not found</div>;

  const a = data.analysis;
  const p = data.parsedData || {};

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Analysis</h1>
          <p className="mt-1 text-sm text-gray-500">{data.fileName}</p>
        </div>
        <ScoreCircle score={a?.overallScore || 0} />
      </div>

      {a && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreBar label="Keywords" score={a.keywordScore} />
            <ScoreBar label="Formatting" score={a.formattingScore} />
            <ScoreBar label="Experience" score={a.experienceScore} />
            <ScoreBar label="Skill Density" score={a.skillDensity} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ListSection icon={CheckCircle} title="Strengths" items={a.strengths || []} color="green" />
            <ListSection icon={AlertTriangle} title="Weaknesses" items={a.weaknesses || []} color="amber" />
          </div>

          <ListSection icon={Lightbulb} title="AI Suggestions" items={a.suggestions || []} color="brand" />
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {p.skills?.length > 0 && (
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><Code className="h-5 w-5 text-brand-500" /> Skills</h3>
            <div className="flex flex-wrap gap-2">
              {p.skills.map((s, i) => (
                <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{s}</span>
              ))}
            </div>
          </div>
        )}

        {p.experience?.length > 0 && (
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><Briefcase className="h-5 w-5 text-purple-500" /> Experience</h3>
            <div className="space-y-3">
              {p.experience.map((e, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-800">{e.title}</p>
                  <p className="text-sm text-gray-500">{e.company} {e.duration && `· ${e.duration}`}</p>
                  {e.bullets?.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {e.bullets.map((b, j) => <li key={j} className="text-sm text-gray-600">• {b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {p.education?.length > 0 && (
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><GraduationCap className="h-5 w-5 text-green-500" /> Education</h3>
            <div className="space-y-2">
              {p.education.map((e, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-800">{e.degree}</p>
                  <p className="text-sm text-gray-500">{e.institution} {e.year && `· ${e.year}`} {e.gpa && `· GPA: ${e.gpa}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {p.projects?.length > 0 && (
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><FolderGit2 className="h-5 w-5 text-amber-500" /> Projects</h3>
            <div className="space-y-2">
              {p.projects.map((pr, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-800">{pr.name}</p>
                  {pr.description && <p className="text-sm text-gray-500">{pr.description.slice(0, 120)}</p>}
                  {pr.technologies?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {pr.technologies.map((t, j) => <span key={j} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{t}</span>)}
                    </div>
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

function ScoreCircle({ score }) {
  const color = score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  return (
    <div className="flex flex-col items-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${color} border-current`}>
        <span className={`text-2xl font-bold ${color}`}>{score}</span>
      </div>
      <span className="mt-1 text-xs font-medium text-gray-500">ATS Score</span>
    </div>
  );
}

function ScoreBar({ label, score }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="card">
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function ListSection({ icon: Icon, title, items, color }) {
  const colorMap = { green: 'text-green-500', amber: 'text-amber-500', brand: 'text-brand-500' };
  if (!items.length) return null;

  return (
    <div className="card">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
        <Icon className={`h-5 w-5 ${colorMap[color]}`} /> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600">• {typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
