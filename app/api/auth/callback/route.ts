import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return NextResponse.redirect(new URL('/?error=auth_failed', process.env.NEXTAUTH_URL!));
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await profileRes.json();
  const redirectUrl = new URL('/', process.env.NEXTAUTH_URL!);
  redirectUrl.searchParams.set('token', tokenData.access_token);
  redirectUrl.searchParams.set('user', JSON.stringify({ sub: profile.sub, name: profile.name, picture: profile.picture, email: profile.email }));
  return NextResponse.redirect(redirectUrl.toString());
}
