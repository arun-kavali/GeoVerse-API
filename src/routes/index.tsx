import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "All India Villages API — 619K+ Indian villages, one REST endpoint" },
      { name: "description", content: "Production-ready REST API for India's geographic hierarchy: States, Districts, Sub-Districts and 619K+ Villages." },
      { property: "og:title", content: "All India Villages API" },
      { property: "og:description", content: "REST API and dashboard for India's full geographic hierarchy." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto flex items-center justify-between px-4 py-4">
        <span className="text-lg font-semibold">🇮🇳 Villages API</span>
        <nav className="flex gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm">Get an API key</Button></Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          India's geography, in one REST API
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          619,245 villages. 5,696 sub-districts. 580 districts. 30 states.
          Hierarchical, normalized, and ready to drop into your address forms.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/signup"><Button size="lg">Get started free</Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
        </div>
        <pre className="mx-auto mt-12 max-w-2xl overflow-x-auto rounded-lg bg-foreground p-4 text-left text-sm text-background">
{`curl -H "x-api-key: YOUR_KEY" \\
  https://yourapp.com/api/public/search?q=manibeli`}
        </pre>
      </main>
    </div>
  );
}
