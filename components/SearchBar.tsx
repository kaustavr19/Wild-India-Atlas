import { Search } from "lucide-react";
// `variant="dark"` is an opt-in glass treatment for use on dark/photo backgrounds (the
// hero) — default stays the original light input untouched, since this same component is
// also reused on light backgrounds elsewhere (FilterPanel on /map and /hotspots).
export function SearchBar({ value, onChange, placeholder, variant = "light" }: { value: string; onChange: (value: string) => void; placeholder: string; variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <label className="relative block">
      <Search className={"absolute left-4 top-1/2 -translate-y-1/2 " + (dark ? "text-white/60" : "text-forest-700")} size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={"w-full rounded-sm py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 " + (dark
          ? "border border-white/25 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-md ring-sand/50 focus:border-white/40"
          : "border border-forest-700/15 bg-white/90 ring-forest-500/30")}
      />
    </label>
  );
}
