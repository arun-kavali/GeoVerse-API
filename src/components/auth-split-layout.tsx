import { ReactNode } from "react";
import logoAi from "@/assets/logo-ai.png";
import authSide from "@/assets/auth-side.jpg";

export function AuthSplitLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <img src={logoAi} alt="All India logo" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            <span className="text-base font-semibold">All India</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-indigo-700 md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center justify-center pt-4">
            <img
              src={authSide}
              alt="India villages data network"
              width={1024}
              height={1280}
              loading="lazy"
              className="max-h-[55vh] w-auto rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
            />
          </div>
          <div>
            <blockquote className="max-w-md text-2xl font-medium leading-snug">
              "Inspiring data intelligence and powering insights to compose the best address intelligence in India."
            </blockquote>
            <p className="mt-4 text-sm opacity-80">— All India Villages API</p>
          </div>
        </div>
      </div>
    </div>
  );
}
