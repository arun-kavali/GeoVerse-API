import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticate, corsHeaders, jsonResponse, logRequest, parseInt0 } from "@/lib/api/auth";

export const Route = createFileRoute("/api/public/autocomplete")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const endpoint = "/api/public/autocomplete";
        const auth = await authenticate(request, endpoint);
        if (!auth.ok) return jsonResponse(auth.body, auth.status);
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? "";
        const limit = parseInt0(url.searchParams.get("limit"), 10, 25);
        if (q.length < 2) {
          await logRequest(auth.apiKeyId, auth.userId, endpoint, 400, auth.startedAt);
          return jsonResponse({ error: "q must be at least 2 characters" }, 400);
        }
        const { data, error } = await supabaseAdmin.rpc("autocomplete_villages", {
          q,
          p_limit: limit,
        });
        const status = error ? 500 : 200;
        await logRequest(auth.apiKeyId, auth.userId, endpoint, status, auth.startedAt);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ count: data?.length ?? 0, data });
      },
    },
  },
});
