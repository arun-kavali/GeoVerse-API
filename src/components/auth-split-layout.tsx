import { ReactNode } from "react";

export function AuthSplitLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">AI</div>
            <span className="text-base font-semibold">All India</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-indigo-700 md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-end p-12 text-primary-foreground">
          <blockquote className="max-w-md text-2xl font-medium leading-snug">
            "Inspiring data intelligence and powering insights to compose the best address intelligence in India."
          </blockquote>
          <p className="mt-4 text-sm opacity-80">— All India Villages API</p>
        </div>
      </div>
    </div>
  );
}
