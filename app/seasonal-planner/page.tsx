import type { Metadata } from "next";
import { SeasonalPlanner } from "@/components/SeasonalPlanner";

export const metadata: Metadata = {
  title: "Seasonal Wildlife Planner",
  description: "Explore India's wildlife month by month, filter field sites by region and experience, and save a seasonal trail to your private journal.",
  alternates: { canonical: "/seasonal-planner" },
  openGraph: { title: "Seasonal Wildlife Planner", description: "Follow migrations, monsoons and forest seasons across India's wildlife atlas.", url: "/seasonal-planner", type: "website" },
};

export default function SeasonalPlannerPage() { return <SeasonalPlanner />; }
