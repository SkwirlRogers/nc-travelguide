import countiesData from "../data/counties.json";

export function getCountyMacroRegions(county) {
  const mapping = {
    "Mountain": ["Mountains"],
    "Central Piedmont": ["Central Piedmont"],
    "Atlantic Coastal": ["Atlantic Coastal"],
    "Inland-Inner Coastal": ["Sandhills / Inner Coastal"],
    "Mountain-Central Piedmont": ["Mountains", "Central Piedmont"],
    "Piedmont-Mountain": ["Central Piedmont", "Mountains"]
  };
  return mapping[county?.Region] || [];
}

export function getMacroRegions() {
  const definitions = [
    {
      name: "Mountains",
      slug: "mountains",
      sourceRegions: ["Mountain", "Mountain-Central Piedmont", "Piedmont-Mountain"],
      subRegions: ["Blue Ridge Mountains", "Smoky Mountains", "High Country", "Foothills"],
      description: "Towering peaks, the historic Blue Ridge Parkway, waterfalls, mountain communities, and dramatic ridgelines.",
      featuredCities: "Asheville, Boone, Blowing Rock, Hendersonville",
      image: "/images/hero-linn-cove.jpg"
    },
    {
      name: "Central Piedmont",
      slug: "central-piedmont",
      sourceRegions: ["Central Piedmont", "Mountain-Central Piedmont", "Piedmont-Mountain"],
      subRegions: ["The Triangle", "Charlotte Metro", "The Triad", "Lake Norman Region"],
      description: "North Carolina's central urban and cultural corridor, including research, finance, education, manufacturing, and major city destinations.",
      featuredCities: "Raleigh, Charlotte, Durham, Winston-Salem, Cary",
      image: "/images/piedmont_cityscape.jpg"
    },
    {
      name: "Atlantic Coastal",
      slug: "atlantic-coastal",
      sourceRegions: ["Atlantic Coastal"],
      subRegions: ["Outer Banks", "Crystal Coast", "Cape Fear Coast", "Brunswick Islands", "Inner Banks"],
      description: "Barrier islands, historic waterfronts, coastal communities, maritime heritage, beaches, and estuarine landscapes.",
      featuredCities: "Wilmington, Nags Head, Beaufort, Emerald Isle",
      image: "/images/coastal_lighthouse.jpg"
    },
    {
      name: "Sandhills / Inner Coastal",
      slug: "sandhills-inner-coastal",
      sourceRegions: ["Inland-Inner Coastal"],
      subRegions: ["Sandhills", "Uwharrie Lakes", "Yadkin Valley"],
      description: "Longleaf pine landscapes, Sandhills communities, golf and equestrian destinations, agricultural heritage, and inland coastal corridors.",
      featuredCities: "Pinehurst, Southern Pines, Fayetteville, Asheboro",
      image: "/images/sandhills_golf.jpg"
    }
  ];

  return definitions.map((region) => ({
    ...region,
    countiesCount: countiesData.filter((county) => getCountyMacroRegions(county).includes(region.name)).length
  }));
}
