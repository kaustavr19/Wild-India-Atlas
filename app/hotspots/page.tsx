import type { Metadata } from "next";
import { HotspotsDiscovery } from "@/components/HotspotsDiscovery";

export const metadata: Metadata = {
  title: "Wildlife Places and Protected Landscapes",
  description: "Enter India's forests, wetlands, deserts, mountains, mangroves and marine wilds through 42 evidence-aware wildlife field guides.",
  alternates: { canonical: "/hotspots" },
  openGraph: { title: "Wildlife Places and Protected Landscapes", description: "Choose a landscape and follow what lives there across India's wildlife atlas.", url: "/hotspots", type: "website" },
};

export default function HotspotsPage() { return <HotspotsDiscovery />; }
