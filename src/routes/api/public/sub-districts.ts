import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticate, corsHeaders, jsonResponse, logRequest, parseInt0 } from "@/lib/api/auth";

export const Route = createFileRoute("/api/public/sub-districts")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const endpoint = "/api/public/sub-districts";
        const auth = await authenticate(request, endpoint);
        if (!auth.ok) return jsonResponse(auth.body, auth.status);
        const url = new URL(request.url);
        const districtId = parseInt0(url.searchParams.get("district_id"), 0);
        let q = supabaseAdmin
          .from("sub_districts")
          .select("id, subdistrict_code, subdistrict_name, district_id")
          .order("subdistrict_name")
          .limit(5000);
        if (districtId) q = q.eq("district_id", districtId);
        const { data, error } = await q;
        const status = error ? 500 : 200;
        await logRequest(auth.apiKeyId, auth.userId, endpoint, status, auth.startedAt);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ count: data.length, data });
      },
    },
  },
});
