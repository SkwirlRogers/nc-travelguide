import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.resolve("src/data");
const readJson = async (name) => JSON.parse(await readFile(path.join(dataDir, name), "utf8"));
const [counties, cities, attractions, hotels, restaurants] = await Promise.all([
  readJson("counties.json"),
  readJson("cities.json"),
  readJson("attractions.json"),
  readJson("hotels.json"),
  readJson("restaurants.json")
]);
const makeSlug = (value) => String(value || "").toLowerCase().trim()
  .replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
const normalize = (value) => String(value || "").toLowerCase().trim();
const countForCounty = (rows, countyName, rawName) => rows.filter((item) => {
  const value = normalize(item.County);
  return value && (value === normalize(countyName) || value === normalize(rawName));
}).length;

const stats = {};
for (const county of counties) {
  const rawName = county.County.replace(/\s+County$/i, "").trim();
  const slug = county.Slug || makeSlug(county.County);
  const cityCount = countForCounty(cities, county.County, rawName);
  const attractionCount = countForCounty(attractions, county.County, rawName);
  const hotelCount = countForCounty(hotels, county.County, rawName);
  const restaurantCount = countForCounty(restaurants, county.County, rawName);
  stats[slug] = {
    cityCount,
    attractionCount,
    hotelCount,
    restaurantCount,
    totalExperiencesCount: attractionCount + hotelCount + restaurantCount
  };
}
const featured = attractions.slice(0, 6).map((item) => {
  const title = item.Attractions || "";
  const city = item.City || "";
  return {
    id: "attr-" + makeSlug(title),
    title,
    type: "Attraction",
    category: item.Category || "Attraction",
    city,
    county: item.County || "",
    region: item.Region || "",
    description: item.Description || "",
    address: item.Address || (city + ", NC"),
    targetLink: item["Website / Affiliate Link"] || "",
    slug: item.Slug || makeSlug(title)
  };
});
await Promise.all([
  writeFile(path.join(dataDir, "county-stats.json"), JSON.stringify(stats, null, 2) + "\n"),
  writeFile(path.join(dataDir, "featured-attractions.json"), JSON.stringify(featured, null, 2) + "\n")
]);
console.log("[generate-light-data] Updated county statistics and featured attraction data.");
