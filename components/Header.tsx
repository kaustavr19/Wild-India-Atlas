"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Compass, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { routeAtmosphere } from "@/lib/routeAtmosphere";
import { SoundPreferenceToggle } from "./SoundPreference";
import { ThemeToggle } from "./ThemeToggle";
import { JournalShortcut } from "./JournalShortcut";
import { JourneyShortcut } from "./JourneyShortcut";

const nav: Array<{ label: string; href: string; number: string; description: string; disabled?: boolean }> = [
  { label: "Map", href: "/map", number: "01", description: "Read India by habitat, season and species." },
  { label: "Hotspots", href: "/hotspots", number: "02", description: "Explore national parks, wetlands and reserves." },
  { label: "Species", href: "/species", number: "03", description: "Plan journeys around the wildlife you hope to see." },
  { label: "Field journal", href: "/field-journal", number: "04", description: "Keep the species, places and field notes that call you back." },
  { label: "Seasonal planner", href: "/seasonal-planner", number: "05", description: "Follow migrations, monsoons and forest seasons." },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const atmosphere = routeAtmosphere(pathname);
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const obscuredContent = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    obscuredContent.forEach((element) => { element.inert = true; });
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      obscuredContent.forEach((element) => { element.inert = false; });
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <div className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 ${atmosphere.className}`}>
        <header className="shell-chrome mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 font-bold text-biome-ink">
            <Image src="/brand/logomark-white.svg" alt="" width={36} height={24} className="h-7 w-auto shrink-0" />
            <span className="hidden truncate sm:inline">Wild India Atlas</span>
          </Link>

          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            <span className="motion-pulse-soft h-1.5 w-1.5 shrink-0 rounded-full bg-biome-accent" />
            <span className="field-label truncate text-biome-ink/78">{atmosphere.label}</span>
          </div>

          <nav className="hidden items-center gap-5 md:flex" aria-label="Primary navigation">
            {nav.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`shell-nav-link field-label ${isActive(pathname, item.href) ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <JourneyShortcut />
            <JournalShortcut />
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close atlas navigation" : "Open atlas navigation"}
              aria-expanded={open}
              aria-controls="atlas-navigation"
              onClick={() => setOpen((current) => !current)}
              className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-2.5 text-biome-ink transition hover:border-biome-accent hover:text-biome-accent sm:px-3"
            >
              <span className="field-label hidden sm:inline">{open ? "Close" : "Explore"}</span>
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </header>
      </div>

      {open && (
        <div id="atlas-navigation" role="dialog" aria-modal="true" aria-label="Atlas navigation" className={`shell-overlay biome-surface texture-grain texture-topography fixed inset-0 z-40 overflow-y-auto ${atmosphere.className}`}>
          <div className="mx-auto grid min-h-full max-w-7xl gap-10 px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[1fr_0.36fr] lg:items-end lg:gap-16 lg:pb-14">
            <div>
              <div className="mb-7 flex items-center gap-3 text-biome-ink/55">
                <Compass size={18} />
                <span className="field-label">Choose a way into the wild</span>
              </div>
              <nav className="border-t border-white/15" aria-label="Atlas sections">
                {nav.map((item) => item.disabled ? (
                  <div key={item.label} className="grid gap-2 border-b border-white/15 py-5 opacity-45 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-5 sm:py-6">
                    <span className="field-label text-biome-accent">{item.number}</span>
                    <div>
                      <span className="font-display text-3xl text-biome-ink sm:text-5xl">{item.label}</span>
                      <p className="mt-1 text-sm text-biome-ink/60">{item.description}</p>
                    </div>
                    <span className="field-label text-biome-ink/60">Coming next</span>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group grid gap-2 border-b border-white/15 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-5 sm:py-6"
                  >
                    <span className="field-label text-biome-accent">{item.number}</span>
                    <div>
                      <span className="font-display text-3xl text-biome-ink transition group-hover:text-biome-accent sm:text-5xl">{item.label}</span>
                      <p className="mt-1 text-sm text-biome-ink/60">{item.description}</p>
                    </div>
                    <ArrowUpRight className="hidden text-biome-ink/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-biome-accent sm:block" size={23} />
                  </Link>
                ))}
              </nav>
            </div>

            <aside className="border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="field-label text-biome-accent">Current bearing</p>
              <p className="mt-3 font-display text-2xl text-biome-ink">{atmosphere.label}</p>
              <p className="field-label mt-2 text-biome-ink/45">{atmosphere.coordinate}</p>
              <p className="mt-6 max-w-sm text-sm leading-6 text-biome-ink/65">Wild India Atlas combines field inspiration with practical, source-aware travel planning.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <SoundPreferenceToggle />
                <Link href="/data-sources" onClick={() => setOpen(false)} className="atlas-chip transition hover:border-biome-accent hover:text-biome-accent">Field methods</Link>
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
