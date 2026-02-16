import { NextRequest, NextResponse } from 'next/server'

interface RequestBody {
  clientId: string
  clientSecret: string
  userAccessToken: string
  appScopedUserId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { clientId, clientSecret, userAccessToken, appScopedUserId } = body;

    // Validate required fields
    if (!clientId || !clientSecret || !userAccessToken || !appScopedUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Exchange short-lived user token for long-lived token
    const userTokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
    userTokenUrl.searchParams.append('grant_type', 'fb_exchange_token');
    userTokenUrl.searchParams.append('client_id', clientId);
    userTokenUrl.searchParams.append('client_secret', clientSecret);
    userTokenUrl.searchParams.append('fb_exchange_token', userAccessToken);

    let userTokenResponse;
    try {
      userTokenResponse = await fetch(userTokenUrl.toString());
    } catch (err) {
      console.error('Network error fetching user token:', err);
      return NextResponse.json({ error: `Network error fetching user token: ${err}` }, { status: 500 });
    }

    if (!userTokenResponse.ok) {
      let errorText = await userTokenResponse.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {}
      console.error('Failed to get long-lived user token:', {
        status: userTokenResponse.status,
        statusText: userTokenResponse.statusText,
        url: userTokenUrl.toString(),
        response: errorText,
        params: { clientId, clientSecretLength: clientSecret.length, userAccessTokenLength: userAccessToken.length, appScopedUserId }
      });
      return NextResponse.json({ error: `Failed to get long-lived user token: ${errorData['error']?.message || errorText || 'Unknown error'}` }, { status: userTokenResponse.status });
    }

    const userTokenData = await userTokenResponse.json();

    // Step 2: Get page tokens using the long-lived user token
    const pageTokenUrl = new URL(`https://graph.facebook.com/v20.0/${appScopedUserId}/accounts`);
    pageTokenUrl.searchParams.append('access_token', userTokenData.access_token);

    let pageTokenResponse;
    try {
      pageTokenResponse = await fetch(pageTokenUrl.toString());
    } catch (err) {
      console.error('Network error fetching page tokens:', err);
      return NextResponse.json({ error: `Network error fetching page tokens: ${err}` }, { status: 500 });
    }

    if (!pageTokenResponse.ok) {
      let errorText = await pageTokenResponse.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {}
      console.error('Failed to get page tokens:', {
        status: pageTokenResponse.status,
        statusText: pageTokenResponse.statusText,
        url: pageTokenUrl.toString(),
        response: errorText,
        params: { appScopedUserId, accessTokenLength: userTokenData.access_token?.length }
      });
      return NextResponse.json({ error: `Failed to get page tokens: ${errorData['error']?.message || errorText || 'Unknown error'}` }, { status: pageTokenResponse.status });
    }

    const pageTokenData = await pageTokenResponse.json();

    // Return both user token and page tokens
    return NextResponse.json({ userToken: userTokenData, pageTokens: pageTokenData.data || [] });
  } catch (error) {
    // Log the full error for debugging
    console.error('API Error', error);
    return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
  }
}
