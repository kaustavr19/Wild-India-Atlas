import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <main className="biome-surface biome-forest texture-grain texture-topography grid min-h-[72vh] place-items-center px-5 pb-16 pt-28">
      <div className="relative z-[1] text-center">
        <span className="motion-float mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/10 text-biome-accent shadow-insetGlow"><Compass size={25} /></span>
        <p className="field-label mt-6 text-biome-accent">Reading the landscape</p>
        <p className="mt-2 font-display text-2xl text-biome-ink">Opening the field atlas…</p>
      </div>
    </main>
  );
}
