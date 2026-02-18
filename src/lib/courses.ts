export type SkillLevel = "beginner" | "intermediate" | "advanced" | "mixed";
export type CourseLevel =
  | "Beginner-Friendly"
  | "Intermediate"
  | "Challenging"
  | "Championship"
  | "Links";

export interface GolfCourse {
  id: string;
  name: string;
  location: string;
  state: string;
  country: string;
  region: string; // e.g. "Southeast", "Southwest", "Northeast", "Scotland"
  courseLevel: CourseLevel;
  courseRating: number; // USGA Course Rating (typical scratch score)
  slopeRating: number; // Slope Rating (difficulty vs bogey golfer, 55–155, avg 113)
  par: number;
  priceRange: "budget" | "moderate" | "premium" | "luxury";
  avgGreenFee: number; // USD
  playAndStayAvailable: boolean;
  description: string;
  highlights: string[];
  bestFor: string[];
  imageUrl: string;
}

export const COURSES: GolfCourse[] = [
  // ── SOUTHEAST ──────────────────────────────────────────────────────────────
  {
    id: "pinehurst-no2",
    name: "Pinehurst No. 2",
    location: "Pinehurst, NC",
    state: "NC",
    country: "USA",
    region: "Southeast",
    courseLevel: "Championship",
    courseRating: 76.5,
    slopeRating: 142,
    par: 70,
    priceRange: "luxury",
    avgGreenFee: 600,
    playAndStayAvailable: true,
    description:
      "One of America's most iconic golf courses, host to multiple US Opens. Designed by Donald Ross, the sand-top crowned greens demand precise approach play.",
    highlights: [
      "Donald Ross masterpiece",
      "Multiple US Open host",
      "Famous crowned greens",
      "Historic golf resort",
    ],
    bestFor: ["advanced", "championship"],
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
  },
  {
    id: "tpc-sawgrass",
    name: "TPC Sawgrass – Stadium Course",
    location: "Ponte Vedra Beach, FL",
    state: "FL",
    country: "USA",
    region: "Southeast",
    courseLevel: "Championship",
    courseRating: 74.8,
    slopeRating: 138,
    par: 72,
    priceRange: "luxury",
    avgGreenFee: 550,
    playAndStayAvailable: true,
    description:
      "Home of THE PLAYERS Championship, featuring the world-famous island-green 17th hole. A Pete Dye design that rewards accuracy over length.",
    highlights: [
      "Island-green 17th",
      "PGA TOUR home course",
      "Pete Dye design",
      "Iconic par-3s",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
  },
  {
    id: "harbor-town",
    name: "Harbour Town Golf Links",
    location: "Hilton Head, SC",
    state: "SC",
    country: "USA",
    region: "Southeast",
    courseLevel: "Challenging",
    courseRating: 74.0,
    slopeRating: 136,
    par: 71,
    priceRange: "premium",
    avgGreenFee: 350,
    playAndStayAvailable: true,
    description:
      "A Pete Dye classic set among the Carolina marshes, known for its tight fairways and small greens. Home to the PGA TOUR's RBC Heritage.",
    highlights: [
      "Lighthouse finishing hole",
      "Marshland views",
      "RBC Heritage host",
      "Classic Dye design",
    ],
    bestFor: ["advanced", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
  },
  {
    id: "reynolds-lake-oconee",
    name: "Reynolds Lake Oconee – Great Waters",
    location: "Greensboro, GA",
    state: "GA",
    country: "USA",
    region: "Southeast",
    courseLevel: "Intermediate",
    courseRating: 72.1,
    slopeRating: 130,
    par: 72,
    priceRange: "premium",
    avgGreenFee: 175,
    playAndStayAvailable: true,
    description:
      "Jack Nicklaus design wrapping along the shores of Lake Oconee. Stunning water views and member-quality conditions make this a Southeast gem.",
    highlights: [
      "Lake Oconee views",
      "Nicklaus design",
      "Resort amenities",
      "Georgia beauty",
    ],
    bestFor: ["intermediate", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800",
  },
  {
    id: "orange-lake-legends",
    name: "Orange Lake Resort – Legends Course",
    location: "Kissimmee, FL",
    state: "FL",
    country: "USA",
    region: "Southeast",
    courseLevel: "Beginner-Friendly",
    courseRating: 69.5,
    slopeRating: 120,
    par: 72,
    priceRange: "budget",
    avgGreenFee: 65,
    playAndStayAvailable: true,
    description:
      "A welcoming resort course near Orlando with wide fairways and forgiving design. Perfect for groups with mixed skill levels.",
    highlights: [
      "Wide forgiving fairways",
      "Resort amenities",
      "Near Orlando attractions",
      "Great for mixed groups",
    ],
    bestFor: ["beginner", "mixed", "family"],
    imageUrl: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=800",
  },

  // ── SOUTHWEST ──────────────────────────────────────────────────────────────
  {
    id: "troon-north-monument",
    name: "Troon North – Monument Course",
    location: "Scottsdale, AZ",
    state: "AZ",
    country: "USA",
    region: "Southwest",
    courseLevel: "Challenging",
    courseRating: 73.4,
    slopeRating: 147,
    par: 72,
    priceRange: "luxury",
    avgGreenFee: 325,
    playAndStayAvailable: false,
    description:
      "Carved through the Sonoran Desert with dramatic elevation changes and native desert terrain. One of Scottsdale's most picturesque and demanding tracks.",
    highlights: [
      "Desert canyon views",
      "Tom Weiskopf design",
      "Dramatic elevation changes",
      "Signature boulder holes",
    ],
    bestFor: ["advanced", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
  },
  {
    id: "we-ko-pa-saguaro",
    name: "We-Ko-Pa Golf Club – Saguaro",
    location: "Fort McDowell, AZ",
    state: "AZ",
    country: "USA",
    region: "Southwest",
    courseLevel: "Intermediate",
    courseRating: 71.8,
    slopeRating: 132,
    par: 72,
    priceRange: "moderate",
    avgGreenFee: 175,
    playAndStayAvailable: false,
    description:
      "A Native American-owned gem in the McDowell Mountains. Stunning Sonoran Desert scenery with fair but challenging layout.",
    highlights: [
      "Mountain views",
      "Native American heritage",
      "Saguaro cactus landscape",
      "Two distinct 18-hole layouts",
    ],
    bestFor: ["intermediate", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=800",
  },
  {
    id: "pga-west-stadium",
    name: "PGA WEST – Stadium Course",
    location: "La Quinta, CA",
    state: "CA",
    country: "USA",
    region: "Southwest",
    courseLevel: "Championship",
    courseRating: 75.6,
    slopeRating: 150,
    par: 72,
    priceRange: "luxury",
    avgGreenFee: 425,
    playAndStayAvailable: true,
    description:
      "Pete Dye's notorious desert stadium design — the toughest resort course in the country. Famous for the island-green 17th 'Alcatraz' par-3.",
    highlights: [
      "'Alcatraz' island green",
      "Desert mountain backdrop",
      "Pete Dye design",
      "Legendary difficulty",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800",
  },
  {
    id: "dove-mountain",
    name: "The Ritz-Carlton Golf Club – Dove Mountain",
    location: "Marana, AZ",
    state: "AZ",
    country: "USA",
    region: "Southwest",
    courseLevel: "Intermediate",
    courseRating: 72.3,
    slopeRating: 129,
    par: 72,
    priceRange: "luxury",
    avgGreenFee: 250,
    playAndStayAvailable: true,
    description:
      "Jack Nicklaus-designed layout in the rugged Sonoran Desert. Integrated into the natural desert landscape with spectacular mountain and valley views.",
    highlights: [
      "Ritz-Carlton resort amenities",
      "Nicklaus design",
      "WGC Match Play host",
      "Stunning desert scenery",
    ],
    bestFor: ["intermediate", "luxury"],
    imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
  },

  // ── NORTHEAST ──────────────────────────────────────────────────────────────
  {
    id: "bethpage-black",
    name: "Bethpage State Park – Black Course",
    location: "Farmingdale, NY",
    state: "NY",
    country: "USA",
    region: "Northeast",
    courseLevel: "Championship",
    courseRating: 76.6,
    slopeRating: 148,
    par: 71,
    priceRange: "budget",
    avgGreenFee: 100,
    playAndStayAvailable: false,
    description:
      "A legendary public course that has hosted two US Opens. The famous 1st tee sign warns 'Recommended for highly skilled golfers only.'",
    highlights: [
      "Two US Open host",
      "Best public course value",
      "Historic A.W. Tillinghast design",
      "Iconic difficulty",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
  },
  {
    id: "saratoga-national",
    name: "Saratoga National Golf Club",
    location: "Saratoga Springs, NY",
    state: "NY",
    country: "USA",
    region: "Northeast",
    courseLevel: "Intermediate",
    courseRating: 71.5,
    slopeRating: 126,
    par: 72,
    priceRange: "moderate",
    avgGreenFee: 120,
    playAndStayAvailable: false,
    description:
      "Set among the rolling hills of upstate New York near the famous racetrack. A Roger Rulewich design with wide, welcoming fairways and scenic views.",
    highlights: [
      "Saratoga Springs setting",
      "Near famous horse racing",
      "Charming upstate NY",
      "Fair and fun layout",
    ],
    bestFor: ["intermediate", "mixed"],
    imageUrl: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=800",
  },
  {
    id: "cape-cod-highland-links",
    name: "Highland Links at Highland",
    location: "Truro, MA",
    state: "MA",
    country: "USA",
    region: "Northeast",
    courseLevel: "Beginner-Friendly",
    courseRating: 68.5,
    slopeRating: 113,
    par: 71,
    priceRange: "budget",
    avgGreenFee: 55,
    playAndStayAvailable: false,
    description:
      "A charming Cape Cod links-style course perched on the bluffs above the Atlantic. One of the oldest courses in New England, affordable and full of character.",
    highlights: [
      "Ocean cliff views",
      "Oldest Cape Cod course",
      "Classic links feel",
      "Affordable bucket list",
    ],
    bestFor: ["beginner", "mixed", "budget"],
    imageUrl: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800",
  },

  // ── MIDWEST ────────────────────────────────────────────────────────────────
  {
    id: "whistling-straits",
    name: "Whistling Straits – Straits Course",
    location: "Sheboygan, WI",
    state: "WI",
    country: "USA",
    region: "Midwest",
    courseLevel: "Championship",
    courseRating: 76.1,
    slopeRating: 151,
    par: 72,
    priceRange: "luxury",
    avgGreenFee: 450,
    playAndStayAvailable: true,
    description:
      "Pete Dye's stunning lakeside masterpiece along Lake Michigan's shoreline. Host to multiple PGA Championships and the 2021 Ryder Cup.",
    highlights: [
      "Lake Michigan shoreline",
      "Ryder Cup 2021 host",
      "Pete Dye design",
      "Scottish links feel",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
  },
  {
    id: "erin-hills",
    name: "Erin Hills",
    location: "Erin, WI",
    state: "WI",
    country: "USA",
    region: "Midwest",
    courseLevel: "Championship",
    courseRating: 76.8,
    slopeRating: 148,
    par: 72,
    priceRange: "premium",
    avgGreenFee: 300,
    playAndStayAvailable: true,
    description:
      "Host of the 2017 US Open, this links-style gem features sweeping views of the Wisconsin countryside and massive undulating fairways.",
    highlights: [
      "2017 US Open host",
      "Links-style layout",
      "Wisconsin countryside",
      "Fescue rough",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
  },
  {
    id: "bay-harbor-links",
    name: "Bay Harbor Golf Club – Links Course",
    location: "Bay Harbor, MI",
    state: "MI",
    country: "USA",
    region: "Midwest",
    courseLevel: "Intermediate",
    courseRating: 71.3,
    slopeRating: 127,
    par: 70,
    priceRange: "moderate",
    avgGreenFee: 130,
    playAndStayAvailable: true,
    description:
      "Carved along the bluffs above Little Traverse Bay in northern Michigan. Spectacular water views and a classic Arthur Hills design.",
    highlights: [
      "Little Traverse Bay views",
      "Northern Michigan charm",
      "Arthur Hills design",
      "Play & stay packages",
    ],
    bestFor: ["intermediate", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=800",
  },

  // ── PACIFIC NORTHWEST ──────────────────────────────────────────────────────
  {
    id: "chambers-bay",
    name: "Chambers Bay",
    location: "University Place, WA",
    state: "WA",
    country: "USA",
    region: "Pacific Northwest",
    courseLevel: "Championship",
    courseRating: 74.6,
    slopeRating: 139,
    par: 72,
    priceRange: "premium",
    avgGreenFee: 225,
    playAndStayAvailable: false,
    description:
      "Host of the 2015 US Open, this links-style course overlooks Puget Sound. Dramatic terrain, fescue turf, and stunning Pacific Northwest scenery.",
    highlights: [
      "Puget Sound views",
      "2015 US Open host",
      "True links turf",
      "Mt. Rainier backdrop",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=800",
  },
  {
    id: "pumpkin-ridge-witch-hollow",
    name: "Pumpkin Ridge – Witch Hollow",
    location: "North Plains, OR",
    state: "OR",
    country: "USA",
    region: "Pacific Northwest",
    courseLevel: "Challenging",
    courseRating: 73.9,
    slopeRating: 138,
    par: 71,
    priceRange: "moderate",
    avgGreenFee: 125,
    playAndStayAvailable: false,
    description:
      "Three-time US Amateur host set in the Tualatin Valley foothills. Dramatic elevation changes, tall firs, and tournament-quality conditions.",
    highlights: [
      "3x US Amateur host",
      "Old-growth fir trees",
      "Dramatic elevation",
      "PNW scenery",
    ],
    bestFor: ["advanced", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
  },

  // ── SCOTLAND / UK ──────────────────────────────────────────────────────────
  {
    id: "st-andrews-old-course",
    name: "St Andrews – The Old Course",
    location: "St Andrews, Fife",
    state: "Fife",
    country: "Scotland",
    region: "Scotland",
    courseLevel: "Championship",
    courseRating: 72.0,
    slopeRating: 132,
    par: 72,
    priceRange: "premium",
    avgGreenFee: 260,
    playAndStayAvailable: true,
    description:
      "The birthplace of golf. No other course carries the history, tradition, and mystique of the Old Course at St Andrews. A once-in-a-lifetime experience.",
    highlights: [
      "Birthplace of golf",
      "17th Road Hole",
      "The Swilcan Bridge",
      "Multiple Open Championship host",
    ],
    bestFor: ["advanced", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
  },
  {
    id: "royal-dornoch",
    name: "Royal Dornoch Golf Club",
    location: "Dornoch, Highlands",
    state: "Highlands",
    country: "Scotland",
    region: "Scotland",
    courseLevel: "Challenging",
    courseRating: 73.5,
    slopeRating: 135,
    par: 70,
    priceRange: "moderate",
    avgGreenFee: 200,
    playAndStayAvailable: false,
    description:
      "Consistently ranked among the world's top 10, Royal Dornoch is a true Highland links. Narrow fairways, plateau greens, and views over the Dornoch Firth.",
    highlights: [
      "Top 10 world ranking",
      "Highland links",
      "Cathedral town setting",
      "Old Tom Morris design",
    ],
    bestFor: ["advanced", "bucket-list", "scenic"],
    imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
  },
  {
    id: "carnoustie",
    name: "Carnoustie Golf Links",
    location: "Carnoustie, Angus",
    state: "Angus",
    country: "Scotland",
    region: "Scotland",
    courseLevel: "Championship",
    courseRating: 75.1,
    slopeRating: 145,
    par: 71,
    priceRange: "premium",
    avgGreenFee: 200,
    playAndStayAvailable: false,
    description:
      "One of the toughest Open Championship venues in the world. Carnoustie earns its nickname 'Car-nasty' with narrow fairways, burns, and relentless wind.",
    highlights: [
      "Open Championship host",
      "Barry Burn finishing holes",
      "Legendary difficulty",
      "Pure links golf",
    ],
    bestFor: ["advanced", "championship"],
    imageUrl: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800",
  },
  {
    id: "turnberry-ailsa",
    name: "Trump Turnberry – Ailsa Course",
    location: "Turnberry, Ayrshire",
    state: "Ayrshire",
    country: "Scotland",
    region: "Scotland",
    courseLevel: "Championship",
    courseRating: 74.8,
    slopeRating: 141,
    par: 70,
    priceRange: "luxury",
    avgGreenFee: 450,
    playAndStayAvailable: true,
    description:
      "A luxury resort links on the Ayrshire coast with views of Ailsa Craig and Arran. Host of four Open Championships, including the 'Duel in the Sun' in 1977.",
    highlights: [
      "Lighthouse par-3 9th",
      "Four Open Championships",
      "Ailsa Craig views",
      "5-star resort",
    ],
    bestFor: ["advanced", "luxury", "bucket-list"],
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
  },
  {
    id: "gleneagles-kings",
    name: "Gleneagles – The King's Course",
    location: "Auchterarder, Perthshire",
    state: "Perthshire",
    country: "Scotland",
    region: "Scotland",
    courseLevel: "Intermediate",
    courseRating: 70.5,
    slopeRating: 128,
    par: 68,
    priceRange: "luxury",
    avgGreenFee: 325,
    playAndStayAvailable: true,
    description:
      "Set in the stunning Perthshire countryside, the King's Course is the most traditional of the Gleneagles layouts. Ryder Cup 2014 host resort.",
    highlights: [
      "5-star Gleneagles Hotel",
      "Ryder Cup 2014 resort",
      "Moorland scenery",
      "James Braid design",
    ],
    bestFor: ["intermediate", "luxury"],
    imageUrl: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=800",
  },
];

export interface RecommendationFilters {
  destination: string;
  skillLevel: SkillLevel;
  budgetPerPerson: number;
  numberOfGolfers: number;
  lodgingType: string;
  memberLocations?: string[]; // home cities of group members, e.g. ["Chicago, IL", "Dallas, TX"]
}

/**
 * Maps a home city/state to the US regions it can comfortably fly to.
 * Used to weight recommendations toward destinations accessible to most of the group.
 */
function getAccessibleRegions(location: string): string[] {
  const loc = location.toLowerCase();

  // Southeast residents
  if (
    loc.includes("florida") || loc.includes(", fl") ||
    loc.includes("georgia") || loc.includes(", ga") ||
    loc.includes("carolina") || loc.includes(", nc") || loc.includes(", sc") ||
    loc.includes("tennessee") || loc.includes(", tn") ||
    loc.includes("alabama") || loc.includes(", al") ||
    loc.includes("atlanta") || loc.includes("charlotte") ||
    loc.includes("nashville") || loc.includes("miami") || loc.includes("orlando")
  )
    return ["Southeast", "Southwest", "Northeast"];

  // Northeast / Mid-Atlantic residents
  if (
    loc.includes("new york") || loc.includes(", ny") ||
    loc.includes(", nj") || loc.includes(", ct") || loc.includes(", ma") ||
    loc.includes(", pa") || loc.includes(", md") || loc.includes(", va") ||
    loc.includes("boston") || loc.includes("philadelphia") ||
    loc.includes("washington dc") || loc.includes("baltimore")
  )
    return ["Northeast", "Southeast", "Midwest"];

  // Midwest residents
  if (
    loc.includes(", il") || loc.includes(", oh") || loc.includes(", mi") ||
    loc.includes(", wi") || loc.includes(", mn") || loc.includes(", mo") ||
    loc.includes(", in") || loc.includes(", ks") || loc.includes(", ne") ||
    loc.includes("chicago") || loc.includes("detroit") ||
    loc.includes("minneapolis") || loc.includes("cleveland") || loc.includes("columbus")
  )
    return ["Midwest", "Southeast", "Southwest"];

  // Southwest / Mountain West residents
  if (
    loc.includes("arizona") || loc.includes(", az") ||
    loc.includes(", tx") || loc.includes(", nm") || loc.includes(", co") ||
    loc.includes(", nv") || loc.includes("las vegas") ||
    loc.includes("dallas") || loc.includes("houston") || loc.includes("denver") ||
    loc.includes("phoenix") || loc.includes("scottsdale") || loc.includes("austin")
  )
    return ["Southwest", "Southeast", "Pacific Northwest"];

  // West Coast / Pacific Northwest residents
  if (
    loc.includes(", ca") || loc.includes(", wa") || loc.includes(", or") ||
    loc.includes("california") || loc.includes("washington") || loc.includes("oregon") ||
    loc.includes("los angeles") || loc.includes("san francisco") ||
    loc.includes("seattle") || loc.includes("portland") || loc.includes("san diego")
  )
    return ["Pacific Northwest", "Southwest", "Scotland"];

  // Default: anywhere
  return ["Southeast", "Southwest", "Northeast", "Midwest", "Pacific Northwest"];
}

/**
 * Given a list of member home locations, return the regions ranked by
 * how many members can easily reach them (most accessible first).
 */
export function getRankedRegionsByAccess(memberLocations: string[]): string[] {
  if (!memberLocations.length) return [];

  const regionScore: Record<string, number> = {};
  memberLocations.forEach((loc) => {
    getAccessibleRegions(loc).forEach((region, idx) => {
      // First accessible region scores highest
      regionScore[region] = (regionScore[region] ?? 0) + (3 - Math.min(idx, 2));
    });
  });

  return Object.entries(regionScore)
    .sort((a, b) => b[1] - a[1])
    .map(([region]) => region);
}

const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  budget: { min: 0, max: 100 },
  moderate: { min: 101, max: 200 },
  premium: { min: 201, max: 400 },
  luxury: { min: 401, max: Infinity },
};

const SKILL_LEVEL_MAP: Record<SkillLevel, CourseLevel[]> = {
  beginner: ["Beginner-Friendly", "Intermediate"],
  intermediate: ["Beginner-Friendly", "Intermediate", "Challenging"],
  advanced: ["Intermediate", "Challenging", "Championship", "Links"],
  mixed: ["Beginner-Friendly", "Intermediate", "Challenging"],
};

function normalizeRegion(destination: string): string[] {
  const dest = destination.toLowerCase();

  // US State/Region keywords
  if (
    dest.includes("florida") ||
    dest.includes("fl") ||
    dest.includes("north carolina") ||
    dest.includes("nc") ||
    dest.includes("south carolina") ||
    dest.includes("sc") ||
    dest.includes("georgia") ||
    dest.includes("ga") ||
    dest.includes("hilton head") ||
    dest.includes("pinehurst") ||
    dest.includes("myrtle beach")
  )
    return ["Southeast"];

  if (
    dest.includes("arizona") ||
    dest.includes("az") ||
    dest.includes("scottsdale") ||
    dest.includes("california") ||
    dest.includes("ca") ||
    dest.includes("las vegas") ||
    dest.includes("palm springs")
  )
    return ["Southwest"];

  if (
    dest.includes("new york") ||
    dest.includes("ny") ||
    dest.includes("massachusetts") ||
    dest.includes("ma") ||
    dest.includes("connecticut") ||
    dest.includes("vermont") ||
    dest.includes("new england") ||
    dest.includes("cape cod")
  )
    return ["Northeast"];

  if (
    dest.includes("wisconsin") ||
    dest.includes("wi") ||
    dest.includes("michigan") ||
    dest.includes("mi") ||
    dest.includes("ohio") ||
    dest.includes("illinois") ||
    dest.includes("chicago")
  )
    return ["Midwest"];

  if (
    dest.includes("washington") ||
    dest.includes("wa") ||
    dest.includes("oregon") ||
    dest.includes("or") ||
    dest.includes("seattle") ||
    dest.includes("portland")
  )
    return ["Pacific Northwest"];

  if (
    dest.includes("scotland") ||
    dest.includes("st andrews") ||
    dest.includes("edinburgh") ||
    dest.includes("glasgow") ||
    dest.includes("uk") ||
    dest.includes("united kingdom")
  )
    return ["Scotland"];

  if (
    dest.includes("ireland") ||
    dest.includes("dublin") ||
    dest.includes("ballybunion")
  )
    return ["Ireland"];

  // No specific match — return all regions
  return [];
}

export function getRecommendedCourses(
  filters: RecommendationFilters,
  limit = 6
): { course: GolfCourse; score: number; matchReasons: string[] }[] {
  const targetRegions = normalizeRegion(filters.destination);
  const allowedLevels = SKILL_LEVEL_MAP[filters.skillLevel];

  // If member locations were provided, use them to find the most accessible regions
  const accessRanking =
    filters.memberLocations && filters.memberLocations.length > 0
      ? getRankedRegionsByAccess(filters.memberLocations)
      : [];

  // Estimate per-round golf budget (assume golf = ~30% of per-person trip budget)
  const estimatedGolfBudget = filters.budgetPerPerson * 0.3;

  const scored = COURSES.map((course) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Region match — destination takes priority, member locations act as a boost
    if (targetRegions.length > 0) {
      if (targetRegions.includes(course.region)) {
        score += 30;
        matchReasons.push(`Located in ${course.region}`);
      } else {
        score -= 20;
      }
    } else if (accessRanking.length > 0) {
      // No specific destination — rank by what's most accessible to the group
      const regionRank = accessRanking.indexOf(course.region);
      if (regionRank === 0) {
        score += 30;
        matchReasons.push(`Most accessible for your group`);
      } else if (regionRank === 1) {
        score += 20;
        matchReasons.push(`Easy to reach for most members`);
      } else if (regionRank === 2) {
        score += 10;
      } else if (regionRank < 0) {
        score -= 10;
      }
    } else {
      score += 5; // No info — treat all regions equally
    }

    // Travel convenience bonus: if course region is in top-2 accessible for most members
    if (accessRanking.length > 0 && accessRanking.slice(0, 2).includes(course.region)) {
      const memberCount = filters.memberLocations!.filter((loc) =>
        getAccessibleRegions(loc).slice(0, 2).includes(course.region)
      ).length;
      if (memberCount === filters.memberLocations!.length) {
        score += 10;
        matchReasons.push(`Easy flight for all ${memberCount} members`);
      } else if (memberCount >= Math.ceil(filters.memberLocations!.length * 0.75)) {
        score += 5;
        matchReasons.push(`Convenient for ${memberCount}/${filters.memberLocations!.length} members`);
      }
    }

    // Skill level match
    if (allowedLevels.includes(course.courseLevel)) {
      score += 25;
      matchReasons.push(`${course.courseLevel} level suits your group`);
    } else {
      score -= 15;
    }

    // Budget match
    const range = PRICE_RANGES[course.priceRange];
    if (estimatedGolfBudget >= range.min && estimatedGolfBudget <= range.max) {
      score += 20;
      matchReasons.push(`Within your golf budget (~$${Math.round(estimatedGolfBudget)}/round)`);
    } else if (course.avgGreenFee <= estimatedGolfBudget * 1.3) {
      score += 10;
    } else if (course.avgGreenFee > estimatedGolfBudget * 2) {
      score -= 25;
    }

    // Play & stay bonus if requested
    if (
      (filters.lodgingType === "play-and-stay" || filters.lodgingType === "flexible") &&
      course.playAndStayAvailable
    ) {
      score += 15;
      matchReasons.push("Play & stay packages available");
    }

    // Group size bonus for resort courses
    if (filters.numberOfGolfers >= 8 && course.playAndStayAvailable) {
      score += 5;
      matchReasons.push("Great for large groups");
    }

    return { course, score, matchReasons };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getCourseLevelColor(level: CourseLevel): string {
  const map: Record<CourseLevel, string> = {
    "Beginner-Friendly": "bg-green-100 text-green-800",
    Intermediate: "bg-blue-100 text-blue-800",
    Challenging: "bg-yellow-100 text-yellow-800",
    Championship: "bg-red-100 text-red-800",
    Links: "bg-purple-100 text-purple-800",
  };
  return map[level];
}

export function getSlopeDescription(slope: number): string {
  if (slope < 105) return "Easy";
  if (slope < 120) return "Moderate";
  if (slope < 135) return "Tough";
  if (slope < 145) return "Very Difficult";
  return "Extreme";
}
