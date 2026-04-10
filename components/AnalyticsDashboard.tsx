'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';

const engagementData = [
  { day: 'Mon', impressions: 1200, likes: 45, comments: 12, shares: 8 },
  { day: 'Tue', impressions: 1900, likes: 72, comments: 18, shares: 15 },
  { day: 'Wed', impressions: 1500, likes: 58, comments: 14, shares: 10 },
  { day: 'Thu', impressions: 2800, likes: 105, comments: 32, shares: 24 },
  { day: 'Fri', impressions: 3200, likes: 128, comments: 41, shares: 31 },
  { day: 'Sat', impressions: 2100, likes: 84, comments: 22, shares: 16 },
  { day: 'Sun', impressions: 1700, likes: 63, comments: 17, shares: 11 },
];

const postTypeData = [
  { type: 'Text Only', count: 12, engagement: 4.2 },
  { type: 'With Image', count: 8, engagement: 6.8 },
  { type: 'Carousel', count: 4, engagement: 9.1 },
  { type: 'Video', count: 2, engagement: 11.3 },
];

const statCards = [
  { label: 'Total Impressions', value: '14,400', change: '+23%', up: true },
  { label: 'Engagement Rate', value: '4.8%', change: '+1.2%', up: true },
  { label: 'Profile Views', value: '892', change: '+15%', up: true },
  { label: 'Followers Gained', value: '47', change: '-3', up: false },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className={`text-xs font-semibold mt-1 ${card.up ? 'text-green-600' : 'text-red-500'}`}>
              {card.up ? '↗️' : '↘️'} {card.change} vs last week
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Impressions & Engagement (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={engagementData}>
            <defs>
              <linearGradient id="impressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="impressions" stroke="#0A66C2" fill="url(#impressions)" strokeWidth={2} />
            <Area type="monotone" dataKey="likes" stroke="#16A34A" fill="none" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Engagement by Post Type</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={postTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="type" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0A66C2" name="Posts" radius={[4, 4, 0, 0]} />
            <Bar dataKey="engagement" fill="#16A34A" name="Avg. Engagement %" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Best Time to Post</h2>
        <p className="text-sm text-gray-500 mb-4">Based on your audience activity patterns</p>
        <div className="grid grid-cols-5 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={day} className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-2">{day}</p>
              {['9am', '12pm', '3pm', '6pm'].map((time, j) => {
                const intensity = Math.random();
                return (
                  <div
                    key={time}
                    title={`${day} ${time}`}
                    className={`h-8 rounded mb-1 text-xs flex items-center justify-center text-white font-medium ${
                      intensity > 0.7 ? 'bg-blue-600' : intensity > 0.4 ? 'bg-blue-300' : 'bg-gray-100'
                    }`}
                  >
                    {intensity > 0.7 ? time : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
