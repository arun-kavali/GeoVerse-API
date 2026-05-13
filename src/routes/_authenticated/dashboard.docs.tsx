import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/docs")({
  component: DocsPage,
});

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <p className="text-sm text-muted-foreground">All endpoints live under <code className="rounded bg-muted px-1.5 py-0.5">/api/public/</code> and require an API key in the <code className="rounded bg-muted px-1.5 py-0.5">x-api-key</code> header. Responses are JSON.</p>
      </>
    ),
  },
  {
    id: "auth",
    title: "Authentication",
    body: (
      <CodeBlock>{`curl -H "x-api-key: aiv_••••" \\
  https://api.allindia.dev/api/public/states`}</CodeBlock>
    ),
  },
];

const endpoints = [
  { id: "states", method: "GET", path: "/api/public/states", desc: "List all 30 states", res: { count: 30, data: [{ id: 27, state_code: "27", state_name: "Maharashtra" }] } },
  { id: "districts", method: "GET", path: "/api/public/districts", desc: "List districts (optional state_id)", res: { count: 580, data: [{ id: 520, district_code: "520", district_name: "Pune", state_id: 27 }] } },
  { id: "sub-districts", method: "GET", path: "/api/public/sub-districts", desc: "List sub-districts", res: { count: 5696, data: [{ id: 4567, subdistrict_name: "Haveli" }] } },
  { id: "villages", method: "GET", path: "/api/public/villages", desc: "List villages by sub-district", res: { count: 100, data: [{ id: 1, village_name: "Aundh" }] } },
  { id: "search", method: "GET", path: "/api/public/search", desc: "Hierarchical village search", res: { total: 1, data: [{ village_name: "Manibeli", state_name: "Maharashtra" }] } },
  { id: "autocomplete", method: "GET", path: "/api/public/autocomplete", desc: "Autocomplete suggestions", res: { data: [{ village_name: "Manibeli" }] } },
];

function DocsPage() {
  const [active, setActive] = useState("overview");
  const all = [...sections.map(s => ({ id: s.id, title: s.title })), ...endpoints.map(e => ({ id: e.id, title: e.path }))];
  const current = endpoints.find(e => e.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-sm text-muted-foreground">Reference for the All India Villages API.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sidebar</p>
          {all.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                active === s.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {s.title}
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          {sections.find(s => s.id === active) ? (
            <Card><CardContent className="space-y-3 p-6">
              <h2 className="text-xl font-semibold">{sections.find(s => s.id === active)!.title}</h2>
              {sections.find(s => s.id === active)!.body}
            </CardContent></Card>
          ) : current && (
            <>
              <Card>
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500">{current.method}</Badge>
                    <code className="font-mono text-sm">{current.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{current.desc}</p>
                </CardContent>
              </Card>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card><CardContent className="p-0">
                  <div className="border-b px-4 py-2 text-xs font-medium text-muted-foreground">Request</div>
                  <CodeBlock>{`curl -H "x-api-key: aiv_••••" \\
  https://api.allindia.dev${current.path}`}</CodeBlock>
                </CardContent></Card>
                <Card><CardContent className="p-0">
                  <div className="flex items-center justify-between border-b px-4 py-2 text-xs font-medium text-muted-foreground">JSON response<span className="text-emerald-600">200 OK</span></div>
                  <CodeBlock>{JSON.stringify(current.res, null, 2)}</CodeBlock>
                </CardContent></Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return <pre className="overflow-x-auto bg-foreground p-4 font-mono text-xs leading-relaxed text-background">{children}</pre>;
}
