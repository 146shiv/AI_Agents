import { useEffect } from 'react';
import { User } from 'lucide-react';
import useStore from '../../store/useStore';
import { authApi } from '../../api/client';

export default function Header() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    if (!user) {
      authApi.profile().then(setUser).catch(() => {});
    }
  }, [user, setUser]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur">
      <h2 className="text-lg font-semibold text-gray-800">AI Resume Analyzer</h2>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <User className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-gray-700">{user?.fullName || 'User'}</span>
      </div>
    </header>
  );
}
