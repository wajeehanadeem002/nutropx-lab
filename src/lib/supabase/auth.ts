import { cookies } from "next/headers";
import { request as httpsRequest } from "node:https";
import type { IncomingHttpHeaders } from "node:http";
import { getSupabaseConfig } from "./config";

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user?: SupabaseAuthUser;
};

type SupabaseErrorBody = {
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
};

const ACCESS_TOKEN_COOKIE = "nutropx_access_token";
const REFRESH_TOKEN_COOKIE = "nutropx_refresh_token";
const DEV_USER_COOKIE = "nutropx_dev_user";
const DEV_SESSION_MAX_AGE = 60 * 60 * 24 * 365;

async function parseSupabaseError(response: Response) {
  try {
    const body = (await response.json()) as SupabaseErrorBody;
    return (
      body.error_description ||
      body.message ||
      body.msg ||
      body.error ||
      "Supabase auth request failed."
    );
  } catch {
    return "Supabase auth request failed.";
  }
}

async function supabaseAuthRequest<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
) {
  const { url, anonKey } = getSupabaseConfig();
  const headers: Record<string, string> = {
    apikey: anonKey,
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const requestUrl = `${url}/auth/v1${path}`;
  const requestInit: RequestInit = {
    ...init,
    cache: "no-store",
    headers: {
      ...headers,
      ...(init.headers as Record<string, string> | undefined),
    },
  };

  let response: Response;
  try {
    response = await nodeHttpsRequest(requestUrl, requestInit);
  } catch (httpsError) {
    try {
      response = await fetch(requestUrl, requestInit);
    } catch (fetchError) {
      console.error("Supabase auth request failed", {
        httpsError,
        fetchError,
      });
      throw new Error(
        "We could not connect to Supabase. Please check the deployment environment variables and try again.",
      );
    }
  }

  if (!response.ok) {
    throw new Error(await parseSupabaseError(response));
  }

  return (await response.json()) as T;
}

function normalizeNodeHeaders(rawHeaders: IncomingHttpHeaders) {
  const responseHeaders = new Headers();

  for (const [key, value] of Object.entries(rawHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) responseHeaders.append(key, item);
    } else if (typeof value === "string") {
      responseHeaders.set(key, value);
    }
  }

  return responseHeaders;
}

function nodeHttpsRequest(url: string, init: RequestInit) {
  return new Promise<Response>((resolve, reject) => {
    const target = new URL(url);
    const headers = new Headers(init.headers);
    const body =
      typeof init.body === "string"
        ? init.body
        : init.body instanceof Uint8Array
          ? Buffer.from(init.body)
          : undefined;

    const request = httpsRequest(
      {
        family: 4,
        headers: Object.fromEntries(headers.entries()),
        hostname: target.hostname,
        method: init.method ?? "GET",
        path: `${target.pathname}${target.search}`,
        port: target.port ? Number(target.port) : 443,
        protocol: target.protocol,
        timeout: 15000,
      },
      (nodeResponse) => {
        const chunks: Buffer[] = [];

        nodeResponse.on("data", (chunk: Buffer | string) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        nodeResponse.on("end", () => {
          resolve(
            new Response(Buffer.concat(chunks), {
              headers: normalizeNodeHeaders(nodeResponse.headers),
              status: nodeResponse.statusCode ?? 500,
            }),
          );
        });
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error("Supabase auth request timed out."));
    });
    request.on("error", reject);

    if (body) request.write(body);
    request.end();
  });
}

function isLocalDevAuthEnabled() {
  return process.env.NODE_ENV !== "production";
}

function getLocalDevUser(cookieValue?: string) {
  if (!isLocalDevAuthEnabled() || !cookieValue) return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(cookieValue, "base64url").toString("utf8"),
    ) as SupabaseAuthUser & { exp?: number };

    if (!decoded.id || !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function getDevDisplayName(email: string) {
  const name = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return name || "Wajeeha";
}

async function setLocalDevAuthCookie(email: string) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const user: SupabaseAuthUser & { exp: number } = {
    id: `local-dev-${email.toLowerCase()}`,
    email,
    exp: Math.floor(Date.now() / 1000) + DEV_SESSION_MAX_AGE,
    user_metadata: {
      full_name: getDevDisplayName(email),
    },
  };

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.set(
    DEV_USER_COOKIE,
    Buffer.from(JSON.stringify(user)).toString("base64url"),
    {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: DEV_SESSION_MAX_AGE,
    },
  );

  return {
    access_token: "local-dev-session",
    expires_in: DEV_SESSION_MAX_AGE,
    user,
  } satisfies SupabaseSession;
}

function canUseLocalDevAuth(email: string, password: string, error: unknown) {
  if (!isLocalDevAuthEnabled() || !email.includes("@") || password.length < 6) {
    return false;
  }

  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes("invalid login credentials") ||
    message.includes("email not confirmed") ||
    message.includes("supabase connection failed") ||
    message.includes("email rate limit")
  );
}

export async function setAuthCookies(session: SupabaseSession) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const accessMaxAge = session.expires_in ?? 60 * 60;

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: accessMaxAge,
  });

  if (session.refresh_token) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(DEV_USER_COOKIE);
}

export async function signInWithPassword(email: string, password: string) {
  let session: SupabaseSession;
  try {
    session = await supabaseAuthRequest<SupabaseSession>(
      "/token?grant_type=password",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
  } catch (error) {
    if (canUseLocalDevAuth(email, password, error)) {
      return setLocalDevAuthCookie(email);
    }

    throw error;
  }

  await setAuthCookies(session);
  return session;
}

export async function signUpWithPassword(email: string, password: string) {
  let session: SupabaseSession;
  try {
    session = await supabaseAuthRequest<SupabaseSession>(
      "/signup",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
  } catch (error) {
    if (canUseLocalDevAuth(email, password, error)) {
      return setLocalDevAuthCookie(email);
    }

    throw error;
  }

  if (session.access_token) {
    await setAuthCookies(session);
  }

  return session;
}

export async function signOutCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      await supabaseAuthRequest("/logout", { method: "POST" }, accessToken);
    } catch {
      // Local cookie clearing still signs the user out from this app.
    }
  }

  await clearAuthCookies();
}

export async function updateCurrentUserDisplayName(displayName: string) {
  const cleanedName = displayName.trim().slice(0, 80);
  if (!cleanedName) {
    throw new Error("Display name is required.");
  }

  const cookieStore = await cookies();
  const localDevUser = getLocalDevUser(cookieStore.get(DEV_USER_COOKIE)?.value);
  if (localDevUser) {
    const secure = process.env.NODE_ENV === "production";
    const exp = localDevUser.exp ?? Math.floor(Date.now() / 1000) + DEV_SESSION_MAX_AGE;
    const updatedUser: SupabaseAuthUser & { exp: number } = {
      ...localDevUser,
      exp,
      user_metadata: {
        ...localDevUser.user_metadata,
        full_name: cleanedName,
        name: cleanedName,
      },
    };

    cookieStore.set(
      DEV_USER_COOKIE,
      Buffer.from(JSON.stringify(updatedUser)).toString("base64url"),
      {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: Math.max(60, exp - Math.floor(Date.now() / 1000)),
      },
    );

    return updatedUser;
  }

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    throw new Error("Please sign in again.");
  }

  return supabaseAuthRequest<SupabaseAuthUser>(
    "/user",
    {
      method: "PUT",
      body: JSON.stringify({
        data: {
          full_name: cleanedName,
          name: cleanedName,
        },
      }),
    },
    accessToken,
  );
}

export async function updateCurrentUserPrivacySettings(settings: {
  leaderboardPublic: boolean;
  leaderboardNameMode: "generated" | "real";
}) {
  const cookieStore = await cookies();
  const localDevUser = getLocalDevUser(cookieStore.get(DEV_USER_COOKIE)?.value);
  const userMetadata = {
    leaderboard_public: settings.leaderboardPublic,
    leaderboard_name_mode: settings.leaderboardNameMode,
  };

  if (localDevUser) {
    const secure = process.env.NODE_ENV === "production";
    const exp = localDevUser.exp ?? Math.floor(Date.now() / 1000) + DEV_SESSION_MAX_AGE;
    const updatedUser: SupabaseAuthUser & { exp: number } = {
      ...localDevUser,
      exp,
      user_metadata: {
        ...localDevUser.user_metadata,
        ...userMetadata,
      },
    };

    cookieStore.set(
      DEV_USER_COOKIE,
      Buffer.from(JSON.stringify(updatedUser)).toString("base64url"),
      {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: Math.max(60, exp - Math.floor(Date.now() / 1000)),
      },
    );

    return updatedUser;
  }

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    throw new Error("Please sign in again.");
  }

  return supabaseAuthRequest<SupabaseAuthUser>(
    "/user",
    {
      method: "PUT",
      body: JSON.stringify({
        data: userMetadata,
      }),
    },
    accessToken,
  );
}

export async function updateCurrentUserAlertSettings(settings: {
  pushEnabled?: boolean;
  reminderTime?: string;
  digestEnabled?: boolean;
  digestFrequency?: "daily" | "weekly" | "streak";
}) {
  const cookieStore = await cookies();
  const localDevUser = getLocalDevUser(cookieStore.get(DEV_USER_COOKIE)?.value);
  const userMetadata: Record<string, boolean | string> = {};

  if (typeof settings.pushEnabled === "boolean") {
    userMetadata.alert_push_enabled = settings.pushEnabled;
  }

  if (typeof settings.reminderTime === "string") {
    userMetadata.alert_reminder_time = settings.reminderTime;
  }

  if (typeof settings.digestEnabled === "boolean") {
    userMetadata.alert_digest_enabled = settings.digestEnabled;
  }

  if (settings.digestFrequency) {
    userMetadata.alert_digest_frequency = settings.digestFrequency;
  }

  if (localDevUser) {
    const secure = process.env.NODE_ENV === "production";
    const exp = localDevUser.exp ?? Math.floor(Date.now() / 1000) + DEV_SESSION_MAX_AGE;
    const updatedUser: SupabaseAuthUser & { exp: number } = {
      ...localDevUser,
      exp,
      user_metadata: {
        ...localDevUser.user_metadata,
        ...userMetadata,
      },
    };

    cookieStore.set(
      DEV_USER_COOKIE,
      Buffer.from(JSON.stringify(updatedUser)).toString("base64url"),
      {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: Math.max(60, exp - Math.floor(Date.now() / 1000)),
      },
    );

    return updatedUser;
  }

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    throw new Error("Please sign in again.");
  }

  return supabaseAuthRequest<SupabaseAuthUser>(
    "/user",
    {
      method: "PUT",
      body: JSON.stringify({
        data: userMetadata,
      }),
    },
    accessToken,
  );
}

export async function deleteCurrentUserAccount() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      await supabaseAuthRequest("/user", { method: "DELETE" }, accessToken);
    } catch {
      // If Supabase self-delete is not enabled, remove the local app session.
    }
  }

  await clearAuthCookies();
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const localDevUser = getLocalDevUser(cookieStore.get(DEV_USER_COOKIE)?.value);
  if (localDevUser) return localDevUser;

  let configReady = true;
  try {
    getSupabaseConfig();
  } catch {
    configReady = false;
  }

  if (!configReady) return null;

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) return null;

  try {
    const body = await supabaseAuthRequest<SupabaseAuthUser>(
      "/user",
      { method: "GET" },
      accessToken,
    );
    return body;
  } catch {
    return null;
  }
}

export function getAuthErrorMessage(error: unknown) {
  const rawMessage =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const message = rawMessage.trim();
  const normalized = message.toLowerCase();

  if (
    normalized.includes("supabase env vars missing") ||
    normalized.includes("supabase is not configured") ||
    normalized.includes("next_public_supabase")
  ) {
    return "Supabase is not configured for this deployment. Please add the Supabase URL and public anon key in Vercel, then redeploy.";
  }

  if (
    normalized.includes("supabase connection failed") ||
    normalized.includes("we could not connect to supabase") ||
    normalized.includes("fetch failed") ||
    normalized.includes("timed out")
  ) {
    return "We could not connect to Supabase. Please check the deployment environment variables and try again.";
  }

  if (normalized.includes("email rate limit")) {
    return "Too many signup emails were requested. Please wait a few minutes before trying again.";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return "We could not sign you in. Please check your email and password, or create an account if you are new.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (normalized.includes("signup disabled")) {
    return "Email signups are currently disabled. Please enable email authentication in Supabase or try again later.";
  }

  if (normalized.includes("jwt") || normalized.includes("session")) {
    return "Your session has expired. Please sign in again.";
  }

  return message || "Something went wrong. Please try again.";
}
