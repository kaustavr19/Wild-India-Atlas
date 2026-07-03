"use client";
import Link from "next/link"; import Image from "next/image"; import { Menu, X } from "lucide-react"; import { useState } from "react"; import { ThemeToggle } from "./ThemeToggle";
const nav = [{label:"Map",href:"/map"},{label:"Hotspots",href:"/hotspots"},{label:"Species",href:"#species",disabled:true},{label:"Seasonal Planner",href:"#seasonal",disabled:true},{label:"About",href:"/#about"}];
export function Header(){ const [open,setOpen]=useState(false); return <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
  <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-white/15 bg-forest-900/70 px-4 py-2.5 shadow-lg backdrop-blur-xl sm:px-5">
    <Link href="/" className="flex items-center gap-2.5 font-bold text-white">
      <Image src="/brand/logomark-white.svg" alt="" width={36} height={24} className="h-7 w-auto"/>
      <span className="hidden sm:inline">Wild India Atlas</span>
    </Link>
    <nav className="hidden items-center gap-6 md:flex">
      {nav.map(item=>item.disabled
        ? <span key={item.label} className="font-mono text-xs font-semibold uppercase tracking-wider text-white/35" title="Coming later">{item.label}</span>
        : <Link key={item.label} className="border-b-2 border-transparent py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:border-flare hover:text-flare" href={item.href}>{item.label}</Link>
      )}
    </nav>
    <div className="flex items-center gap-1">
      <ThemeToggle/>
      <button className="grid h-8 w-8 place-items-center rounded-full text-white/80 hover:bg-white/10 md:hidden" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X size={18}/>:<Menu size={18}/>}</button>
    </div>
  </header>
  {open && (
    <div className="mx-auto mt-2 max-w-5xl rounded-sm border border-white/15 bg-forest-900/85 p-2 backdrop-blur-xl md:hidden">
      {nav.map(item=>item.disabled
        ? <div key={item.label} className="px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white/35">{item.label} · Coming later</div>
        : <Link key={item.label} className="block rounded-sm px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white/80 hover:bg-white/10 hover:text-flare" href={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>
      )}
    </div>
  )}
</div>; }
