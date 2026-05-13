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

export const Route = createFileRoute("/_authenticated/dashboard/api-keys")({
  component: ApiKeysPage,
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
  return `aiv_${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setKeys((data ?? []) as ApiKey[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createKey = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("api_keys").insert({ user_id: u.user.id, api_key: generateKey(), name: newName || "Default" });
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

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied"); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
        <p className="text-sm text-muted-foreground">Generate and manage keys to call the platform's REST API.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4" /> Keys</CardTitle>
          <CardDescription>Use these keys with <code className="rounded bg-muted px-1">x-api-key</code> header.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Key name (e.g. Production)" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button onClick={createKey}>Generate key</Button>
          </div>

          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : keys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell>
                      <button onClick={() => copy(k.api_key)} className="inline-flex items-center gap-1.5 rounded bg-muted px-2 py-1 font-mono text-xs hover:bg-muted/70">
                        {k.api_key.slice(0, 18)}…<Copy className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell><Badge variant={k.status === "active" ? "default" : "secondary"} className={k.status === "active" ? "bg-emerald-500" : ""}>{k.status}</Badge></TableCell>
                    <TableCell className="text-sm">{k.usage_count.toLocaleString()} / {k.usage_limit.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteKey(k.id)}><Trash2 className="h-4 w-4" /></Button>
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
