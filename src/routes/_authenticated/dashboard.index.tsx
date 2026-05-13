import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, KeyRound, Activity, Database } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: OverviewPage,
});

type ApiKey = {
  id: string;
  api_key: string;
  name: string;
  status: string;
  usage_count: number;
  usage_limit: number;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const chartData = months.map((m, i) => ({ m, requests: 60 + Math.round(Math.sin(i / 1.6) * 40 + 50 + i * 6) }));

function OverviewPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false });
    setKeys((data ?? []) as ApiKey[]);
  };
  useEffect(() => {
    load();
  }, []);

  const total = keys.reduce((s, k) => s + k.usage_count, 0);
  const limit = keys.reduce((s, k) => s + k.usage_limit, 0) || 1;
  const remaining = Math.max(limit - total, 0);

  const onAutocomplete = async () => {
    if (!search) return;
    const k = keys[0]?.api_key;
    if (!k) return toast.error("Generate an API key in API Keys page first");
    const r = await fetch(`/api/public/autocomplete?q=${encodeURIComponent(search)}&limit=10`, { headers: { "x-api-key": k } });
    const j = await r.json();
    if (!r.ok) return toast.error(j.error ?? "Failed");
    toast.success(`${j.data?.length ?? 0} results`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here's how your API is performing.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> API Key Management</CardDescription>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Active keys</div>
            <div className="text-3xl font-bold">{keys.filter((k) => k.status === "active").length}</div>
            <Button asChild variant="link" className="h-auto p-0 text-xs">
              <a href="/dashboard/api-keys">Manage keys <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2"><Activity className="h-4 w-4" /> Usage Statistics</CardDescription>
              <span className="text-xs text-muted-foreground">Current month</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Requests</div>
                <div className="text-3xl font-bold">{total.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Remaining</div>
                <div className="text-3xl font-bold text-primary">{remaining.toLocaleString()}</div>
              </div>
            </div>
            <Progress value={(total / limit) * 100} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Request Chart</CardTitle>
          <CardDescription>Requests across the last 12 months.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="requests" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Search Playground</CardTitle>
            <CardDescription>Try the autocomplete endpoint live.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="Autocomplete search…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAutocomplete()} />
              <Button onClick={onAutocomplete}>Search</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Tip: try "Mani", "Pune", or "Manibeli"</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Status" value={<Badge className="bg-emerald-500">Active</Badge>} />
            <Row label="Plan" value="Startup" />
            <Row label="Renewal" value="Jun 1, 2026" />
            <Button variant="outline" className="mt-2 w-full">Download invoice</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Hierarchical Filters</CardTitle>
            <CardDescription>State → District → Sub-District</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild><a href="/dashboard/explorer">Open explorer</a></Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <SelectStub label="State" />
          <SelectStub label="District" />
          <SelectStub label="Sub-District" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Results</CardTitle>
          <CardDescription>Sample dataset preview</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Sub-District</TableHead>
                <TableHead className="text-right">Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Manibeli", "Maharashtra", "Nandurbar", "Akkalkuwa", "549127"],
                ["Aundh", "Maharashtra", "Pune", "Haveli", "557213"],
                ["Karjat", "Maharashtra", "Raigad", "Karjat", "557814"],
                ["Wai", "Maharashtra", "Satara", "Wai", "560482"],
              ].map((r) => (
                <TableRow key={r[0]}>
                  <TableCell className="font-medium">{r[0]}</TableCell>
                  <TableCell>{r[1]}</TableCell>
                  <TableCell>{r[2]}</TableCell>
                  <TableCell>{r[3]}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r[4]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Database className="h-4 w-4" /> Sample Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-foreground p-4 font-mono text-xs leading-relaxed text-background">
{`// fetch villages for a sub-district
const res = await fetch(
  "/api/public/villages?subdistrict_id=4567",
  { headers: { "x-api-key": "aiv_••••" } }
);
const { data } = await res.json();`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>
  );
}
function SelectStub({ label }: { label: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <button className="flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-muted-foreground hover:bg-muted">
        <span>{label}</span>
        <span>▾</span>
      </button>
    </div>
  );
}
