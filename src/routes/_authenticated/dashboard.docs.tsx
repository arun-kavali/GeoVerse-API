import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard/docs")({
  component: DocsPage,
});

const endpoints = [
  { method: "GET", path: "/api/public/states", desc: "List all states", params: "" },
  { method: "GET", path: "/api/public/districts", desc: "List districts", params: "?state_id=27" },
  { method: "GET", path: "/api/public/sub-districts", desc: "List sub-districts", params: "?district_id=520" },
  { method: "GET", path: "/api/public/villages", desc: "List villages of a sub-district", params: "?subdistrict_id=4567&limit=100&offset=0" },
  { method: "GET", path: "/api/public/search", desc: "Search villages with optional filters", params: "?q=mani&state_id=27&limit=50" },
  { method: "GET", path: "/api/public/autocomplete", desc: "Autocomplete village names", params: "?q=ma&limit=10" },
];

function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground">All endpoints require an <code className="rounded bg-muted px-1">x-api-key</code> header.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Send your API key in the <code>x-api-key</code> header.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded bg-muted p-4 text-xs">
{`curl -H "x-api-key: YOUR_KEY" \\
  ${typeof window !== "undefined" ? window.location.origin : ""}/api/public/states`}
          </pre>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {endpoints.map((e) => (
          <Card key={e.path + e.params}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <span className="mr-2 rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">{e.method}</span>
                <code>{e.path}{e.params}</code>
              </CardTitle>
              <CardDescription>{e.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Rate limiting</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Each key has a usage quota (default 10,000 requests). Once exhausted, requests return <code>429</code>.
        </CardContent>
      </Card>
    </div>
  );
}
