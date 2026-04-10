'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UnsplashImage {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string;
  user: { name: string };
}

export default function PostComposer({ user }: { user: any }) {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageQuery, setImageQuery] = useState('');
  const [loadingImages, setLoadingImages] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const charCount = text.length;
  const maxChars = 3000;

  const generatePost = async () => {
    if (!topic.trim()) return toast.error('Please enter a topic first');
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, length }),
      });
      const data = await res.json();
      if (data.text) setText(data.text);
      else toast.error('Generation failed');
    } catch { toast.error('Generation failed'); }
    setGenerating(false);
  };

  const searchImages = async () => {
    if (!imageQuery.trim()) return;
    setLoadingImages(true);
    try {
      const res = await fetch(`/api/unsplash?query=${encodeURIComponent(imageQuery)}`);
      const data = await res.json();
      setImages(data.results || []);
    } catch { toast.error('Image search failed'); }
    setLoadingImages(false);
  };

  const publishPost = async () => {
    if (!text.trim()) return toast.error('Post content is empty');
    if (!user?.accessToken) return toast.error('Not authenticated');
    setPosting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          imageUrl: selectedImage || undefined,
          accessToken: user.accessToken,
          authorUrn: `urn:li:person:${user.sub}`,
        }),
      });
      if (res.ok) {
        toast.success('Post published to LinkedIn!');
        setText('');
        setSelectedImage('');
      } else {
        const err = await res.json();
        toast.error(`Error: ${JSON.stringify(err.error)}`);
      }
    } catch { toast.error('Failed to publish'); }
    setPosting(false);
  };

  const schedulePost = async () => {
    if (!text.trim()) return toast.error('Post content is empty');
    if (!scheduleDate) return toast.error('Select a schedule date/time');
    setScheduling(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          imageUrl: selectedImage || undefined,
          scheduledAt: scheduleDate,
          accessToken: user.accessToken,
          authorUrn: `urn:li:person:${user.sub}`,
        }),
      });
      if (res.ok) {
        toast.success('Post scheduled!');
        setShowSchedule(false);
      } else toast.error('Schedule failed');
    } catch { toast.error('Schedule failed'); }
    setScheduling(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">AI Post Generator</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            placeholder="Topic (e.g. AI trends, leadership)"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={tone} onChange={e => setTone(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="professional">Professional</option>
            <option value="conversational">Conversational</option>
            <option value="inspirational">Inspirational</option>
            <option value="educational">Educational</option>
            <option value="storytelling">Storytelling</option>
          </select>
          <select value={length} onChange={e => setLength(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="short">Short (100-150w)</option>
            <option value="medium">Medium (200-300w)</option>
            <option value="long">Long (400-500w)</option>
          </select>
          <button
            onClick={generatePost}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {generating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Post Content</h2>
          <span className={`text-xs font-medium ${charCount > maxChars ? 'text-red-500' : 'text-gray-400'}`}>{charCount}/{maxChars}</span>
        </div>
        <div className="flex gap-3 mb-3">
          <img
            src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-400">Post to LinkedIn</p>
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What do you want to share with your network?"
          rows={8}
          maxLength={maxChars}
          className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {selectedImage && (
          <div className="relative mt-3">
            <img src={selectedImage} alt="Selected" className="w-full h-48 object-cover rounded-lg" />
            <button onClick={() => setSelectedImage('')} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600">
              x
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="text-sm text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              Schedule
            </button>
          </div>
          <button
            onClick={publishPost}
            disabled={posting || charCount > maxChars}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
          >
            {posting ? 'Publishing...' : 'Post Now'}
          </button>
        </div>

        {showSchedule && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex gap-3 items-center">
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <button
              onClick={schedulePost}
              disabled={scheduling}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 px-4 rounded-lg"
            >
              {scheduling ? 'Scheduling...' : 'Schedule Post'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Add Image from Unsplash</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search images (e.g. technology, business)"
            value={imageQuery}
            onChange={e => setImageQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchImages()}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchImages}
            disabled={loadingImages}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-semibold py-2 px-4 rounded-lg"
          >
            {loadingImages ? 'Searching...' : 'Search'}
          </button>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map(img => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.urls.regular)}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === img.urls.regular ? 'border-blue-600' : 'border-transparent hover:border-blue-300'
                }`}
              >
                <img src={img.urls.small} alt={img.alt_description} className="w-full h-24 object-cover" />
                {selectedImage === img.urls.regular && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
