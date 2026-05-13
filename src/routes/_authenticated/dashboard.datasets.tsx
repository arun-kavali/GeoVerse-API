import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/datasets")({
  component: DatasetsPage,
});

function DatasetsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({ countries: 0, states: 0, districts: 0, sub_districts: 0, villages: 0 });

  useEffect(() => {
    (async () => {
      const tables = ["countries", "states", "districts", "sub_districts", "villages"] as const;
      const next: Record<string, number> = {};
      await Promise.all(tables.map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        next[t] = count ?? 0;
      }));
      setCounts(next);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Datasets</h1>
        <p className="text-sm text-muted-foreground">Live row counts across the geographic hierarchy.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(counts).map(([k, v]) => (
          <Card key={k}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="capitalize">{k.replace("_", "-")}</CardDescription>
                <Database className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{v.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schema</CardTitle>
          <CardDescription>countries → states → districts → sub_districts → villages</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs">
{`countries(id, code, name)
  └── states(id, country_id, state_code, state_name)
        └── districts(id, state_id, district_code, district_name)
              └── sub_districts(id, district_id, subdistrict_code, subdistrict_name)
                    └── villages(id, subdistrict_id, village_code, village_name)`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
