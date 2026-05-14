import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logoAi from "@/assets/logo-ai.png";
import {
  ShieldCheck,
  Zap,
  Database,
  Code2,
  MapPin,
  GitBranch,
  Layers,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeoVerse API" },
      { name: "description", content: "Standardized Geographical Data for India" },
      { property: "og:title", content: "GeoVerse API" },
      { property: "og:description", content: "Production-ready REST API for India's full geographic hierarchy." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src={logoAi} alt="All India logo" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            <span className="text-base font-semibold tracking-tight">All India</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#docs" className="hover:text-foreground">Docs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to="/signup"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto grid gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 619,245 villages indexed
            </span>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Standardized <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Geographical Data</span> for India
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              The ultimate API platform for accurate States, Districts, Sub-Districts, and Villages — built for e-commerce, logistics, and government systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="gap-2">Get Free API Key <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">Learn more</Button>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-8">
              <Stat n="619K+" l="Villages" />
              <Stat n="30K+" l="Active users" />
              <Stat n="99.99%" l="Uptime" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl" />
            <Card className="relative border-2 shadow-2xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-muted-foreground">api.allindia.dev</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed">
<span className="text-muted-foreground">$ curl</span> <span className="text-emerald-600">https://api.allindia.dev/v1/search</span> \{"\n"}
{"  "}-H <span className="text-amber-600">"x-api-key: aiv_••••••"</span> \{"\n"}
{"  "}-G --data-urlencode <span className="text-amber-600">"q=Manibeli"</span>
{"\n\n"}
<span className="text-muted-foreground">{"// "}response 200 OK</span>{"\n"}
{`{
  "data": [{
    "village": "Manibeli",
    "subdistrict": "Akkalkuwa",
    "district": "Nandurbar",
    "state": "Maharashtra",
    "code": "549127"
  }],
  "total": 1
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for production scale</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to ship Indian address experiences your users will love.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={ShieldCheck} title="High Accuracy" desc="Census-grade geographic data, normalized and continuously verified." />
            <Feature icon={Zap} title="Reliable API" desc="Sub-100ms responses, 99.99% uptime SLA, global edge delivery." />
            <Feature icon={Layers} title="Scalable Infrastructure" desc="From a side project to billions of requests — same endpoint." />
            <Feature icon={Code2} title="Developer First" desc="Typed SDKs, OpenAPI spec, copy-paste curl examples in our playground." />
            <Feature icon={Database} title="Rich Dataset" desc="States → Districts → Sub-Districts → Villages with stable codes." />
            <Feature icon={GitBranch} title="Versioned" desc="Stable v1 endpoints with non-breaking changes you can rely on." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Tiered Pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you scale.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Plan name="Developer" price="Free" desc="For personal projects and prototypes." features={["10K requests / mo", "All endpoints", "Community support"]} />
            <Plan name="Startup" price="$29" desc="For growing teams shipping to production." features={["1M requests / mo", "Priority API", "Email support"]} highlighted />
            <Plan name="Enterprise" price="Custom" desc="For high-volume workloads & SLAs." features={["Unlimited requests", "Dedicated cluster", "24/7 support"]} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="docs" className="py-20">
        <div className="container mx-auto px-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-12 text-center text-primary-foreground shadow-2xl">
            <MapPin className="mx-auto mb-4 h-10 w-10 opacity-80" />
            <h2 className="text-3xl font-bold md:text-4xl">Get your free API key in 60 seconds</h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">No credit card required. Start querying 619K+ Indian villages today.</p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="mt-8 gap-2">Get Free API Key <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-foreground py-12 text-background">
        <div className="container mx-auto grid gap-10 px-6 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logoAi} alt="All India logo" width={32} height={32} loading="lazy" className="h-8 w-8 rounded-md bg-white/10 object-contain p-1" />
              <span className="font-semibold">All India</span>
            </div>
            <p className="mt-3 text-sm opacity-70">Standardized geographical data APIs for India.</p>
          </div>
          <FootCol title="Features" items={["States API", "Districts API", "Villages API", "Search"]} />
          <FootCol title="Pricing" items={["Developer", "Startup", "Enterprise"]} />
          <FootCol title="Login" items={["Sign in", "Get started", "API Docs"]} />
        </div>
        <div className="container mx-auto mt-10 px-6 text-xs opacity-60">© 2026 All India Villages API Platform.</div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tracking-tight">{n}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function Plan({ name, price, desc, features, highlighted }: { name: string; price: string; desc: string; features: string[]; highlighted?: boolean }) {
  return (
    <Card className={highlighted ? "relative border-2 border-primary shadow-xl" : ""}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most popular</span>
      )}
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          {price !== "Custom" && price !== "Free" && <span className="text-sm text-muted-foreground">/mo</span>}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex gap-2"><span className="text-primary">✓</span>{f}</li>
          ))}
        </ul>
        <Button className="mt-6 w-full" variant={highlighted ? "default" : "outline"}>Choose {name}</Button>
      </CardContent>
    </Card>
  );
}

function FootCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm opacity-70">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
