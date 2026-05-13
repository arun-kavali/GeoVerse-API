import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/dashboard/api-logs")({
  component: ApiLogsPage,
});

type Log = {
  id: number;
  endpoint: string;
  status_code: number | null;
  response_time_ms: number | null;
  request_time: string;
};

function ApiLogsPage() {
  const [rows, setRows] = useState<Log[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("api_logs").select("*").order("request_time", { ascending: false }).limit(100);
      setRows((data ?? []) as Log[]);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Logs</h1>
        <p className="text-sm text-muted-foreground">Last 100 requests across your keys.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent requests</CardTitle><CardDescription>Sorted by time, newest first</CardDescription></CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests yet. Try the Search Playground or call the API.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.endpoint}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={r.status_code && r.status_code < 400 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                        {r.status_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.response_time_ms ?? 0} ms</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{new Date(r.request_time).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
