import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname.replace(/\/$/, "") || "/");
const failures = [];
let checked = 0;

if (!routes.length) throw new Error("[seo-validation] No page URLs found in sitemap.xml.");

for (const route of routes) {
  const file = route === "/"
    ? path.join(dist, "index.html")
    : path.join(dist, route.slice(1), "index.html");
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch {
    failures.push(route + ": missing static HTML file");
    continue;
  }
  checked += 1;
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const descriptions = head.match(/<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>/gi) || [];
  const canonicals = head.match(/<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/gi) || [];
  if (descriptions.length !== 1) failures.push(route + ": expected exactly one HTML meta description, found " + descriptions.length);
  if (canonicals.length !== 1) failures.push(route + ": expected exactly one canonical link, found " + canonicals.length);
  if (/\\\\n/.test(head)) failures.push(route + ": literal backslash-n sequence found in HTML head");
  const canonicalUrl = canonicals[0]?.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
  const expectedUrl = "https://nctravelguide.us.mw" + (route === "/" ? "/" : route);
  if (canonicalUrl !== expectedUrl) failures.push(route + ": canonical mismatch (expected " + expectedUrl + ", found " + (canonicalUrl || "none") + ")");
}

let countyMapCount = 0;
try {
  const manifest = JSON.parse(await readFile(path.join(dist, "county-maps/manifest.json"), "utf8"));
  const counties = manifest.counties || [];
  countyMapCount = counties.length;
  if (countyMapCount !== 100) failures.push("expected 100 county map assets, found " + countyMapCount);
  for (const item of counties) {
    const file = path.join(dist, item.file.replace(/^\//, ""));
    try { await access(file); } catch { failures.push("missing county map asset: " + item.file); }
    const escapedUrl = "https://nctravelguide.us.mw" + item.file;
    if (!sitemap.includes("<image:loc>" + escapedUrl + "</image:loc>")) {
      failures.push("county map missing from image sitemap: " + item.file);
    }
  }
} catch {
  console.warn("[seo-validation] County map manifest unavailable; static map checks skipped.");
}

if (failures.length) {
  console.error("[seo-validation] " + failures.length + " failure(s) across " + checked + " static routes:");
  for (const failure of failures.slice(0, 60)) console.error(" - " + failure);
  throw new Error("[seo-validation] Static SEO validation failed.");
}
console.log("[seo-validation] Passed: " + checked + " static routes have one meta description, one canonical, and no escaped newline artifacts.");
if (countyMapCount) console.log("[seo-validation] Passed: " + countyMapCount + " county map assets exist and appear in the image sitemap.");
