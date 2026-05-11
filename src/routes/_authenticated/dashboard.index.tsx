import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Copy, Trash2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
});

type ApiKey = {
  id: string;
  api_key: string;
  name: string;
  status: string;
  usage_count: number;
  usage_limit: number;
  created_at: string;
};

function generateKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `aiv_${hex}`;
}

function DashboardPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setKeys((data ?? []) as ApiKey[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createKey = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("api_keys").insert({
      user_id: u.user.id,
      api_key: generateKey(),
      name: newName || "Default",
    });
    if (error) return toast.error(error.message);
    toast.success("API key created");
    setNewName("");
    load();
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Key deleted");
    load();
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const totalUsage = keys.reduce((s, k) => s + k.usage_count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage API keys and usage</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardDescription>Total keys</CardDescription></CardHeader>
          <CardContent><div className="text-2xl font-bold">{keys.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Total requests</CardDescription></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Quota remaining</CardDescription></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {keys.reduce((s, k) => s + Math.max(k.usage_limit - k.usage_count, 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> API Keys</CardTitle>
          <CardDescription>Use these keys to call /api/public endpoints with the <code className="rounded bg-muted px-1">x-api-key</code> header.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Key name (e.g. Production)" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button onClick={createKey}>Generate key</Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : keys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell>
                      <button onClick={() => copy(k.api_key)} className="inline-flex items-center gap-1 font-mono text-xs hover:text-primary">
                        {k.api_key.slice(0, 14)}…<Copy className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell><Badge variant={k.status === "active" ? "default" : "secondary"}>{k.status}</Badge></TableCell>
                    <TableCell>{k.usage_count} / {k.usage_limit}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteKey(k.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
