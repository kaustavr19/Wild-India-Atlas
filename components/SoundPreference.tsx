"use client";

import { Volume2, VolumeX } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SOUND_KEY = "wia-ambient-sound";

type SoundPreferenceValue = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
};

const SoundPreferenceContext = createContext<SoundPreferenceValue | null>(null);

export function SoundPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    try { setSoundEnabled(localStorage.getItem(SOUND_KEY) === "on"); } catch {}
  }, []);

  const value = useMemo<SoundPreferenceValue>(() => ({
    soundEnabled,
    setSoundEnabled: (enabled) => {
      setSoundEnabled(enabled);
      try { localStorage.setItem(SOUND_KEY, enabled ? "on" : "off"); } catch {}
    },
    toggleSound: () => {
      setSoundEnabled((current) => {
        const next = !current;
        try { localStorage.setItem(SOUND_KEY, next ? "on" : "off"); } catch {}
        return next;
      });
    },
  }), [soundEnabled]);

  return <SoundPreferenceContext.Provider value={value}>{children}</SoundPreferenceContext.Provider>;
}

export function useSoundPreference() {
  const value = useContext(SoundPreferenceContext);
  if (!value) throw new Error("useSoundPreference must be used inside SoundPreferenceProvider");
  return value;
}

export function SoundPreferenceToggle({ className = "" }: { className?: string }) {
  const { soundEnabled, toggleSound } = useSoundPreference();
  return (
    <button
      type="button"
      aria-label={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={soundEnabled}
      onClick={toggleSound}
      className={`atlas-chip transition hover:border-biome-accent hover:text-biome-accent ${className}`}
    >
      {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      Sound {soundEnabled ? "on" : "off"}
    </button>
  );
}
