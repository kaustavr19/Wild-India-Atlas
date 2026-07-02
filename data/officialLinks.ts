export const wikipediaTitle: Record<string, string> = {
  "jim-corbett-national-park": "Jim Corbett National Park",
  "ranthambore-national-park": "Ranthambore National Park",
  "bandhavgarh-tiger-reserve": "Bandhavgarh National Park",
  "kanha-national-park": "Kanha Tiger Reserve",
  "tadoba-andhari-tiger-reserve": "Tadoba Andhari Tiger Reserve",
  "pench-national-park": "Pench National Park, Madhya Pradesh",
  "kaziranga-national-park": "Kaziranga National Park",
  "manas-national-park": "Manas National Park",
  "sundarbans-national-park": "Sundarbans National Park",
  "keoladeo-ghana-bharatpur": "Keoladeo National Park",
  "chambal-river-sanctuary": "National Chambal Sanctuary",
  "little-rann-of-kutch": "Indian Wild Ass Sanctuary",
  "gir-national-park": "Gir National Park",
  "hemis-national-park": "Hemis National Park",
  "periyar-tiger-reserve": "Periyar Tiger Reserve",
  "nagarhole-kabini": "Nagarhole National Park",
  "thattekad-bird-sanctuary": "Thattekad Bird Sanctuary",
  "mangalajodi-wetlands": "Mangalajodi",
  "chilika-lake": "Chilika Lake",
  "great-himalayan-national-park": "Great Himalayan National Park",
  "desert-national-park": "Desert National Park",
  "valley-of-flowers": "Valley of Flowers National Park",
  "dudhwa-national-park": "Dudhwa National Park",
  "satpura-tiger-reserve": "Satpura National Park",
};

export function wikipediaUrl(slug: string): string | undefined {
  const title = wikipediaTitle[slug];
  return title ? "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_")) : undefined;
}

export function mapsDirectionsUrl(lat: number, lng: number): string {
  return "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng;
}

export function searchUrl(query: string): string {
  return "https://www.google.com/search?q=" + encodeURIComponent(query);
}
