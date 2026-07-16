import type { Hotspot } from "../data/types.ts";
import type { Month } from "./seasonalPlanner.ts";

export const monthlyFieldLead: Record<Month, string> = {
  Jan: "kaziranga-national-park",
  Feb: "hemis-national-park",
  Mar: "rushikulya-rookery",
  Apr: "tadoba-andhari-tiger-reserve",
  May: "tadoba-andhari-tiger-reserve",
  Jun: "great-himalayan-national-park",
  Jul: "valley-of-flowers",
  Aug: "valley-of-flowers",
  Sep: "eravikulam-national-park",
  Oct: "singalila-national-park",
  Nov: "mangalajodi-wetlands",
  Dec: "little-rann-of-kutch",
};

export function fieldLeadForMonth(items: Hotspot[], month: Month): Hotspot {
  return items.find((item) => item.slug === monthlyFieldLead[month] && item.bestMonths.includes(month))
    ?? items.find((item) => item.bestMonths.includes(month))
    ?? items[0];
}
