'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ScheduleQueue({ user }: { user: any }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      setPosts(data);
    } catch { toast.error('Failed to load schedule'); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string) => {
    try {
      await fetch('/api/schedule', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      toast.success('Post removed from queue');
      fetchPosts();
    } catch { toast.error('Delete failed'); }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    posted: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Scheduled Posts</h2>
          <button onClick={fetchPosts} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Refresh</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🗓️</p>
            <p className="text-gray-500 font-medium">No scheduled posts</p>
            <p className="text-gray-400 text-sm mt-1">Go to Compose to schedule your first post</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>
                        {post.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {post.scheduledAt ? format(new Date(post.scheduledAt), 'MMM d, yyyy h:mm a') : 'Not scheduled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">{post.text}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="Post image" className="mt-2 w-24 h-16 object-cover rounded-lg" />
                    )}
                  </div>
                  {post.status === 'pending' && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-400 hover:text-red-600 text-sm font-medium flex-shrink-0"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
