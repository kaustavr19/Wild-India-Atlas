"use client";

import { Eye, Footprints, Quote, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SpeciesEncounter } from "@/data/speciesEncounters";
import { SpeciesImage } from "./SpeciesImage";

export function WildlifeEncounter({
  encounter,
  speciesSlug,
  category,
}: {
  encounter: SpeciesEncounter;
  speciesSlug: string;
  category: string;
}) {
  const [activeAct, setActiveAct] = useState(0);
  const actRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number((visible.target as HTMLElement).dataset.actIndex ?? 0);
      setActiveAct(index);
    }, { rootMargin: "-24% 0px -42%", threshold: [0.2, 0.45, 0.7] });

    actRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = encounter.acts[activeAct];

  return (
    <section id="expedition" className="wildlife-encounter scroll-mt-32 border-b border-white/10 py-20 sm:py-28" aria-labelledby="expedition-title">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <p className="field-label text-biome-accent">02 · Field encounter</p>
          <h2 id="expedition-title" className="display-section mt-4 text-biome-ink">{encounter.title}</h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-biome-ink/62">{encounter.introduction}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-14">
          <div className="lg:sticky lg:top-36 lg:h-[calc(100vh-11rem)] lg:self-start">
            <figure className={`encounter-visual encounter-${speciesSlug} stage-${activeAct} relative h-[62svh] min-h-[480px] overflow-hidden rounded-field border border-white/10 lg:h-full`}>
              <SpeciesImage slug={speciesSlug} category={category} alt="" showCredit={false} className="absolute inset-0 h-full w-full" />
              <div className="encounter-visual-wash absolute inset-0" />
              <div className="texture-grain pointer-events-none absolute inset-0" />
              <div className="encounter-scan absolute inset-x-0 top-[22%] h-px bg-biome-accent/60" />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-7">
                <div><p className="field-label text-biome-accent">{encounter.eyebrow}</p><p className="mt-2 text-sm text-biome-ink/58">{encounter.place}</p></div>
                <div className="rounded-full border border-white/15 bg-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-biome-ink/68 backdrop-blur-md">Act {String(activeAct + 1).padStart(2, "0")}</div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="mb-5 flex gap-1.5" aria-hidden="true">
                  {encounter.acts.map((act, index) => <span key={act.time} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${index <= activeAct ? "bg-biome-accent" : "bg-white/18"}`} />)}
                </div>
                <div className="shell-chrome rounded-field p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-biome-accent"><Volume2 size={17} /><span className="field-label">Field signal · {current.time}</span></div>
                  <p className="mt-3 font-display text-2xl leading-tight text-biome-ink sm:text-3xl">{current.signal}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="field-label text-biome-ink/44">Visual focus</span><span className="text-sm text-biome-ink/72">{current.visualFocus}</span></div>
                </div>
              </div>
            </figure>
          </div>

          <div className="grid">
            {encounter.acts.map((act, index) => (
              <article
                key={act.time}
                ref={(node) => { actRefs.current[index] = node; }}
                data-act-index={index}
                aria-current={activeAct === index ? "step" : undefined}
                className={`encounter-act flex min-h-[68svh] flex-col justify-center border-l pl-6 transition sm:pl-9 lg:min-h-[78svh] ${activeAct === index ? "is-active border-biome-accent" : "border-white/12"}`}
              >
                <div className="flex items-center gap-3"><span className="field-label text-biome-accent">{act.time}</span><span className="h-px w-10 bg-biome-accent/45" /><span className="field-label text-biome-ink/38">Act {String(index + 1).padStart(2, "0")}</span></div>
                <h3 className="mt-5 font-display text-4xl text-biome-ink sm:text-5xl">{act.title}</h3>
                <p className="mt-6 max-w-xl text-base leading-8 text-biome-ink/64 sm:text-lg">{act.narrative}</p>
                <div className="mt-8 flex max-w-lg gap-4 border-t border-white/10 pt-5"><Footprints className="mt-0.5 shrink-0 text-biome-accent" size={19} /><div><p className="field-label text-biome-ink/38">Field note</p><p className="mt-2 text-sm leading-6 text-biome-ink/72">{act.fieldNote}</p></div></div>
              </article>
            ))}
          </div>
        </div>

        <blockquote className="mx-auto mt-12 max-w-4xl py-12 text-center sm:mt-20 sm:py-20">
          <Quote className="mx-auto text-biome-accent" size={28} strokeWidth={1.4} />
          <p className="mt-6 font-display text-3xl italic leading-tight text-biome-ink sm:text-5xl">{encounter.closing}</p>
          <div className="mt-7 inline-flex items-center gap-2 text-biome-ink/42"><Eye size={16} /><span className="field-label">Observe · understand · protect</span></div>
        </blockquote>
      </div>
    </section>
  );
}
