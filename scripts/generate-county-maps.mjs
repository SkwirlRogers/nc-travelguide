import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const counties = JSON.parse(await readFile(path.join(root, "src/data/counties.json"), "utf8"));
const outputDir = path.join(root, "public/county-maps");
const endpoint = "https://services1.arcgis.com/YBWrN5qiESVpqi92/arcgis/rest/services/ncgs_state_county_boundary/FeatureServer/0/query?where=1%3D1&outFields=County,FIPS&returnGeometry=true&outSR=4326&f=geojson";
const normalize = (value = "") => String(value).toLowerCase().replace(/\s+county$/i, "").replace(/[^a-z0-9]/g, "");

function ringsFor(feature) {
  const geometry = feature?.geometry;
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates || [];
  if (geometry.type === "MultiPolygon") return (geometry.coordinates || []).flat();
  return [];
}
function pathFor(feature, width = 160, height = 100, padding = 8) {
  const rings = ringsFor(feature);
  const points = rings.flat();
  if (!points.length) return "";
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 0.000001);
  const spanY = Math.max(maxY - minY, 0.000001);
  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;
  return rings.map((ring) => ring.map((point, index) => {
    const x = offsetX + (point[0] - minX) * scale;
    const y = height - offsetY - (point[1] - minY) * scale;
    return (index ? "L" : "M") + x.toFixed(2) + "," + y.toFixed(2);
  }).join(" ") + " Z").join(" ");
}
function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  })[character]);
}

try {
  const response = await fetch(endpoint, {
    headers: { "Accept": "application/geo+json, application/json" },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error("Boundary service returned HTTP " + response.status);
  const collection = await response.json();
  if (!Array.isArray(collection.features) || collection.features.length < 95) {
    throw new Error("Boundary service returned fewer than 95 county features");
  }
  const features = new Map(collection.features.map((feature) => [normalize(feature.properties?.County), feature]));
  const missing = [];
  const manifest = [];
  await mkdir(outputDir, { recursive: true });
  for (const county of counties) {
    const name = String(county.County || "").replace(/\s+County$/i, "");
    const feature = features.get(normalize(name));
    const d = feature ? pathFor(feature) : "";
    if (!d) {
      missing.push(name);
      continue;
    }
    const title = escapeXml(name + " County, North Carolina boundary map");
    const desc = "County boundary outline based on North Carolina Geodetic Survey and NC OneMap boundary geometry.";
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 160 100" role="img" aria-labelledby="title desc">' +
      '<title id="title">' + title + '</title><desc id="desc">' + desc + '</desc>' +
      '<rect width="160" height="100" rx="8" fill="#f4f7f5"/>' +
      '<path d="' + d + '" fill="#d9e9e4" stroke="#176b5b" stroke-width="1.7" stroke-linejoin="round" fill-rule="evenodd"/>' +
      '<path d="' + d + '" fill="none" stroke="#ffffff" stroke-width=".45" stroke-linejoin="round" pointer-events="none"/></svg>';
    const filename = county.Slug + ".svg";
    await writeFile(path.join(outputDir, filename), svg + "\n", "utf8");
    manifest.push({ slug: county.Slug, name, file: "/county-maps/" + filename });
  }
  if (missing.length) throw new Error("Could not match county boundaries for: " + missing.join(", "));
  await writeFile(path.join(outputDir, "manifest.json"), JSON.stringify({
    source: "North Carolina Geodetic Survey / NC OneMap ArcGIS county boundary service",
    generated_at: new Date().toISOString(),
    county_count: manifest.length,
    counties: manifest
  }, null, 2) + "\n", "utf8");

  const sitemapPath = path.join(root, "public/sitemap.xml");
  let sitemap = await readFile(sitemapPath, "utf8");
  sitemap = sitemap.replace(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  );
  for (const item of manifest) {
    const pageUrl = "https://nctravelguide.us.mw/counties/" + item.slug;
    const urlEntry = "<url><loc>" + pageUrl + "</loc></url>";
    const imageEntry = '<url><loc>' + pageUrl + '</loc><image:image><image:loc>https://nctravelguide.us.mw' + item.file + '</image:loc><image:title>' + escapeXml(item.name + " County boundary map") + '</image:title></image:image></url>';
    if (sitemap.includes(urlEntry) && !sitemap.includes("<image:loc>https://nctravelguide.us.mw" + item.file + "</image:loc>")) {
      sitemap = sitemap.replace(urlEntry, imageEntry);
    }
  }
  await writeFile(sitemapPath, sitemap, "utf8");
  console.log("[county-maps] Generated " + manifest.length + " individual county SVG maps.");
} catch (error) {
  console.warn("[county-maps] Static map generation skipped; the interactive GIS map remains available. " + error.message);
}
