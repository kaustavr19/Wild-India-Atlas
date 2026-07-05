export type AccessPoint = { name: string; coordinates: { latitude: number; longitude: number } };

// Administrative district(s) each hotspot sits in. Sourced from Wikipedia / official
// park or state-tourism pages. Omitted where not verified.
export const district: Record<string, string> = {
  "jim-corbett-national-park": "Nainital",
  "ranthambore-national-park": "Sawai Madhopur",
  "bandhavgarh-tiger-reserve": "Umaria",
  "kanha-national-park": "Mandla & Balaghat",
  "tadoba-andhari-tiger-reserve": "Chandrapur",
  "pench-national-park": "Seoni & Chhindwara (MP), Nagpur (Maharashtra)",
  "kaziranga-national-park": "Golaghat & Nagaon",
  "manas-national-park": "Chirang & Baksa",
  "sundarbans-national-park": "South 24 Parganas",
  "keoladeo-ghana-bharatpur": "Bharatpur",
  "chambal-river-sanctuary": "Spans Dholpur/Karauli (Rajasthan), Morena/Bhind/Sheopur (Madhya Pradesh), Agra/Etawah (Uttar Pradesh)",
  "little-rann-of-kutch": "Kutch & Surendranagar",
  "gir-national-park": "Junagadh",
  "hemis-national-park": "Leh",
  "periyar-tiger-reserve": "Idukki",
  "nagarhole-kabini": "Kodagu & Mysuru",
  "thattekad-bird-sanctuary": "Ernakulam",
  "mangalajodi-wetlands": "Khordha",
  "chilika-lake": "Khordha, Puri & Ganjam",
  "great-himalayan-national-park": "Kullu",
  "desert-national-park": "Jaisalmer",
  "valley-of-flowers": "Chamoli",
  "dudhwa-national-park": "Lakhimpur Kheri",
  "satpura-tiger-reserve": "Narmadapuram",
  "eravikulam-national-park": "Idukki",
  "singalila-national-park": "Darjeeling",
  "rushikulya-rookery": "Ganjam",
  "gahirmatha-marine-sanctuary": "Kendrapara",
  "bandipur-national-park": "Chamarajanagar",
  "mudumalai-national-park": "Nilgiris",
  "biligiri-rangaswamy-temple-tiger-reserve": "Chamarajanagar",
  "sariska-tiger-reserve": "Alwar",
  "panna-national-park": "Panna",
  "kuno-national-park": "Sheopur",
  "rajaji-national-park": "Haridwar, Dehradun & Pauri Garhwal",
  "melghat-tiger-reserve": "Amravati",
  "simlipal-national-park": "Mayurbhanj",
  "valmiki-tiger-reserve": "West Champaran",
  "indravati-national-park": "Bijapur",
  "namdapha-national-park": "Changlang",
  "keibul-lamjao-national-park": "Bishnupur",
  "silent-valley-national-park": "Palakkad",
};

// Nearest airport, with real coordinates (Wikipedia infobox unless noted). Omitted where not verified.
export const airportPoint: Record<string, AccessPoint> = {
  "jim-corbett-national-park": { name: "Pantnagar Airport", coordinates: { latitude: 29.0334, longitude: 79.4737 } },
  "ranthambore-national-park": { name: "Jaipur International Airport", coordinates: { latitude: 26.82417, longitude: 75.81222 } },
  "bandhavgarh-tiger-reserve": { name: "Jabalpur Airport", coordinates: { latitude: 23.18472, longitude: 80.05875 } },
  "kanha-national-park": { name: "Jabalpur Airport", coordinates: { latitude: 23.18472, longitude: 80.05875 } },
  "tadoba-andhari-tiger-reserve": { name: "Dr. Babasaheb Ambedkar International Airport, Nagpur", coordinates: { latitude: 21.09222, longitude: 79.04722 } },
  "pench-national-park": { name: "Dr. Babasaheb Ambedkar International Airport, Nagpur", coordinates: { latitude: 21.09222, longitude: 79.04722 } },
  "kaziranga-national-park": { name: "Jorhat Airport", coordinates: { latitude: 26.7303, longitude: 94.1758 } },
  "manas-national-park": { name: "Lokpriya Gopinath Bordoloi International Airport, Guwahati", coordinates: { latitude: 26.1061, longitude: 91.5858 } },
  "sundarbans-national-park": { name: "Netaji Subhas Chandra Bose International Airport, Kolkata", coordinates: { latitude: 22.6528, longitude: 88.4413 } },
  "keoladeo-ghana-bharatpur": { name: "Agra Airport", coordinates: { latitude: 27.1618, longitude: 77.9707 } },
  "chambal-river-sanctuary": { name: "Agra Airport", coordinates: { latitude: 27.1618, longitude: 77.9707 } },
  "little-rann-of-kutch": { name: "Sardar Vallabhbhai Patel International Airport, Ahmedabad", coordinates: { latitude: 23.0730, longitude: 72.6342 } },
  "gir-national-park": { name: "Keshod Airport", coordinates: { latitude: 21.31694, longitude: 70.27028 } },
  "hemis-national-park": { name: "Kushok Bakula Rimpochee Airport, Leh", coordinates: { latitude: 34.13583, longitude: 77.54528 } },
  "periyar-tiger-reserve": { name: "Madurai Airport", coordinates: { latitude: 9.83361, longitude: 78.08944 } },
  "nagarhole-kabini": { name: "Mysore Airport", coordinates: { latitude: 12.23250, longitude: 76.65639 } },
  "thattekad-bird-sanctuary": { name: "Cochin International Airport", coordinates: { latitude: 10.15333, longitude: 76.38816 } },
  "mangalajodi-wetlands": { name: "Biju Patnaik International Airport, Bhubaneswar", coordinates: { latitude: 20.24444, longitude: 85.81778 } },
  "chilika-lake": { name: "Biju Patnaik International Airport, Bhubaneswar", coordinates: { latitude: 20.24444, longitude: 85.81778 } },
  "great-himalayan-national-park": { name: "Bhuntar (Kullu-Manali) Airport", coordinates: { latitude: 31.87667, longitude: 77.15444 } },
  "desert-national-park": { name: "Jaisalmer Airport", coordinates: { latitude: 26.88028, longitude: 70.85500 } },
  "valley-of-flowers": { name: "Jolly Grant Airport, Dehradun", coordinates: { latitude: 30.18972, longitude: 78.18028 } },
  "dudhwa-national-park": { name: "Chaudhary Charan Singh International Airport, Lucknow", coordinates: { latitude: 26.76056, longitude: 80.89028 } },
  "satpura-tiger-reserve": { name: "Raja Bhoj Airport, Bhopal", coordinates: { latitude: 23.28750, longitude: 77.33750 } },
  "eravikulam-national-park": { name: "Cochin International Airport", coordinates: { latitude: 10.15333, longitude: 76.38816 } },
  "singalila-national-park": { name: "Bagdogra Airport", coordinates: { latitude: 26.6811, longitude: 88.3286 } },
  "rushikulya-rookery": { name: "Biju Patnaik International Airport, Bhubaneswar", coordinates: { latitude: 20.24444, longitude: 85.81778 } },
  "gahirmatha-marine-sanctuary": { name: "Biju Patnaik International Airport, Bhubaneswar", coordinates: { latitude: 20.24444, longitude: 85.81778 } },
};

// Nearest railway station, with real coordinates (Wikipedia infobox unless noted). Omitted where not verified
// or impractically far (e.g. Ladakh has no rail connectivity).
export const railwayPoint: Record<string, AccessPoint> = {
  "jim-corbett-national-park": { name: "Ramnagar Railway Station", coordinates: { latitude: 29.3898, longitude: 79.1220 } },
  "ranthambore-national-park": { name: "Sawai Madhopur Junction", coordinates: { latitude: 26.018, longitude: 76.356 } },
  "bandhavgarh-tiger-reserve": { name: "Umaria Railway Station", coordinates: { latitude: 23.523106, longitude: 80.822603 } },
  "kanha-national-park": { name: "Gondia Junction", coordinates: { latitude: 21.46115, longitude: 80.19319 } },
  "tadoba-andhari-tiger-reserve": { name: "Chandrapur Railway Station", coordinates: { latitude: 19.9601, longitude: 79.3005 } },
  "pench-national-park": { name: "Seoni Railway Station", coordinates: { latitude: 22.0869, longitude: 79.5435 } },
  "kaziranga-national-park": { name: "Furkating Junction", coordinates: { latitude: 26.4656, longitude: 94.0028 } },
  "manas-national-park": { name: "Barpeta Road Railway Station", coordinates: { latitude: 26.5028, longitude: 90.9640 } },
  "sundarbans-national-park": { name: "Canning Railway Station", coordinates: { latitude: 22.3137, longitude: 88.6681 } },
  "keoladeo-ghana-bharatpur": { name: "Bharatpur Junction", coordinates: { latitude: 27.2371, longitude: 77.4886 } },
  "chambal-river-sanctuary": { name: "Dholpur Junction", coordinates: { latitude: 26.6976, longitude: 77.9061 } },
  "little-rann-of-kutch": { name: "Dhrangadhra Junction", coordinates: { latitude: 22.9870, longitude: 71.4792 } },
  "gir-national-park": { name: "Sasan Gir Railway Station", coordinates: { latitude: 21.168, longitude: 70.603 } },
  "periyar-tiger-reserve": { name: "Kottayam Railway Station", coordinates: { latitude: 9.595, longitude: 76.531 } },
  "nagarhole-kabini": { name: "Mysore Junction", coordinates: { latitude: 12.3163, longitude: 76.6454 } },
  "thattekad-bird-sanctuary": { name: "Aluva Railway Station", coordinates: { latitude: 10.108, longitude: 76.356 } },
  "mangalajodi-wetlands": { name: "Balugaon Railway Station", coordinates: { latitude: 19.7474, longitude: 85.2010 } },
  "chilika-lake": { name: "Chilka Railway Station", coordinates: { latitude: 19.686265, longitude: 85.179422 } },
  "great-himalayan-national-park": { name: "Joginder Nagar Railway Station", coordinates: { latitude: 31.9889, longitude: 76.7895 } },
  "desert-national-park": { name: "Jaisalmer Railway Station", coordinates: { latitude: 26.9152, longitude: 70.9269 } },
  "valley-of-flowers": { name: "Rishikesh Railway Station", coordinates: { latitude: 30.1077, longitude: 78.2880 } },
  "dudhwa-national-park": { name: "Dudhwa Railway Station", coordinates: { latitude: 28.509, longitude: 80.6732 } },
  "satpura-tiger-reserve": { name: "Pipariya Railway Station", coordinates: { latitude: 22.753977, longitude: 78.355292 } },
  "eravikulam-national-park": { name: "Aluva Railway Station", coordinates: { latitude: 10.108, longitude: 76.356 } },
  "singalila-national-park": { name: "New Jalpaiguri Railway Station", coordinates: { latitude: 26.6829, longitude: 88.4425 } },
  "rushikulya-rookery": { name: "Berhampur Railway Station", coordinates: { latitude: 19.2968, longitude: 84.7974 } },
  "gahirmatha-marine-sanctuary": { name: "Bhadrak Railway Station", coordinates: { latitude: 21.0908, longitude: 86.5165 } },
};

// Documented entry gates/zones. Only present where a real, source-backed coordinate was
// found for at least one gate — most Indian park authorities publish gate *names* and
// distances from a reference town, but not GPS coordinates, so many well-known gate
// systems (e.g. Tadoba's Moharli/Kolara/Navegaon/Zari, Corbett's Dhangarhi/Amdanda/Durga
// Devi, Bandhavgarh's Tala/Magadhi/Khitauli, Kanha's Khatia/Mukki/Sarhi, Ranthambore's
// 10-zone system) are deliberately omitted here rather than guessed.
export const entryGates: Record<string, AccessPoint[]> = {
  // Central-zone town of Kohora, per Wikipedia; other Kaziranga zones (Bagori, Agoratoli,
  // Burapahar) are real and named but no verifiable coordinate was found for them.
  "kaziranga-national-park": [
    { name: "Kohora Gate (Central Zone)", coordinates: { latitude: 26.63, longitude: 93.6 } },
  ],
  // Only Turia Gate had a directly citable coordinate; Karmajhiri and Jamtara gates are
  // real but unverifiable at GPS precision.
  "pench-national-park": [
    { name: "Turia Gate", coordinates: { latitude: 21.762953, longitude: 79.339113 } },
  ],
  // Approximate — coordinate is the adjoining Semri Harchand village, not the gate itself.
  "satpura-tiger-reserve": [
    { name: "Madhai Gate", coordinates: { latitude: 22.683, longitude: 78.083 } },
  ],
  // Approximate — coordinate is the nearby Kutta village, not the gate itself.
  "nagarhole-kabini": [
    { name: "Nanachi Gate", coordinates: { latitude: 12.00759, longitude: 76.05688 } },
  ],
  "chambal-river-sanctuary": [
    { name: "Pinahat Gate", coordinates: { latitude: 26.8851, longitude: 78.375 } },
  ],
  "little-rann-of-kutch": [
    { name: "Dhrangadhra Gate", coordinates: { latitude: 22.987, longitude: 71.479 } },
    { name: "Bajana Gate", coordinates: { latitude: 23.1157, longitude: 71.7786 } },
  ],
};
