import { Bird, Fish, Leaf, Mountain, PawPrint, Sprout, TreePalm, Trees, Waves } from "lucide-react";
import type { HotspotType } from "@/data/types";

const gradient: Record<HotspotType,string> = {
  "Tiger Reserve": "from-amberfield to-clay",
  "Bird Sanctuary": "from-sky-500 to-river",
  Wetland: "from-river to-forest-700",
  "National Park": "from-forest-500 to-forest-900",
  Marine: "from-cyan-500 to-river",
  Himalayan: "from-slate-500 to-basalt",
  Grassland: "from-yellow-600 to-bark",
  Mangrove: "from-emerald-700 to-forest-900",
};

const icon: Record<HotspotType, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  "Tiger Reserve": PawPrint,
  "Bird Sanctuary": Bird,
  Wetland: Waves,
  "National Park": Trees,
  Marine: Fish,
  Himalayan: Mountain,
  Grassland: Sprout,
  Mangrove: TreePalm,
};

export function HotspotVisual({ type, className }: { type: HotspotType; className?: string }) {
  const Icon = icon[type] ?? Leaf;
  const positioned = className?.includes("absolute") ? "" : "relative ";
  return (
    <div className={positioned + "flex items-center justify-center overflow-hidden bg-gradient-to-br " + gradient[type] + " " + (className ?? "")}>
      <div className="canopy-texture absolute inset-0" />
      <Icon size={56} className="text-white/25" strokeWidth={1.5} />
    </div>
  );
}
