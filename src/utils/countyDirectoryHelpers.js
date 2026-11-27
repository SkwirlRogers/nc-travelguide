import countiesData from "../data/counties.json";
import countyStats from "../data/county-stats.json";

export function makeSlug(str) {
  if (!str) return "";
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function formatNumber(val) {
  if (!val) return "N/A";
  const clean = String(val).replace(/,/g, "").split(".")[0];
  const num = parseInt(clean, 10);
  if (isNaN(num)) return val;
  return num.toLocaleString();
}

export function getAllCounties() {
  return countiesData.map((county) => {
    const rawCountyName = county.County.replace(/\s+County$/i, "").trim();
    const slug = county.Slug || makeSlug(county.County);
    const stats = countyStats[slug] || {};
    const cityCount = stats.cityCount || 0;
    const attractionCount = stats.attractionCount || 0;
    const hotelCount = stats.hotelCount || 0;
    const restaurantCount = stats.restaurantCount || 0;
    return {
      ...county,
      slug,
      rawCountyName,
      cityCount,
      attractionCount,
      hotelCount,
      restaurantCount,
      totalExperiencesCount: stats.totalExperiencesCount || (attractionCount + hotelCount + restaurantCount)
    };
  });
}
