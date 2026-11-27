import countiesData from "../data/counties.json";
import macroRegionData from "../data/macro-regions.json";

export function getCountyMacroRegions(county) {
  const label = county?.Region;
  const crossRegion = macroRegionData.cross_region_labels[label];
  if (crossRegion) return crossRegion;
  return macroRegionData.macro_regions
    .filter((region) => region.direct_region_labels.includes(label))
    .map((region) => region.name);
}

export function getMacroRegions() {
  return macroRegionData.macro_regions.map((region) => ({
    name: region.name,
    slug: region.slug,
    sourceRegions: region.subregion_source_labels,
    subRegions: region.sub_regions,
    description: region.description,
    featuredCities: region.featured_cities,
    image: region.image,
    countiesCount: countiesData.filter((county) => getCountyMacroRegions(county).includes(region.name)).length
  }));
}
