import { NextResponse, type NextRequest } from "next/server";
import { getOptionalSupabaseConfig } from "./lib/supabase/config";

const ACCESS_TOKEN_COOKIE = "nutropx_access_token";
const REFRESH_TOKEN_COOKIE = "nutropx_refresh_token";
const DEV_USER_COOKIE = "nutropx_dev_user";

type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

function getJwtExpiry(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { exp?: number };
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isTokenFresh(token?: string) {
  if (!token) return false;

  const expiry = getJwtExpiry(token);
  if (!expiry) return false;

  return expiry > Math.floor(Date.now() / 1000) + 60;
}

function isLocalDevAuthEnabled() {
  return process.env.NODE_ENV !== "production";
}

function isLocalDevSessionFresh(cookieValue?: string) {
  if (!isLocalDevAuthEnabled() || !cookieValue) return false;

  try {
    const normalized = cookieValue.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { exp?: number; id?: string };
    return Boolean(
      decoded.id &&
        decoded.exp &&
        decoded.exp > Math.floor(Date.now() / 1000) + 60,
    );
  } catch {
    return false;
  }
}

async function refreshSession(refreshToken: string) {
  const config = getOptionalSupabaseConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: config.anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  );

  if (!response.ok) return null;
  return (await response.json()) as SupabaseSession;
}

function setSessionCookies(response: NextResponse, session: SupabaseSession) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(ACCESS_TOKEN_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: session.expires_in ?? 60 * 60,
  });

  if (session.refresh_token) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, session.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  response.cookies.delete(DEV_USER_COOKIE);
}

export async function proxy(request: NextRequest) {
  if (isLocalDevSessionFresh(request.cookies.get(DEV_USER_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (isTokenFresh(accessToken)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.redirect(
      new URL("/auth/login?message=Please sign in to open your account.", request.url),
    );
  }

  const session = await refreshSession(refreshToken);
  if (!session?.access_token) {
    const response = NextResponse.redirect(
      new URL("/auth/login?message=Please sign in to open your account.", request.url),
    );
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.redirect(request.nextUrl);
  setSessionCookies(response, session);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/lab/:path*", "/my-brain/:path*", "/profile/:path*"],
};
