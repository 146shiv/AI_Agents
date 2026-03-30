import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JDMatching from './pages/JDMatching';
import InterviewRoom from './pages/InterviewRoom';
import Analytics from './pages/Analytics';

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<ResumeUpload />} />
        <Route path="resume/:id" element={<ResumeAnalysis />} />
        <Route path="jd-match" element={<JDMatching />} />
        <Route path="interview" element={<InterviewRoom />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
