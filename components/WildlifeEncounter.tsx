"use client";

import { AudioLines, Eye, Footprints, Quote, Volume1, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SpeciesEncounter } from "@/data/speciesEncounters";
import { SpeciesImage } from "./SpeciesImage";
import { useSoundPreference } from "./SoundPreference";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [audioErrorCode, setAudioErrorCode] = useState("");
  const [volume, setVolume] = useState(65);
  const [saveData, setSaveData] = useState(false);
  const actRefs = useRef<Array<HTMLElement | null>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { soundEnabled, setSoundEnabled } = useSoundPreference();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wia-sound-volume");
      const storedVolume = stored === null ? Number.NaN : Number(stored);
      if (Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 100) setVolume(storedVolume);
    } catch {}
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setSaveData(connection?.saveData === true);
  }, []);

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

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    const audio = audioRef.current;
    const target = ([0.11, 0.145, 0.18, 0.09][activeAct] ?? 0.12) * (volume / 100);
    if (fadeRef.current) clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      const delta = target - audio.volume;
      if (Math.abs(delta) < 0.008) {
        audio.volume = target;
        if (fadeRef.current) clearInterval(fadeRef.current);
        fadeRef.current = null;
        return;
      }
      audio.volume = Math.max(0, Math.min(1, audio.volume + delta * 0.24));
    }, 55);
    return () => { if (fadeRef.current) clearInterval(fadeRef.current); };
  }, [activeAct, isPlaying, volume]);

  useEffect(() => () => {
    if (fadeRef.current) clearInterval(fadeRef.current);
    audioRef.current?.pause();
  }, []);

  async function toggleSoundscape() {
    setAudioError("");
    setAudioErrorCode("");
    if (saveData) {
      setAudioError("Data Saver is active, so this soundscape has not been loaded.");
      setAudioErrorCode("SaveData");
      return;
    }
    if (!audioRef.current) {
      const audio = new Audio(encounter.soundscape.src);
      audio.loop = true;
      audio.preload = "none";
      audio.volume = 0.01;
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setSoundEnabled(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setSoundEnabled(true);
    } catch (error) {
      const code = error instanceof DOMException ? error.name : "PlaybackError";
      setAudioError(code === "NotAllowedError" ? "Your browser blocked sound. Allow audio for this site and try again." : "Sound could not be loaded. Check your connection and try again.");
      setAudioErrorCode(code);
      setIsPlaying(false);
      setSoundEnabled(false);
    }
  }

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
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="rounded-full border border-white/15 bg-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-biome-ink/68 backdrop-blur-md">Act {String(activeAct + 1).padStart(2, "0")}</div>
                  <button type="button" onClick={toggleSoundscape} aria-pressed={isPlaying} data-audio-state={isPlaying ? "playing" : "paused"} data-audio-error={audioErrorCode || undefined} className="encounter-sound-button shell-chrome inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-biome-ink transition hover:border-biome-accent hover:text-biome-accent">
                    {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}{isPlaying ? "Sound on" : soundEnabled ? "Start sound" : "Sound off"}
                  </button>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="mb-5 flex gap-1.5" aria-hidden="true">
                  {encounter.acts.map((act, index) => <span key={act.time} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${index <= activeAct ? "bg-biome-accent" : "bg-white/18"}`} />)}
                </div>
                <div className="shell-chrome rounded-field p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-biome-accent"><Volume2 size={17} /><span className="field-label">Field signal · {current.time}</span></div>
                  <p className="mt-3 font-display text-2xl leading-tight text-biome-ink sm:text-3xl">{current.signal}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="field-label text-biome-ink/44">Visual focus</span><span className="text-sm text-biome-ink/72">{current.visualFocus}</span></div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[10px] text-biome-ink/42"><span className="inline-flex items-center gap-1.5"><AudioLines size={12} />{encounter.soundscape.title}</span><a href={encounter.soundscape.sourcePage} target="_blank" rel="noreferrer" className="transition hover:text-biome-accent">{encounter.soundscape.author} · {encounter.soundscape.license}</a></div>
                  <label className="mt-3 flex min-h-11 items-center gap-3 border-t border-white/10 pt-3 text-biome-ink/48"><Volume1 size={14} /><span className="field-label shrink-0">Volume</span><input type="range" min="0" max="100" step="5" value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); try { localStorage.setItem("wia-sound-volume", String(next)); } catch {} }} aria-label="Soundscape volume" className="encounter-volume h-5 min-w-0 flex-1" /><span className="w-8 text-right font-mono text-[10px]">{volume}%</span></label>
                  {audioError && <p role="status" className="mt-3 text-xs text-biome-accent">{audioError}</p>}
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
