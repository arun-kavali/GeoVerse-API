import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUp, Users, Activity, MapPin, UserPlus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/analytics")({
  component: AnalyticsPage,
});

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const usage = months.map((m, i) => ({
  m,
  requests: 60 + Math.round(Math.sin(i / 1.6) * 40 + 50 + i * 5),
  responses: 50 + Math.round(Math.cos(i / 1.5) * 35 + 40 + i * 4.5),
}));
const search = months.map((m, i) => ({
  m,
  searches: 30 + Math.round(Math.sin(i / 2) * 30 + 35 + i * 4),
}));
const recent = [
  { who: "Saurabh Khanna", what: "Renewed", when: "2 hours ago" },
  { who: "Manish Kumar", what: "Joined", when: "3 hours ago" },
  { who: "Priya Singh", what: "Upgraded plan", when: "5 hours ago" },
  { who: "Rahul Verma", what: "API key created", when: "Today" },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Real-time platform metrics & growth trends.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Total Users" value="12,548" delta="+12.3%" icon={Users} />
        <Kpi title="API Requests" value="2,304K" delta="+8.7%" icon={Activity} />
        <Kpi title="Villages Indexed" value="619,245" delta="+0.0%" icon={MapPin} />
        <Kpi title="New Signups" value="312" delta="+24.1%" icon={UserPlus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Usage Chart</CardTitle>
          <CardDescription>Requests vs responses over the year.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="requests" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="responses" fill="oklch(0.7 0.18 280)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r.who} className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">{r.who.split(" ").map(s => s[0]).join("")}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.who}</div>
                    <div className="text-xs text-muted-foreground">{r.what}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Analytics</CardTitle>
            <CardDescription>Top searches per month</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={search}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="searches" stroke="var(--color-primary)" fill="url(#ga)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Activity</CardTitle>
          <CardDescription>Active users per day</CardDescription>
        </CardHeader>
        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="requests" stroke="oklch(0.65 0.2 160)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="responses" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Heatmaps — Endpoint Activity</CardTitle>
          <CardDescription>Hour × day of week (last 28 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap />
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ title, value, delta, icon: Icon }: { title: string; value: string; delta: string; icon: any }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
          <ArrowUp className="h-3 w-3" /> {delta}
        </div>
      </CardContent>
    </Card>
  );
}

function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="ml-12 mb-1 grid grid-cols-24 gap-1 text-[10px] text-muted-foreground" style={{ gridTemplateColumns: "repeat(24, minmax(0,1fr))" }}>
          {hours.map((h) => <div key={h} className="text-center">{h}</div>)}
        </div>
        {days.map((d, di) => (
          <div key={d} className="mb-1 flex items-center gap-2">
            <div className="w-10 text-xs text-muted-foreground">{d}</div>
            <div className="grid flex-1 gap-1" style={{ gridTemplateColumns: "repeat(24, minmax(0,1fr))" }}>
              {hours.map((h) => {
                const v = (Math.sin((h + di) / 2.3) + 1) / 2;
                return <div key={h} className="aspect-square rounded-sm" style={{ background: `oklch(${0.55 - v * 0.15} ${0.05 + v * 0.2} 268)`, opacity: 0.2 + v * 0.8 }} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
