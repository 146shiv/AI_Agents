import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { resumeApi } from '../api/client';

export default function ResumeUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    resumeApi.list().then(setResumes).catch(() => {});
  }, []);

  const onDrop = useCallback(async (accepted) => {
    const file = accepted[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const data = await resumeApi.upload(file);
      navigate(`/resume/${data.resume.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
        <p className="mt-1 text-sm text-gray-500">Upload a PDF or DOCX file to analyze</p>
      </div>

      <div
        {...getRootProps()}
        className={`card flex cursor-pointer flex-col items-center justify-center border-2 border-dashed py-16 transition-colors ${
          isDragActive ? 'border-brand-400 bg-brand-50' : 'border-gray-300 hover:border-brand-300 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`h-12 w-12 ${isDragActive ? 'text-brand-500' : 'text-gray-400'}`} />
        <p className="mt-4 text-base font-medium text-gray-700">
          {uploading ? 'Analyzing your resume...' : isDragActive ? 'Drop your resume here' : 'Drag & drop your resume, or click to browse'}
        </p>
        <p className="mt-1 text-sm text-gray-400">PDF or DOCX, max 10 MB</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {resumes.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Your Resumes</h3>
          <div className="space-y-3">
            {resumes.map((r) => (
              <Link
                key={r.id}
                to={`/resume/${r.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.fileName}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {r.analysis && (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                    <CheckCircle className="h-3.5 w-3.5" /> {r.analysis.overallScore}/100
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
