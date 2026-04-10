import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text, imageUrl, accessToken, authorUrn } = await req.json();

  const media: any[] = [];
  if (imageUrl) {
      media.push({ status: 'READY', description: { text: 'Post image' }, media: imageUrl, title: { text: 'Image' } });
  }
  const body: any = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
        ...(imageUrl ? { media } : {}),
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json({ success: true, id: data.id });
}
