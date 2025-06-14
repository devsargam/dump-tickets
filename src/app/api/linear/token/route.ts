import { LINEAR } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

// POST /api/linear/token
export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { error: "Request is missing body" },
      { status: 400 }
    );
  }

  const { refreshToken, redirectURI } = await req.json();

  if (!refreshToken || !redirectURI) {
    return NextResponse.json(
      { error: "Missing token or redirect URI" },
      { status: 400 }
    );
  }

  // Exchange auth code for access token
  const tokenParams = new URLSearchParams({
    code: refreshToken,
    redirect_uri: redirectURI,
    client_id: LINEAR.OAUTH_ID!,
    client_secret: process.env.LINEAR_OAUTH_SECRET!,
    grant_type: "authorization_code",
  });
  try {
    const payload = await fetch(LINEAR.TOKEN_URL, {
      method: "POST",
      body: tokenParams,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const body = await payload.json();
    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
