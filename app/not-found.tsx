import Link from "next/link";
import { ArrowLeft, MapPinned } from "lucide-react";

export default function NotFound() {
  return (
    <main className="biome-surface biome-alpine texture-grain texture-topography grid min-h-[76vh] place-items-center px-5 pb-16 pt-28">
      <div className="relative z-[1] max-w-2xl text-center">
        <MapPinned className="mx-auto text-biome-accent" size={40} strokeWidth={1.5} />
        <p className="field-label mt-6 text-biome-accent">Field coordinate · 404</p>
        <h1 className="display-section mt-4 text-biome-ink">This trail leaves the mapped country.</h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-biome-ink/65">The page may have moved, or the observation point was never recorded. Return to the atlas and choose another bearing.</p>
        <Link href="/map" className="atlas-button mt-8"><ArrowLeft size={15} /> Return to the map</Link>
      </div>
    </main>
  );
}
