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

// Verified official (mostly *.gov.in) permit/booking portals, checked live before inclusion.
// Where no verifiable official portal exists (e.g. no online booking system, or the
// official domain was unreachable at research time), the slug is omitted and callers
// should fall back to a search link instead of guessing a URL.
export const permitPortalUrl: Record<string, string> = {
  "jim-corbett-national-park": "https://corbettgov.org/",
  "ranthambore-national-park": "https://forestrajasthan.com/",
  "bandhavgarh-tiger-reserve": "https://forest.mponline.gov.in/",
  "kanha-national-park": "https://forest.mponline.gov.in/",
  "tadoba-andhari-tiger-reserve": "https://mytadoba.mahaforest.gov.in/",
  "pench-national-park": "https://forest.mponline.gov.in/",
  "kaziranga-national-park": "https://sewasetu.assam.gov.in/site/service-apply/online-safari-booking-kaziranga-national-park",
  "manas-national-park": "https://sewasetu.assam.gov.in/site/service-apply/online-safari-booking-manas-national-park",
  "sundarbans-national-park": "https://www.wildbengal.com/sundarban.php",
  "keoladeo-ghana-bharatpur": "https://www.tourism.rajasthan.gov.in/keoladeo-ghana-national-park.html",
  "chambal-river-sanctuary": "https://forest.rajasthan.gov.in/content/raj/forest/en/aboutus/departmental-wings/wild-life1/public-information/details-of-protected-area-/national-chambal-gariyal-sanctuary-area-detail.html",
  "little-rann-of-kutch": "https://gujarattourism.com/saurashtra/surendranagar/wild-ass-sanctuary-in-little-rann-of-kutch.html",
  "gir-national-park": "https://girlion.gujarat.gov.in/",
  "hemis-national-park": "https://www.lahdclehpermit.in/",
  "periyar-tiger-reserve": "https://periyartigerreserve.org/",
  "nagarhole-kabini": "https://junglelodges.com",
  "thattekad-bird-sanctuary": "https://ecotourism.forest.kerala.gov.in/propertydetail/200",
  "mangalajodi-wetlands": "https://odishatourism.gov.in/content/tourism/en/trail-details/birding-at-mangalajodi.html",
  "chilika-lake": "https://apps.odishatourism.gov.in/tour/chilika-lake",
  "great-himalayan-national-park": "https://hpforest.gov.in/great-himalayan-national-park",
  "desert-national-park": "https://forest.rajasthan.gov.in/content/raj/forest/en/aboutus/departmental-wings/wildlife/details-of-protected-area-/desert-national-park.html",
  "dudhwa-national-park": "https://upecotourism.in/DudhwaTariff.aspx",
  "satpura-tiger-reserve": "https://forest.mponline.gov.in/",
  // "valley-of-flowers": official portal (valleyofflower.uk.gov.in) was unreachable at
  // research time (connection refused) - falls back to search link instead.
};

export function mapsDirectionsUrl(lat: number, lng: number): string {
  return "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng;
}

export function searchUrl(query: string): string {
  return "https://www.google.com/search?q=" + encodeURIComponent(query);
}
