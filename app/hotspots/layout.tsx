import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Wildlife Hotspots — Wild India Atlas",
  description: "Browse 24 Indian wildlife destinations — tiger reserves, bird sanctuaries, wetlands, and Himalayan sanctuaries — filterable by region, season, wildlife type, and experience.",
};

export default function HotspotsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
