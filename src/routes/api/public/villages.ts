import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticate, corsHeaders, jsonResponse, logRequest, parseInt0 } from "@/lib/api/auth";

export const Route = createFileRoute("/api/public/villages")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const endpoint = "/api/public/villages";
        const auth = await authenticate(request, endpoint);
        if (!auth.ok) return jsonResponse(auth.body, auth.status);
        const url = new URL(request.url);
        const subdistrictId = parseInt0(url.searchParams.get("subdistrict_id"), 0);
        const limit = parseInt0(url.searchParams.get("limit"), 100, 500);
        const offset = parseInt0(url.searchParams.get("offset"), 0);
        if (!subdistrictId) {
          await logRequest(auth.apiKeyId, auth.userId, endpoint, 400, auth.startedAt);
          return jsonResponse({ error: "subdistrict_id is required" }, 400);
        }
        const { data, error, count } = await supabaseAdmin
          .from("villages")
          .select("id, village_code, village_name, subdistrict_id", { count: "exact" })
          .eq("subdistrict_id", subdistrictId)
          .order("village_name")
          .range(offset, offset + limit - 1);
        const status = error ? 500 : 200;
        await logRequest(auth.apiKeyId, auth.userId, endpoint, status, auth.startedAt);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ count, returned: data.length, limit, offset, data });
      },
    },
  },
});
