'use client';
import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import LoginPage from '@/components/LoginPage';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('linkedin_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return user ? <Dashboard user={user} setUser={setUser} /> : <LoginPage setUser={setUser} />;
}
