import attractionsData from "../data/attractions.json";
import hotelsData from "../data/hotels.json";
import restaurantsData from "../data/restaurants.json";
import { makeSlug } from "./countyDirectoryHelpers";
import countiesData from "../data/counties.json";
import { getCountyMacroRegions } from "./regionHelpers";

const normalizeCountyReference = (value) => String(value || "").toLowerCase()
  .replaceAll(" county", "").replaceAll(" ", "").replaceAll("-", "").replaceAll("_", "").trim();
const countyByName = new Map(countiesData.map((county) => [normalizeCountyReference(county.County), county]));
const countyReferences = (value) => String(value || "").split("/").map((part) => part.trim()).filter(Boolean);
const matchesCounty = (reference, selected) => countyReferences(reference)
  .some((part) => normalizeCountyReference(part) === normalizeCountyReference(selected));
const macroRegionsForCounty = (county) => getCountyMacroRegions(county);
const matchesMacroRegion = (item, selected) => {
  if (selected === "all") return true;
  const related = countyReferences(item.County)
    .map((name) => countyByName.get(normalizeCountyReference(name))).filter(Boolean);
  const macroRegions = related.flatMap(macroRegionsForCounty);
  if (macroRegions.length) return macroRegions.includes(selected);
  const labels = [item.Region, item["Sub-Region"]].map((value) => String(value || "").toLowerCase());
  if (selected === "Mountains") return labels.some((value) => value.includes("mountain"));
  if (selected === "Central Piedmont") return labels.some((value) => value.includes("central piedmont"));
  if (selected === "Atlantic Coastal") return labels.some((value) => value.includes("atlantic") || value.includes("coastal"));
  if (selected === "Sandhills / Inner Coastal") return labels.some((value) => value.includes("sandhill") || value.includes("inner coastal"));
  return false;
};


// Master search & directory query function
export function searchExperiences({ query = '', type = 'all', region = 'all', county = 'all', category = 'all', limit = 100 }) {
  const results = [];

  const q = query.toLowerCase().trim();

  // Search Attractions
  if (type === 'all' || type === 'attractions') {
    attractionsData.forEach(item => {
      const title = item.Attractions || '';
      const desc = item.Description || '';
      const city = item.City || '';
      const itemCounty = item.County || '';
      const itemRegion = item.Region || '';
      const cat = item.Category || 'Attraction';
      const targetLink = item['Website / Affiliate Link'] || '';

      const matchQuery = !q || (title + desc + city + itemCounty + cat).toLowerCase().includes(q);
      const matchRegion = matchesMacroRegion(item, region);
      const matchCounty = county === 'all' || matchesCounty(itemCounty, county);
      const matchCategory = category === 'all' || (cat.toLowerCase() === category.toLowerCase());

      if (matchQuery && matchRegion && matchCounty && matchCategory) {
        results.push({
          id: `attr-${makeSlug(title)}`,
          title,
          type: 'Attraction',
          category: cat,
          city,
          county: itemCounty,
          region: itemRegion,
          description: desc,
          address: item.Address || `${city}, NC`,
          targetLink,
          slug: item.Slug || makeSlug(title)
        });
      }
    });
  }

  // Search Hotels
  if (type === 'all' || type === 'hotels') {
    hotelsData.forEach(item => {
      const title = item['Hotel & Resort'] || '';
      const desc = item.Description || '';
      const city = item.City || '';
      const itemCounty = item.County || '';
      const itemRegion = item.Region || '';
      const cat = item.Category || 'Resort';
      const targetLink = item.Target_Link || '';

      const matchQuery = !q || (title + desc + city + itemCounty + cat).toLowerCase().includes(q);
      const matchRegion = matchesMacroRegion(item, region);
      const matchCounty = county === 'all' || matchesCounty(itemCounty, county);
      const matchCategory = category === 'all' || (cat.toLowerCase() === category.toLowerCase());

      if (matchQuery && matchRegion && matchCounty && matchCategory) {
        results.push({
          id: `hotel-${makeSlug(title)}`,
          title,
          type: 'Hotel',
          category: cat,
          city,
          county: itemCounty,
          region: itemRegion,
          description: desc,
          address: item.Address || `${city}, NC`,
          targetLink,
          slug: item.Slug || makeSlug(title)
        });
      }
    });
  }

  // Search Restaurants
  if (type === 'all' || type === 'restaurants') {
    restaurantsData.forEach(item => {
      const title = item.Restaurant || '';
      const desc = item.Description || '';
      const city = item.City || '';
      const itemCounty = item.County || '';
      const itemRegion = item.Region || item['Sub-Region'] || '';
      const cat = item.Cuisine || 'Dining';
      const targetLink = item.Target_Link || '';

      const matchQuery = !q || (title + desc + city + itemCounty + cat).toLowerCase().includes(q);
      const matchRegion = matchesMacroRegion(item, region);
      const matchCounty = county === 'all' || matchesCounty(itemCounty, county);
      const matchCategory = category === 'all' || (cat.toLowerCase() === category.toLowerCase());

      if (matchQuery && matchRegion && matchCounty && matchCategory) {
        results.push({
          id: `rest-${makeSlug(title)}`,
          title,
          type: 'Restaurant',
          category: cat,
          city,
          county: itemCounty,
          region: itemRegion,
          description: desc,
          address: item.Address || `${city}, NC`,
          targetLink,
          slug: item.Slug || makeSlug(title)
        });
      }
    });
  }

  return results.slice(0, limit);
}
