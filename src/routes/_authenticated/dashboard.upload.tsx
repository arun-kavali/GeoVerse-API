import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/upload")({
  component: UploadPage,
});

type Phase = "idle" | "uploading" | "validating" | "importing" | "done";

function UploadPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [filename, setFilename] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onFile = (f: File) => {
    setFilename(f.name);
    setPhase("uploading");
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 9, 100);
        if (next >= 100) {
          clearInterval(t);
          setPhase("validating");
          setTimeout(() => setPhase("importing"), 700);
          setTimeout(() => setPhase("done"), 2000);
        }
        return next;
      });
    }, 120);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dataset Upload</h1>
        <p className="text-sm text-muted-foreground">Drag-and-drop XLS/XLSX/CSV to import into the geographic hierarchy.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Drag-and-drop file</CardTitle></CardHeader>
        <CardContent>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-14 text-center hover:bg-muted/50"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Drop file here or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports .xls, .xlsx, .csv up to 200 MB</p>
            </div>
            <input type="file" accept=".xls,.xlsx,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            <Button type="button" variant="outline" size="sm">Browse files</Button>
          </label>
        </CardContent>
      </Card>

      {filename && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /> {filename}</CardTitle>
            <CardDescription>Import progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Step label="Uploading" active={phase === "uploading"} done={phase !== "idle" && phase !== "uploading"} />
            <Progress value={phase === "uploading" ? progress : 100} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Step label="Validating" active={phase === "validating"} done={phase === "importing" || phase === "done"} />
              <Step label="Importing" active={phase === "importing"} done={phase === "done"} />
              <Step label="Complete" active={false} done={phase === "done"} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Validation Results</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ResultRow ok label="State column detected" />
            <ResultRow ok label="District column detected" />
            <ResultRow ok label="Sub-district column detected" />
            <ResultRow ok label="Village column detected" />
            <ResultRow ok label="No duplicate codes" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Error Logs</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-amber-700"><AlertTriangle className="mt-0.5 h-4 w-4" /> Row 4218: missing village_code (skipped)</li>
              <li className="flex items-start gap-2 text-amber-700"><AlertTriangle className="mt-0.5 h-4 w-4" /> Row 9012: aggregate row (filtered)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Success Summary</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          <Mini label="Inserted" value="619,245" />
          <Mini label="Skipped" value="234" />
          <Mini label="Duplicates" value="0" />
          <Mini label="Time" value="48s" />
        </CardContent>
      </Card>
    </div>
  );
}

function Step({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {done ? "✓" : "•"}
      </div>
      <span className={done || active ? "text-sm font-medium" : "text-sm text-muted-foreground"}>{label}</span>
    </div>
  );
}

function ResultRow({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className={`h-4 w-4 ${ok ? "text-emerald-500" : "text-muted-foreground"}`} />
      <span>{label}</span>
      <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700">OK</Badge>
    </div>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
