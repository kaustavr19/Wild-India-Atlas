import { BookOpen, ExternalLink, Navigation, Search, Ticket } from "lucide-react";
import type { Hotspot } from "@/data/types";
import { mapsDirectionsUrl, permitPortalUrl, searchUrl, wikipediaUrl } from "@/data/officialLinks";

export function PlanLinksCard({ hotspot }: { hotspot: Hotspot }) {
  const wiki = wikipediaUrl(hotspot.slug);
  const permitPortal = permitPortalUrl[hotspot.slug];
  const links = [
    { icon: Navigation, label: "Get directions", href: mapsDirectionsUrl(hotspot.coordinates.latitude, hotspot.coordinates.longitude) },
    ...(wiki ? [{ icon: BookOpen, label: "Read the overview", href: wiki }] : []),
    permitPortal
      ? { icon: Ticket, label: "Official permits & safari booking", href: permitPortal }
      : { icon: Ticket, label: "Search safari & permit booking", href: searchUrl(hotspot.name + " safari booking permits") },
    { icon: Search, label: "Find the official forest department page", href: searchUrl(hotspot.name + " official forest department") },
  ];
  return (
    <section className="field-card rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-forest-900">Plan your visit</h2>
      <p className="mt-1 text-sm text-slate-600">Live links to help with directions, background, and booking — schedules and permit rules change by season, so confirm with the official source before you travel.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map(({ icon: Icon, label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-forest-700/15 bg-white/70 px-3 py-2.5 text-sm font-semibold text-forest-900 transition hover:border-forest-700/30 hover:bg-white">
            <Icon size={16} className="text-forest-700" />
            <span className="flex-1">{label}</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>
        ))}
      </div>
    </section>
  );
}
