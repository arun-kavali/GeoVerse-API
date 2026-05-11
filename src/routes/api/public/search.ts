import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticate, corsHeaders, jsonResponse, logRequest, parseInt0 } from "@/lib/api/auth";

export const Route = createFileRoute("/api/public/search")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const endpoint = "/api/public/search";
        const auth = await authenticate(request, endpoint);
        if (!auth.ok) return jsonResponse(auth.body, auth.status);
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? "";
        const limit = parseInt0(url.searchParams.get("limit"), 50, 200);
        const offset = parseInt0(url.searchParams.get("offset"), 0);
        const stateId = parseInt0(url.searchParams.get("state_id"), 0) || undefined;
        const districtId = parseInt0(url.searchParams.get("district_id"), 0) || undefined;
        const subdistrictId = parseInt0(url.searchParams.get("subdistrict_id"), 0) || undefined;

        const { data, error } = await supabaseAdmin.rpc("search_villages", {
          q,
          p_state_id: stateId,
          p_district_id: districtId,
          p_subdistrict_id: subdistrictId,
          p_limit: limit,
          p_offset: offset,
        });
        const status = error ? 500 : 200;
        await logRequest(auth.apiKeyId, auth.userId, endpoint, status, auth.startedAt);
        if (error) return jsonResponse({ error: error.message }, 500);
        const total = data?.[0]?.total_count ?? 0;
        return jsonResponse({ total, returned: data?.length ?? 0, limit, offset, data });
      },
    },
  },
});
