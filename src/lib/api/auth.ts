import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type ApiAuthResult =
  | { ok: true; apiKeyId: string; userId: string; startedAt: number }
  | { ok: false; status: number; body: Record<string, unknown> };

export const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
};

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders, ...headers },
  });
}

export async function authenticate(request: Request, endpoint: string): Promise<ApiAuthResult> {
  const startedAt = Date.now();
  const key =
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("api_key");

  if (!key) {
    return { ok: false, status: 401, body: { error: "Missing API key. Send 'x-api-key' header." } };
  }

  const { data, error } = await supabaseAdmin.rpc("consume_api_key", {
    p_key: key,
    p_endpoint: endpoint,
  });

  if (error || !data || data.length === 0) {
    return { ok: false, status: 500, body: { error: "Auth check failed" } };
  }
  const row = data[0];
  if (!row.allowed) {
    const status = row.reason === "rate_limited" ? 429 : 401;
    return { ok: false, status, body: { error: row.reason } };
  }
  return { ok: true, apiKeyId: row.api_key_id, userId: row.user_id, startedAt };
}

export async function logRequest(
  apiKeyId: string,
  userId: string,
  endpoint: string,
  status: number,
  startedAt: number,
) {
  try {
    await supabaseAdmin.rpc("log_api_request", {
      p_api_key_id: apiKeyId,
      p_user_id: userId,
      p_endpoint: endpoint,
      p_status_code: status,
      p_response_time_ms: Date.now() - startedAt,
    });
  } catch (e) {
    console.error("log_api_request failed", e);
  }
}

export function parseInt0(v: string | null, fallback: number, max?: number) {
  if (!v) return fallback;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return max != null ? Math.min(n, max) : n;
}
