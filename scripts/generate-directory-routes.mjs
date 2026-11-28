import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));
const [cities, attractions, counties, macroRegions, aiIndex] = await Promise.all([
  readJson("src/data/cities.json"),
  readJson("src/data/attractions.json"),
  readJson("src/data/counties.json"),
  readJson("src/data/macro-regions.json"),
  readJson("public/ai-index.json")
]);
const normalize = (value) => String(value || "").toLowerCase()
  .replace(/\s+county$/i, "").replace(/[\s_-]/g, "").trim();
const countyByName = new Map(counties.map((county) => [normalize(county.County), county]));
const getMacroRegions = (county) => {
  const label = county?.Region;
  if (macroRegions.cross_region_labels[label]) return macroRegions.cross_region_labels[label];
  return macroRegions.macro_regions
    .filter((region) => region.direct_region_labels.includes(label))
    .map((region) => region.name);
};
const seenSlugs = new Set();
const eligible = [];
const skipped = [];

for (const town of cities) {
  const slug = String(town.Slug || "").trim();
  const refs = String(town.County || "").split("/").map((part) => part.trim()).filter(Boolean);
  const countyRecords = refs.map((ref) => countyByName.get(normalize(ref))).filter(Boolean);
  const valid = slug && !seenSlugs.has(slug)
    && String(town.City || "").trim()
    && String(town.Description || "").trim().length >= 40
    && /^https?:\/\//i.test(String(town["Tourism Website"] || ""))
    && Number.isFinite(Number(town.Latitude))
    && Number.isFinite(Number(town.Longitude))
    && refs.length > 0 && countyRecords.length === refs.length;
  if (!valid) {
    skipped.push({ name: town.City, slug, county: town.County });
    continue;
  }
  seenSlugs.add(slug);
  const regions = [...new Set(countyRecords.flatMap(getMacroRegions))];
  eligible.push({
    name: town.City,
    slug,
    county_names: countyRecords.map((county) => county.County),
    macro_regions: regions,
    url: "https://nctravelguide.us.mw/towns/" + slug,
    official_website: town["Tourism Website"]
  });
}
if (skipped.length) {
  console.warn("[generate-directory-routes] Skipped " + skipped.length + " town records failing profile quality gates.");
}
const attractionSlugs = new Set();
const eligibleAttractions = [];
for (const attraction of attractions) {
  const slug = String(attraction.Slug || "").trim();
  const refs = String(attraction.County || "").split("/").map((part) => part.trim()).filter(Boolean);
  const countyRecords = refs.map((ref) => countyByName.get(normalize(ref))).filter(Boolean);
  const website = String(attraction["Website / Affiliate Link"] || "");
  const valid = slug && !attractionSlugs.has(slug)
    && String(attraction.Attractions || "").trim()
    && String(attraction.Description || "").trim().length >= 40
    && String(attraction.Address || "").trim()
    && /^https?:\/\//i.test(website)
    && refs.length > 0 && countyRecords.length === refs.length;
  if (!valid) continue;
  attractionSlugs.add(slug);
  eligibleAttractions.push({
    name: attraction.Attractions,
    slug,
    category: attraction.Category || "Attraction",
    city: attraction.City || null,
    county_names: countyRecords.map((county) => county.County),
    address: attraction.Address,
    url: "https://nctravelguide.us.mw/attractions/" + slug,
    listed_website: website
  });
}
const sitemapPath = path.join(root, "public/sitemap.xml");
let sitemap = await readFile(sitemapPath, "utf8");
const existing = new Set([...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]));
const directoryUrl = "https://nctravelguide.us.mw/towns";
const newUrls = [directoryUrl, ...eligible.map((town) => town.url), ...eligibleAttractions.map((item) => item.url)].filter((url) => !existing.has(url));
if (newUrls.length) {
  sitemap = sitemap.replace("</urlset>", newUrls.map((url) => "  <url><loc>" + url + "</loc></url>").join("\n") + "\n</urlset>");
  await writeFile(sitemapPath, sitemap, "utf8");
}
aiIndex.town_directory = {
  url: "https://nctravelguide.us.mw/towns",
  profile_count: eligible.length,
  description: "Town and community profiles linked to their source county records, regional context, coordinates, descriptions, and official municipal websites."
};
aiIndex.town_pages = eligible;
aiIndex.attraction_pages = eligibleAttractions;
aiIndex.attraction_directory = {
  url: "https://nctravelguide.us.mw/experiences",
  profile_count: eligibleAttractions.length,
  description: "Attraction detail profiles are published when a listing has a substantive description, a resolved county relationship, an address, and an HTTP(S) directory link."
};
aiIndex.sections = aiIndex.sections || [];
if (!aiIndex.sections.some((section) => section.url === directoryUrl)) {
  aiIndex.sections.push({ name: "Towns & Communities", url: directoryUrl, summary: "Searchable directory of North Carolina town and community profiles linked to county and regional guides." });
}
aiIndex.last_updated = new Date().toISOString().slice(0, 10);
await writeFile(path.join(root, "public/ai-index.json"), JSON.stringify(aiIndex, null, 2) + "\n");
console.log("[generate-directory-routes] " + eligible.length + " town profiles and " + eligibleAttractions.length + " attraction profiles qualified; " + newUrls.length + " sitemap URLs added; " + skipped.length + " town records skipped.");
