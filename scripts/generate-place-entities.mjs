import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src/data");
const publicDir = path.join(root, "public");
const readJson = async (file) => JSON.parse(await readFile(path.join(dataDir, file), "utf8"));
const [counties, cities, attractions, hotels, restaurants] = await Promise.all([
  readJson("counties.json"),
  readJson("cities.json"),
  readJson("attractions.json"),
  readJson("hotels.json"),
  readJson("restaurants.json")
]);

const normalize = (value) => String(value || "").toLowerCase().replace(/\\s+county$/i, "").trim();
const slugify = (value) => String(value || "").toLowerCase().trim()
  .replace(/[^a-z0-9\\s-]/g, "").replace(/[\\s_-]+/g, "-").replace(/^-+|-+$/g, "");
const isHttpUrl = (value) => /^https?:\\/\\//i.test(String(value || "").trim());
const countyByName = new Map(counties.map((county) => [normalize(county.County), county]));
const macroRegion = (region) => ({
  "Mountain": "Mountains",
  "Central Piedmont": "Central Piedmont",
  "Atlantic Coastal": "Atlantic Coastal",
  "Inland-Inner Coastal": "Sandhills / Inner Coastal",
  "Mountain-Central Piedmont": "Mountains / Central Piedmont",
  "Piedmont-Mountain": "Central Piedmont / Mountains"
}[region] || null);

const entities = [];
const audit = {
  generated_at: new Date().toISOString(),
  source_files: ["counties.json", "cities.json", "attractions.json", "hotels.json", "restaurants.json"],
  checks: {
    missing_county_reference: [],
    unknown_county_reference: [],
    duplicate_entity_ids: [],
    missing_descriptions: [],
    missing_external_links: []
  },
  counts: {}
};

function addEntity({ type, sourceFile, sourceRow, name, slug, countyName, description, category, address, city, externalUrl, latitude, longitude }) {
  const county = countyByName.get(normalize(countyName));
  const id = type.toLowerCase() + ":" + (slug || slugify(name));
  const entity = {
    id,
    type,
    name: String(name || "").trim(),
    slug: slug || slugify(name),
    county: county?.County || (countyName ? String(countyName).trim() : null),
    county_url: county ? "https://nctravelguide.us.mw/counties/" + county.Slug : null,
    region: county?.Region || null,
    macro_region: county ? macroRegion(county.Region) : null,
    sub_region: county?.["Sub-Region"] || null,
    city: city || null,
    category: category || null,
    description: description || null,
    address: address || null,
    coordinates: Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null,
    external_url: isHttpUrl(externalUrl) ? String(externalUrl).trim() : null,
    detail_url: null,
    provenance: {
      dataset: "NC Travel Guide editorial directory",
      source_file: sourceFile,
      source_row: sourceRow,
      external_url_status: "recorded_not_independently_verified"
    }
  };
  entities.push(entity);
  if (!countyName) audit.checks.missing_county_reference.push(id);
  else if (!county) audit.checks.unknown_county_reference.push({ id, county: countyName });
  if (!description) audit.checks.missing_descriptions.push(id);
  if (!entity.external_url) audit.checks.missing_external_links.push(id);
}

counties.forEach((row, index) => addEntity({
  type: "AdministrativeArea", sourceFile: "counties.json", sourceRow: index + 1,
  name: row.County, slug: row.Slug, countyName: row.County,
  description: null, category: "County", externalUrl: row["Tourism Website"]
}));

cities.forEach((row, index) => {
  const lat = Number(row.Latitude);
  const lon = Number(row.Longitude);
  addEntity({
    type: "City", sourceFile: "cities.json", sourceRow: index + 1,
    name: row.City, slug: row.Slug, countyName: row.County,
    description: row.Description, category: "Municipality",
    city: row.City, externalUrl: row["Tourism Website"],
    latitude: Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lon) ? lon : null
  });
});

attractions.forEach((row, index) => addEntity({
  type: "TouristAttraction", sourceFile: "attractions.json", sourceRow: index + 1,
  name: row.Attractions, slug: row.Slug, countyName: row.County,
  description: row.Description, category: row.Category,
  address: row.Address, city: row.City, externalUrl: row["Website / Affiliate Link"]
}));

hotels.forEach((row, index) => addEntity({
  type: "Hotel", sourceFile: "hotels.json", sourceRow: index + 1,
  name: row["Hotel & Resort"], slug: row.Slug, countyName: row.County,
  description: row.Description, category: row.Category,
  address: row.Address, city: row.City, externalUrl: row.Target_Link
}));

restaurants.forEach((row, index) => addEntity({
  type: "Restaurant", sourceFile: "restaurants.json", sourceRow: index + 1,
  name: row.Restaurant, slug: row.Slug, countyName: row.County,
  description: row.Description, category: row.Cuisine,
  address: row.Address, city: row.City, externalUrl: row.Target_Link
}));

const ids = new Set();
for (const entity of entities) {
  if (ids.has(entity.id)) audit.checks.duplicate_entity_ids.push(entity.id);
  ids.add(entity.id);
}
audit.counts = {
  total_entities: entities.length,
  by_type: entities.reduce((counts, entity) => {
    counts[entity.type] = (counts[entity.type] || 0) + 1;
    return counts;
  }, {}),
  missing_county_reference: audit.checks.missing_county_reference.length,
  unknown_county_reference: audit.checks.unknown_county_reference.length,
  duplicate_entity_ids: audit.checks.duplicate_entity_ids.length,
  missing_descriptions: audit.checks.missing_descriptions.length,
  missing_external_links: audit.checks.missing_external_links.length
};

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, "place-entities.json"), JSON.stringify({
    schema_version: "1.0",
    generated_at: audit.generated_at,
    description: "Machine-readable directory entities generated from the NC Travel Guide's county, city, attraction, lodging, and restaurant datasets. External links are recorded directory links and are not represented as independently verified.",
    entity_count: entities.length,
    entities
  }, null, 2) + "\\n"),
  writeFile(path.join(publicDir, "data-quality-report.json"), JSON.stringify(audit, null, 2) + "\\n")
]);

const aiIndexPath = path.join(publicDir, "ai-index.json");
try {
  const aiIndex = JSON.parse(await readFile(aiIndexPath, "utf8"));
  aiIndex.place_entity_index = {
    url: "https://nctravelguide.us.mw/place-entities.json",
    entity_count: entities.length,
    entity_types: audit.counts.by_type,
    description: "Machine-readable records for counties, municipalities, attractions, lodging, and restaurants."
  };
  aiIndex.data_quality_report = {
    url: "https://nctravelguide.us.mw/data-quality-report.json",
    description: "Automated dataset integrity checks. A clean report does not independently verify factual accuracy or external links."
  };
  aiIndex.last_updated = new Date().toISOString().slice(0, 10);
  await writeFile(aiIndexPath, JSON.stringify(aiIndex, null, 2) + "\\n");
} catch (error) {
  throw new Error("Could not update public/ai-index.json: " + error.message);
}

console.log("[generate-place-entities] Generated " + entities.length + " entities; " +
  audit.counts.unknown_county_reference + " unknown county references; " +
  audit.counts.duplicate_entity_ids + " duplicate IDs.");
