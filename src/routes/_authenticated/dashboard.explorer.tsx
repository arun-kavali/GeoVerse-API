import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/explorer")({
  component: ExplorerPage,
});

type Row = {
  village_id: number;
  village_code: string;
  village_name: string;
  subdistrict_name: string;
  district_name: string;
  state_name: string;
  total_count: number;
};

function ExplorerPage() {
  const [apiKey, setApiKey] = useState("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("api_keys").select("api_key").limit(1).maybeSingle();
      if (data?.api_key) setApiKey(data.api_key);
    })();
  }, []);

  const search = async () => {
    if (!apiKey) return toast.error("Generate an API key on the dashboard first");
    setLoading(true);
    try {
      const res = await fetch(`/api/public/search?q=${encodeURIComponent(q)}&limit=50`, {
        headers: { "x-api-key": apiKey },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setRows(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Explorer</h1>
        <p className="text-muted-foreground">Live test the village search API</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Query</CardTitle>
          <CardDescription>Search 619,000+ Indian villages by name (prefix match).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="font-mono text-xs" />
          <div className="flex gap-2">
            <Input
              placeholder="Search villages (e.g. Manibeli)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <Button onClick={search} disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
          </div>
          {total > 0 && <p className="text-sm text-muted-foreground">Showing {rows.length} of {total.toLocaleString()} results</p>}
        </CardContent>
      </Card>
      {rows.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Village</TableHead>
                  <TableHead>Sub-District</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.village_id}>
                    <TableCell className="font-medium">{r.village_name}</TableCell>
                    <TableCell>{r.subdistrict_name}</TableCell>
                    <TableCell>{r.district_name}</TableCell>
                    <TableCell>{r.state_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
