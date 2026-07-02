export type Region = "North" | "South" | "East" | "West" | "Central" | "Northeast" | "Islands";
export type HotspotType = "Tiger Reserve" | "Bird Sanctuary" | "Wetland" | "National Park" | "Marine" | "Himalayan" | "Grassland" | "Mangrove";
export type Difficulty = "Easy" | "Moderate" | "Remote";
export type Season = "Winter" | "Summer" | "Monsoon" | "Post-monsoon";
export type WildlifeType = "Mammals" | "Birds" | "Reptiles" | "Marine" | "Flora" | "Butterflies";
export type Hotspot = { id:string; slug:string; name:string; state:string; region:Region; coordinates:{latitude:number;longitude:number}; type:HotspotType; wildlifeTypes:WildlifeType[]; habitat:string; summary:string; knownFor:string[]; mainSpecies:string[]; birdSpecies:string[]; floraHighlights:string[]; bestMonths:string[]; bestSeason:Season[]; experienceTags:string[]; difficulty:Difficulty; idealDuration:string; permitRequired:string; nearestAirport:string; nearestRailway:string; travelNotes:string; photographyNotes:string; ethicalNotes:string; relatedHotspotSlugs:string[] };
export type Species = { id:string; slug:string; commonName:string; scientificName:string; category:string; shortDescription:string; bestHotspots:string[]; bestMonths:string[]; habitat:string; conservationStatus:string; viewingTips:string };
