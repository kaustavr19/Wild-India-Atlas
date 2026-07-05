import { Bird as BirdIcon, PawPrint, Turtle, Waves } from "lucide-react";

const gradient: Record<string,string> = {
  Mammal: "from-forest-500 to-forest-900",
  Bird: "from-sky-500 to-river",
  Reptile: "from-yellow-600 to-bark",
  Marine: "from-cyan-500 to-river",
};

const icon: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Mammal: PawPrint,
  Bird: BirdIcon,
  Reptile: Turtle,
  Marine: Waves,
};

export function SpeciesVisual({ category, className }: { category: string; className?: string }) {
  const Icon = icon[category] ?? PawPrint;
  const positioned = className?.includes("absolute") ? "" : "relative ";
  return (
    <div className={positioned + "flex items-center justify-center overflow-hidden bg-gradient-to-br " + (gradient[category] ?? gradient.Mammal) + " " + (className ?? "")}>
      <div className="canopy-texture absolute inset-0" />
      <Icon size={56} className="text-white/25" strokeWidth={1.5} />
    </div>
  );
}
