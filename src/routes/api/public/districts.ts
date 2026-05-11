import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticate, corsHeaders, jsonResponse, logRequest, parseInt0 } from "@/lib/api/auth";

export const Route = createFileRoute("/api/public/districts")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const auth = await authenticate(request, "/api/public/districts");
        if (!auth.ok) return jsonResponse(auth.body, auth.status);
        const url = new URL(request.url);
        const stateId = parseInt0(url.searchParams.get("state_id"), 0);
        let q = supabaseAdmin
          .from("districts")
          .select("id, district_code, district_name, state_id")
          .order("district_name")
          .limit(2000);
        if (stateId) q = q.eq("state_id", stateId);
        const { data, error } = await q;
        const status = error ? 500 : 200;
        await logRequest(auth.apiKeyId, auth.userId, "/api/public/districts", status, auth.startedAt);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ count: data.length, data });
      },
    },
  },
});
