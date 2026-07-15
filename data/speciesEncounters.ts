export type EncounterAct = {
  time: string;
  title: string;
  signal: string;
  narrative: string;
  fieldNote: string;
  visualFocus: string;
};

export type SpeciesEncounter = {
  eyebrow: string;
  title: string;
  introduction: string;
  place: string;
  acts: EncounterAct[];
  closing: string;
};

export const speciesEncounters: Partial<Record<string, SpeciesEncounter>> = {
  "bengal-tiger": {
    eyebrow: "A morning in tiger country",
    title: "The forest tells you first.",
    introduction: "A tiger encounter rarely begins with stripes. It begins with a quieter language: dust, distance, an interrupted chorus, and the patience to notice what changed.",
    place: "Central Indian forest · dawn",
    acts: [
      {
        time: "05:42",
        title: "First light",
        signal: "Pugmarks hold their edge in the track dust.",
        narrative: "The forest is still blue with night. On the road ahead, four rounded impressions cross from bamboo shade toward a dry streambed. Nothing moves, but the morning already has a direction.",
        fieldNote: "A track is evidence, never an invitation to follow on foot.",
        visualFocus: "The trail",
      },
      {
        time: "06:18",
        title: "The warning",
        signal: "A chital alarm call repeats from the same tree line.",
        narrative: "Birdsong thins. A langur watches the ground instead of the canopy. Then the sharp call comes again—spaced, deliberate, and fixed on one patch of forest.",
        fieldNote: "Listen for repetition. One call may be surprise; a pattern can reveal movement.",
        visualFocus: "The listening forest",
      },
      {
        time: "06:31",
        title: "The crossing",
        signal: "Orange appears once between two sal trunks.",
        narrative: "The tiger steps into the open without urgency. For a few breaths the animal owns the road, the dust, and every held voice. Then it turns—not toward the vehicles, but back toward cover.",
        fieldNote: "Stay still. Never block its path or ask for a closer approach.",
        visualFocus: "The encounter",
      },
      {
        time: "06:34",
        title: "The afterimage",
        signal: "The forest closes and its ordinary sounds return.",
        narrative: "There is no grand exit. Stripes break into shadow, the langur lowers its tail, and the first conversation of the day slowly resumes. What remains is not possession, but attention.",
        fieldNote: "The best encounter ends with the animal undisturbed.",
        visualFocus: "The return",
      },
    ],
    closing: "In the wild, absence is not an empty scene. It is where attention begins.",
  },
  "snow-leopard": {
    eyebrow: "A winter search above the treeline",
    title: "Look for the mountain moving.",
    introduction: "In the trans-Himalaya, scale plays tricks on the eye. A snow leopard can be present for minutes before stone, shadow, and tail resolve into an animal.",
    place: "Ladakh · winter morning",
    acts: [
      { time: "07:06", title: "Cold glass", signal: "The spotting scope settles on a sunlit ridgeline.", narrative: "The valley is too large to scan quickly. A spotter divides the opposite slope into ledges, gullies, and scree fans, returning to each patch with deliberate patience.", fieldNote: "Let local spotters lead. Their knowledge keeps both people and wildlife at a safe distance.", visualFocus: "The far ridge" },
      { time: "08:22", title: "A broken line", signal: "One curve does not match the geology.", narrative: "At first it is only a pale interruption beneath an overhang. Then the line moves—a tail laid across stone—and the entire mountain rearranges itself around the cat.", fieldNote: "Most sightings are distant. A telescope often matters more than a closer position.", visualFocus: "The silhouette" },
      { time: "08:27", title: "Ghost in view", signal: "The cat rises and crosses three bands of snow.", narrative: "For less than a minute, broad paws carry it over terrain that looked impassable. Its coat holds every colour of the slope: ash, lichen, winter grass, cloud shadow.", fieldNote: "Keep voices low. Sound and movement carry clearly across open valleys.", visualFocus: "The traverse" },
      { time: "08:31", title: "Stone again", signal: "The tail slips behind a fold in the ridge.", narrative: "Nothing dramatic marks the disappearance. The ledge becomes geology again, but now every shadow seems possible and every patient scan feels alive.", fieldNote: "Never pursue across fragile slopes. The animal's retreat is the end of the encounter.", visualFocus: "The empty ledge" },
    ],
    closing: "The ghost of the mountains is not invisible. It simply belongs to a larger scale of attention.",
  },
  "great-indian-bustard": {
    eyebrow: "Dawn on the Thar grassland",
    title: "Let the horizon reveal it.",
    introduction: "The Great Indian Bustard lives in a landscape often mistaken for emptiness. The encounter begins by reading grass height, distant movement, and the immense space a wary bird needs around it.",
    place: "Thar Desert · first light",
    acts: [
      { time: "06:04", title: "Long horizon", signal: "A pale shape stands beyond the grass shimmer.", narrative: "From inside the vehicle, the plain resolves slowly: low scrub, tawny grass, a line of heat beginning above the earth. One upright form remains still while everything around it moves.", fieldNote: "Use the vehicle as a hide and let your guide determine the viewing distance.", visualFocus: "The horizon" },
      { time: "06:11", title: "The sentinel", signal: "A white neck turns above the grass.", narrative: "The bird lifts its head and surveys the open ground. Its stillness is not calm for our benefit; it is vigilance shaped by a landscape with nowhere to hide.", fieldNote: "Do not step out for a lower angle. A tiny remaining population cannot absorb disturbance.", visualFocus: "The watch" },
      { time: "06:19", title: "Measured steps", signal: "The bustard feeds without closing the distance.", narrative: "It walks with unhurried precision, disappearing to the shoulder and returning with each rise in the ground. The encounter is measured in restraint, not proximity.", fieldNote: "Long lenses and patient observation replace every impulse to approach.", visualFocus: "The grassland" },
      { time: "06:26", title: "Room to leave", signal: "The bird turns toward uninterrupted desert.", narrative: "The vehicle stays still. Distance expands, heat gathers, and the bustard becomes a mark, then a possibility, then part of the horizon once more.", fieldNote: "Leave before the bird changes its behaviour because of your presence.", visualFocus: "The open plain" },
    ],
    closing: "In grassland, giving wildlife space is not missing the encounter. It is the encounter done well.",
  },
  "one-horned-rhinoceros": {
    eyebrow: "Mist over the Brahmaputra floodplain",
    title: "The grass begins to breathe.",
    introduction: "A rhinoceros encounter arrives through layers: river mist, dew-heavy elephant grass, the rhythm of grazing, and finally an armoured silhouette emerging from the floodplain.",
    place: "Assam floodplain · early morning",
    acts: [
      { time: "06:12", title: "White water", signal: "Mist holds low above the wet grass.", narrative: "The track runs between reed beds and shallow water. Egrets appear and disappear in the haze while the floodplain waits for sunlight to define its edges.", fieldNote: "Remain on designated safari routes; wetlands and tall grass conceal more life than you can see.", visualFocus: "The mist" },
      { time: "06:24", title: "Grass moving", signal: "A broad channel opens through the reeds.", narrative: "Stems bend in sequence before the animal itself appears. A rounded back rises above the grass, beaded with moisture and almost the same grey as the morning.", fieldNote: "Let the guide set the pace and distance. Never pressure the animal toward water or cover.", visualFocus: "The reed line" },
      { time: "06:29", title: "Floodplain giant", signal: "The rhinoceros steps into an open patch to graze.", narrative: "Folded skin catches the first warm light. The horn is only one detail; more striking is the quiet efficiency of an animal shaping the grassland one mouthful at a time.", fieldNote: "A mid-range telephoto is enough. Closer is neither necessary nor responsible.", visualFocus: "The grazer" },
      { time: "06:38", title: "Back into cover", signal: "Reeds close behind the last grey curve.", narrative: "The rhino turns and the landscape absorbs its size with surprising ease. Water birds settle again, and the channel through the grass becomes the only visible trace.", fieldNote: "Allow uninterrupted access to feeding grounds and water.", visualFocus: "The closing grass" },
    ],
    closing: "Conservation success is not a finished story. It is a landscape choosing, every morning, to make room.",
  },
  "red-panda": {
    eyebrow: "A quiet search in the eastern Himalaya",
    title: "Search the branches between breaths.",
    introduction: "Red panda country is close, green, and vertical. The search slows to the pace of filtered light—bamboo stems, mossed limbs, and a rust-red shape sleeping above the trail.",
    place: "Eastern Himalayan forest · cloud morning",
    acts: [
      { time: "07:18", title: "Into bamboo", signal: "The trail narrows beneath a wet canopy.", narrative: "Cloud drifts through broadleaf forest and every branch carries moss. The guide scans forks and horizontal limbs where a small animal can become part of the tree.", fieldNote: "Stay on marked trails; trampling the understory damages the habitat you came to see.", visualFocus: "The canopy" },
      { time: "07:46", title: "A warm colour", signal: "Rust-red fur interrupts a mossed branch.", narrative: "The first glimpse is not a face but a colour that does not belong to bark. A ringed tail hangs below the limb, motionless in the filtered morning light.", fieldNote: "Whisper, point slowly, and allow others to find the animal without crowding.", visualFocus: "The tail" },
      { time: "07:51", title: "Canopy waking", signal: "Two dark eyes open above the bamboo.", narrative: "The panda raises its head, tests the air, and shifts one paw. Nothing about the moment asks for urgency. The reward is the permission to watch ordinary rest.", fieldNote: "Raise ISO rather than using flash or forcing a clearer view through vegetation.", visualFocus: "The branch" },
      { time: "08:03", title: "Green curtain", signal: "Leaves settle where the animal moved deeper into cover.", narrative: "One careful climb carries it behind a screen of foliage. The forest keeps the rest of the story, and the trail continues without following.", fieldNote: "Never lure, call, or pursue a red panda through the canopy.", visualFocus: "The leaves" },
    ],
    closing: "Some encounters become extraordinary precisely because nothing was asked of the animal.",
  },
  "olive-ridley-turtle": {
    eyebrow: "A nesting night on the Odisha coast",
    title: "Let darkness protect the shore.",
    introduction: "On an arribada beach, wonder depends on discipline. The ocean, moon, and nesting turtles set the pace; visitors become a quiet edge to a journey older than any light we carry.",
    place: "Odisha coast · moonless night",
    acts: [
      { time: "22:14", title: "Dark adaptation", signal: "The shoreline appears only after the torch goes off.", narrative: "At first there is surf and almost nothing else. Slowly the eye learns the beach: a pale break of foam, wet sand, and tracks drawing parallel lines from the water.", fieldNote: "Use only guide-approved red-filtered light. White light and flash can disorient turtles.", visualFocus: "The tide line" },
      { time: "22:27", title: "From the surf", signal: "A dark shell pauses between two waves.", narrative: "The turtle waits through the backwash, then pulls forward with deliberate strokes. Each metre inland is work, and the watching group gives the route a wide, silent margin.", fieldNote: "Never stand between a turtle and the nesting beach—or between hatchlings and the sea.", visualFocus: "The landing" },
      { time: "22:49", title: "The nest", signal: "Rear flippers begin to shape a chamber in the sand.", narrative: "Sand lifts and falls in a steady rhythm. The turtle enters a vulnerable stillness, guided by instinct and undisturbed darkness rather than by the people watching nearby.", fieldNote: "Keep low, quiet, and behind the viewing line established by trained guides.", visualFocus: "The nesting hollow" },
      { time: "23:18", title: "Return current", signal: "A fresh track leads back toward black water.", narrative: "The nest disappears beneath carefully swept sand. At the surf line, one wave turns the turtle seaward; the next carries the silhouette beyond sight.", fieldNote: "Leave nests untouched and report disturbance only through local conservation teams.", visualFocus: "The sea" },
    ],
    closing: "On a nesting beach, darkness is not an absence. It is essential habitat.",
  },
};
