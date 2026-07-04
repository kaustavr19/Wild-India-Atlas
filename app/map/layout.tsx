import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Wildlife Map — Wild India Atlas",
  description: "Explore India's wildlife hotspots on an interactive map — clustered by region, colored by ecosystem, with layer toggles for wildlife type and season.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
