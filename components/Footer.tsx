import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";

const explore = [
  { label: "Interactive map", href: "/map" },
  { label: "Wildlife hotspots", href: "/hotspots" },
  { label: "Species guide", href: "/species" },
  { label: "Field journal", href: "/field-journal" },
  { label: "Seasonal planner", href: "/seasonal-planner" },
];

const fieldwork = [
  { label: "How we verify", href: "/data-sources" },
  { label: "About the atlas", href: "/#about" },
  { label: "View source", href: "https://github.com/kaustavr19/Wild-India-Atlas", external: true },
];

export function Footer() {
  return (
    <footer className="biome-surface biome-forest texture-grain texture-topography mt-16 overflow-hidden text-biome-ink">
      <div className="relative z-[1] mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 border-b border-white/15 pb-12 lg:grid-cols-[1fr_0.78fr] lg:items-end">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/brand/logomark-white.svg" alt="" width={48} height={32} className="h-9 w-auto" />
              <span className="font-display text-2xl">Wild India Atlas</span>
            </Link>
            <p className="display-section mt-8 max-w-4xl text-biome-ink">Leave with a route. Return with a field note.</p>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-sm leading-6 text-biome-ink/78">A map-first guide to India&apos;s wildlife, seasons and protected places—built from local data and traceable field sources.</p>
            <Link href="/map" className="atlas-button mt-6">Open the wildlife map <ArrowUpRight size={15} /></Link>
          </div>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_0.55fr_0.55fr]">
          <div>
            <div className="flex items-center gap-2 text-biome-accent"><Compass size={15} /><span className="field-label">Field station</span></div>
            <p className="field-label mt-4 text-biome-ink/72">22.9734° N · 78.6569° E</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-biome-ink/76">Static by design. No visitor account, live booking database or hidden recommendation engine.</p>
          </div>
          <nav aria-label="Explore">
            <p className="field-label text-biome-accent">Explore</p>
            <div className="mt-4 grid gap-3">
              {explore.map((item) => <Link key={item.href} href={item.href} className="text-sm text-biome-ink/80 transition hover:text-biome-accent">{item.label}</Link>)}
            </div>
          </nav>
          <nav aria-label="Fieldwork">
            <p className="field-label text-biome-accent">Fieldwork</p>
            <div className="mt-4 grid gap-3">
              {fieldwork.map((item) => (
                <Link key={item.href} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="inline-flex items-center gap-1 text-sm text-biome-ink/80 transition hover:text-biome-accent">
                  {item.label}{item.external && <ArrowUpRight size={12} />}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-6 text-[11px] text-biome-ink/72 sm:flex-row sm:items-center sm:justify-between">
          <p>Wild India Atlas · Independent field-guide prototype</p>
          <p>Travel conditions change. Confirm permits and access locally.</p>
        </div>
      </div>
    </footer>
  );
}
