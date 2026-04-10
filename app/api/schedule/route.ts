import { NextRequest, NextResponse } from 'next/server';

type ScheduledPost = {
  id: string;
  text: string;
  imageUrl?: string;
  scheduledAt: string;
  accessToken: string;
  authorUrn: string;
  status: 'pending' | 'posted' | 'failed';
};

const scheduledPosts: ScheduledPost[] = [];

export async function GET() {
  return NextResponse.json(scheduledPosts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post: ScheduledPost = {
    id: Date.now().toString(),
    ...body,
    status: 'pending',
  };
  scheduledPosts.push(post);

  const scheduledTime = new Date(body.scheduledAt).getTime();
  const now = Date.now();
  const delay = scheduledTime - now;

  if (delay > 0) {
    setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: post.text, imageUrl: post.imageUrl, accessToken: post.accessToken, authorUrn: post.authorUrn }),
        });
        post.status = res.ok ? 'posted' : 'failed';
      } catch { post.status = 'failed'; }
    }, delay);
  }

  return NextResponse.json({ success: true, post });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const idx = scheduledPosts.findIndex(p => p.id === id);
  if (idx > -1) scheduledPosts.splice(idx, 1);
  return NextResponse.json({ success: true });
}
