import { useState, useEffect } from 'react';
import { BrainCircuit, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { interviewApi, resumeApi } from '../api/client';

export default function InterviewRoom() {
  const [phase, setPhase] = useState('setup');
  const [resumes, setResumes] = useState([]);
  const [config, setConfig] = useState({ resumeId: '', type: 'mixed', questionCount: 10 });
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    resumeApi.list().then(setResumes).catch(() => {});
  }, []);

  const startInterview = async () => {
    setLoading(true);
    try {
      const data = await interviewApi.start(config);
      setSession(data.session);
      setQuestions(data.questions);
      setPhase('interview');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (answer.trim().length < 10) return;
    setLoading(true);
    setFeedback(null);
    try {
      const data = await interviewApi.answer(session.id, {
        questionId: questions[currentIdx].id,
        answer,
      });
      setFeedback(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setAnswer('');
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      endInterview();
    }
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      const data = await interviewApi.end(session.id);
      setSummary(data);
      setPhase('summary');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (phase === 'setup') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
          <p className="mt-1 text-sm text-gray-500">Practice with AI-generated questions based on your resume</p>
        </div>

        <div className="card max-w-lg space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Select Resume (optional)</label>
            <select className="input-field" value={config.resumeId} onChange={(e) => setConfig({ ...config, resumeId: e.target.value })}>
              <option value="">General interview</option>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.fileName}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Interview Type</label>
            <select className="input-field" value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })}>
              <option value="mixed">Mixed</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Number of Questions</label>
            <input type="number" min={3} max={20} className="input-field" value={config.questionCount} onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })} />
          </div>

          <button onClick={startInterview} disabled={loading} className="btn-primary w-full gap-2">
            <BrainCircuit className="h-4 w-4" /> {loading ? 'Generating questions...' : 'Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'summary') {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Interview Complete</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <ScoreCard label="Overall" value={summary?.overallScore} />
          <ScoreCard label="Confidence" value={summary?.confidence} />
          <ScoreCard label="Accuracy" value={summary?.accuracy} />
          <ScoreCard label="Clarity" value={summary?.clarity} />
        </div>

        <div className="card text-center text-sm text-gray-500">
          {summary?.feedback?.answeredQuestions || 0} of {summary?.feedback?.totalQuestions || 0} questions answered
        </div>

        <button onClick={() => { setPhase('setup'); setSession(null); setQuestions([]); setCurrentIdx(0); setSummary(null); }} className="btn-primary mx-auto">
          Start New Interview
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];
  const typeBadge = { technical: 'bg-blue-100 text-blue-700', behavioral: 'bg-purple-100 text-purple-700', hr: 'bg-green-100 text-green-700' };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Question {currentIdx + 1} of {questions.length}</h1>
        <button onClick={endInterview} className="btn-secondary text-sm">End Interview</button>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="card">
        <div className="mb-3 flex gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadge[q?.type] || 'bg-gray-100 text-gray-700'}`}>{q?.type}</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">{q?.difficulty}</span>
        </div>
        <p className="text-lg font-medium text-gray-800">{q?.content}</p>
      </div>

      <div className="card space-y-4">
        <textarea
          className="input-field min-h-[120px]"
          placeholder="Type your answer here (min 10 characters)..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!feedback}
        />

        {!feedback ? (
          <button onClick={submitAnswer} disabled={loading || answer.trim().length < 10} className="btn-primary gap-2">
            <Send className="h-4 w-4" /> {loading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <MiniScore label="Score" value={feedback.evaluation?.score} />
              <MiniScore label="Confidence" value={feedback.evaluation?.confidence} />
              <MiniScore label="Accuracy" value={feedback.evaluation?.accuracy} />
              <MiniScore label="Clarity" value={feedback.evaluation?.clarity} />
            </div>
            {feedback.evaluation?.feedback && (
              <div className="rounded-lg bg-brand-50 p-4 text-sm text-brand-800">{feedback.evaluation.feedback}</div>
            )}
            <button onClick={nextQuestion} className="btn-primary gap-2">
              <ArrowRight className="h-4 w-4" /> {currentIdx + 1 < questions.length ? 'Next Question' : 'Finish Interview'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

function MiniScore({ label, value }) {
  const color = (value ?? 0) >= 70 ? 'text-green-600' : (value ?? 0) >= 50 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="rounded-lg bg-gray-50 p-2 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value ?? '—'}</p>
    </div>
  );
}
