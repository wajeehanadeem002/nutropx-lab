export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function cleanEnvValue(value?: string) {
  const cleaned = value?.trim().replace(/^["']|["']$/g, "");
  return cleaned || undefined;
}

export function normalizeSupabaseUrl(rawUrl?: string) {
  const cleanedUrl = cleanEnvValue(rawUrl);
  if (!cleanedUrl) return undefined;

  try {
    const parsedUrl = new URL(cleanedUrl);
    parsedUrl.pathname = parsedUrl.pathname
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/g, "");
    parsedUrl.search = "";
    parsedUrl.hash = "";
    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return cleanedUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/g, "");
  }
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
  ]
    .map(normalizeSupabaseUrl)
    .find(Boolean);
  const anonKey = [
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_ANON_KEY,
  ]
    .map(cleanEnvValue)
    .find(Boolean);

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured for this deployment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.",
    );
  }

  return { url, anonKey };
}

export function getOptionalSupabaseConfig() {
  try {
    return getSupabaseConfig();
  } catch {
    return null;
  }
}
