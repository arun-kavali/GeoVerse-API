import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dark, setDark] = useState(false);
  const [emails, setEmails] = useState(true);
  const [usageAlerts, setUsageAlerts] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
      setName((data.user?.user_metadata?.name as string) ?? "");
    })();
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, security and preferences.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle><CardDescription>Public account information</CardDescription></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={email} disabled /></div>
          <div className="sm:col-span-2"><Button onClick={() => toast.success("Profile saved")}>Save changes</Button></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">API Limits</CardTitle><CardDescription>Per-key default quota</CardDescription></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Default monthly quota</Label><Input defaultValue="10000" type="number" /></div>
          <div className="space-y-1.5"><Label>Plan</Label><Input value="Startup" disabled /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Security</CardTitle><CardDescription>Account-level security controls</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <Toggle label="Two-factor authentication" desc="Require a verification code on every sign-in" />
          <Toggle label="IP allowlist" desc="Restrict API key usage to specific IPs" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Theme</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="font-medium">Dark mode</div>
            <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
          </div>
          <Switch checked={dark} onCheckedChange={toggleDark} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Toggle label="Email updates" desc="Product news and changelog" checked={emails} onChange={setEmails} />
          <Toggle label="Usage alerts" desc="Email me when a key reaches 80% quota" checked={usageAlerts} onChange={setUsageAlerts} />
        </CardContent>
      </Card>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked?: boolean; onChange?: (v: boolean) => void }) {
  const [local, setLocal] = useState(checked ?? false);
  const value = checked ?? local;
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={value} onCheckedChange={(v) => (onChange ? onChange(v) : setLocal(v))} />
    </div>
  );
}
