import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticate, corsHeaders, jsonResponse, logRequest } from "@/lib/api/auth";

export const Route = createFileRoute("/api/public/states")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const auth = await authenticate(request, "/api/public/states");
        if (!auth.ok) return jsonResponse(auth.body, auth.status);
        const { data, error } = await supabaseAdmin
          .from("states")
          .select("id, state_code, state_name")
          .order("state_name");
        const status = error ? 500 : 200;
        await logRequest(auth.apiKeyId, auth.userId, "/api/public/states", status, auth.startedAt);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ count: data.length, data });
      },
    },
  },
});
