import type { Ecosystem } from "@/data/ecosystems";
import { biomeClassName } from "@/lib/experienceDesign";

export function BiomeSurface({
  biome,
  className = "",
  textured = false,
  children,
}: {
  biome: Ecosystem;
  className?: string;
  textured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`biome-surface ${biomeClassName[biome]} ${textured ? "texture-grain texture-topography" : ""} ${className}`}>
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
