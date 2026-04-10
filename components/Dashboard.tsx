'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import PostComposer from './PostComposer';
import ScheduleQueue from './ScheduleQueue';
import AnalyticsDashboard from './AnalyticsDashboard';
import toast from 'react-hot-toast';

type Tab = 'compose' | 'schedule' | 'analytics';

export default function Dashboard({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('compose');

  const handleLogout = () => {
    sessionStorage.removeItem('linkedin_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex min-h-screen bg-[#F3F2EF]">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'compose' && <PostComposer user={user} />}
          {activeTab === 'schedule' && <ScheduleQueue user={user} />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </div>
      </main>
    </div>
  );
}
