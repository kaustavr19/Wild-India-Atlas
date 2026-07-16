"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Switch to light mode" : "Switch to dark mode"} className="grid h-9 w-9 place-items-center rounded-full border border-transparent text-biome-ink/78 transition hover:border-biome-accent/45 hover:bg-white/10 hover:text-biome-accent">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
