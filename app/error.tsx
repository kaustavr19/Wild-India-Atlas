"use client";

import Link from "next/link";
import { RefreshCcw, TentTree } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="biome-surface biome-desert texture-grain texture-topography grid min-h-[76vh] place-items-center px-5 pb-16 pt-28">
      <div className="relative z-[1] max-w-2xl text-center">
        <TentTree className="mx-auto text-biome-accent" size={42} strokeWidth={1.5} />
        <p className="field-label mt-6 text-biome-accent">Field interruption</p>
        <h1 className="display-section mt-4 text-biome-ink">We lost the trail for a moment.</h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-biome-ink/65">Your route and filters have not been intentionally changed. Try reading this section again or return to the main atlas.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="atlas-button"><RefreshCcw size={15} /> Try again</button>
          <Link href="/" className="atlas-button atlas-button-ghost">Return home</Link>
        </div>
      </div>
    </main>
  );
}
