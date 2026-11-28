import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");
const counties = JSON.parse(await readFile(path.join(root, "src/data/counties.json"), "utf8"));
const historyVault = JSON.parse(await readFile(path.join(root, "src/data/county-history.json"), "utf8"));
const cities = JSON.parse(await readFile(path.join(root, "src/data/cities.json"), "utf8"));
const attractions = JSON.parse(await readFile(path.join(root, "src/data/attractions.json"), "utf8"));
const sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");

const countyBySlug = new Map(counties.map((county) => [county.Slug, county]));
const cityBySlug = new Map(cities.map((city) => [city.Slug, city]));
const normalizeCounty = (value) => String(value || "").toLowerCase().replace(/\s+county$/i, "").replace(/[\s_-]/g, "").trim();
const siteRoot = "https://nctravelguide.us.mw";
const sectionPages = {
  "/": {
    title: "North Carolina Travel Guide | Explore All 100 Counties",
    description: "Plan your North Carolina trip with a guide to all 100 counties, mountain and coastal regions, attractions, places to stay, local dining, history, and travel ideas.",
    type: "WebPage",
    about: "North Carolina travel, destinations, and regional heritage"
  },
  "/regions": {
    title: "North Carolina Regions & Sub-Regions | NC Travel Guide",
    description: "Explore North Carolina's four broad travel regions and 17 sub-regions, from the Blue Ridge Mountains and Piedmont cities to the Sandhills and Atlantic coast.",
    type: "CollectionPage",
    about: "North Carolina geographic regions and travel destinations"
  },
  "/towns": {
    title: "North Carolina Towns & Communities | NC Travel Guide",
    description: "Search and explore 361 North Carolina town and community profiles connected to county guides, regional context, mapped coordinates, and local resources.",
    type: "CollectionPage",
    about: "North Carolina towns, cities, and communities"
  },
  "/counties": {
    title: "All 100 North Carolina Counties | County Travel Guides",
    description: "Browse all 100 North Carolina counties with local hubs, regional context, attractions, itineraries, travel logistics, places to stay, and dining discovery.",
    type: "CollectionPage",
    about: "The 100 counties of North Carolina"
  },
  "/history": {
    title: "North Carolina History & Heritage | NC Travel Guide",
    description: "Explore North Carolina history and heritage through sourced historic milestones, state symbols, archival photographs, primary-source records, and links to holding institutions.",
    type: "CollectionPage",
    about: "North Carolina history, historic places, and regional heritage"
  },
  "/travel-ideas": {
    title: "North Carolina Travel Ideas & Itineraries | NC Travel Guide",
    description: "Explore North Carolina travel ideas, regional itineraries, attractions, and destination inspiration across the state's mountains, Piedmont, Sandhills, and coast.",
    type: "CollectionPage",
    about: "North Carolina destinations, travel ideas, and visitor experiences"
  },
  "/experiences": {
    title: "North Carolina Attractions, Hotels & Dining | Experiences Directory",
    description: "Search a statewide directory of North Carolina attractions, outdoor recreation, hotels, resorts, restaurants, and visitor experiences by county and region.",
    type: "CollectionPage",
    about: "North Carolina attractions, accommodations, restaurants, and visitor experiences"
  }
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, attribute, key, value) {
  const expression = new RegExp(`<meta\s+${attribute}="${escapeRegExp(key)}"[^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace("</head>", `  ${tag}\\n  </head>`);
}

function setCanonical(html, url) {
  const expression = /<link\s+rel="canonical"[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace("</head>", `  ${tag}\\n  </head>`);
}

function sourceLink(url, label) {
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function fallbackNavigation() {
  return `<nav aria-label="Primary sections"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/regions">Regions</a></li>
    <li><a href="/counties">All 100 counties</a></li>
    <li><a href="/history">History & heritage</a></li>
    <li><a href="/travel-ideas">Travel ideas</a></li>
    <li><a href="/experiences">Experiences directory</a></li>
  </ul></nav>`;
}

function countyFallback(county, slug, historyRecord = null) {
  const name = county.County;
  const details = [
    `<p><strong>Region:</strong> ${escapeHtml(county.Region)} · <strong>Sub-region:</strong> ${escapeHtml(county["Sub-Region"])}</p>`,
    county["Major Cities"] ? `<p><strong>Major towns and cities:</strong> ${escapeHtml(county["Major Cities"])}</p>` : "",
    county["Tourism Website"] ? `<p><strong>Official county tourism resource:</strong> ${sourceLink(county["Tourism Website"], county["Tourism Website"])}</p>` : ""
  ].join("");

  if (historyRecord) {
    const records = (historyRecord.key_history || []).map((record) => `
      <article>
        <h2>${escapeHtml(record.period)} — ${escapeHtml(record.title)}</h2>
        <p>${escapeHtml(record.summary)}</p>
        <p>Source: ${sourceLink(record.source_url, record.source_name)}</p>
      </article>`).join("");
    const assets = (historyRecord.archival_assets || []).map((asset) => `
      <article>
        <h3>${escapeHtml(asset.title)}</h3>
        <p>${escapeHtml(asset.caption)}</p>
        <p>Collection: ${sourceLink(asset.source_url, asset.source_name)}</p>
      </article>`).join("");
    return `<main style="max-width:960px;margin:2rem auto;padding:1.25rem;font-family:system-ui,sans-serif;line-height:1.65;color:#18251f">
      <h1>${escapeHtml(name)} History Vault | North Carolina Travel Guide</h1>
      <p>A source-led county history collection. Entries identify the source institution or collection; the collection is growing and is not a claim that every aspect of county history is complete.</p>
      ${records}${assets}
      <p>Indigenous history is being developed through a dedicated source-review phase. Do not infer identity or community continuity from colonial labels alone.</p>
      ${fallbackNavigation()}
    </main>`;
  }

  return `<main style="max-width:960px;margin:2rem auto;padding:1.25rem;font-family:system-ui,sans-serif;line-height:1.65;color:#18251f">
    <h1>${escapeHtml(name)} Travel Guide | North Carolina</h1>
    <p>County travel hub for attractions, outdoor recreation, towns, travel ideas, lodging, dining, and visitor information.</p>
    ${details}
    ${slug === "dare-county" ? '<p><a href="/counties/dare-county/history">Explore the Dare County History Vault</a></p>' : ""}
    ${fallbackNavigation()}
  </main>`;
}

function townFallback(town, countyRecords, relatedAttractions) {
  const countyLinks = countyRecords.map((county) =>
    `<li><a href="/counties/${escapeHtml(county.Slug)}">${escapeHtml(county.County)} county guide</a></li>`
  ).join("");
  const attractionsHtml = relatedAttractions.map((item) =>
    `<li><strong>${escapeHtml(item.Attractions)}</strong> — ${escapeHtml(item.Description || "")}</li>`
  ).join("");
  const officialLink = /^https?:\/\//i.test(String(town["Tourism Website"] || ""))
    ? sourceLink(town["Tourism Website"], "Official community website") : "";
  const coordinates = Number.isFinite(Number(town.Latitude)) && Number.isFinite(Number(town.Longitude))
    ? `<p>Mapped coordinates: ${escapeHtml(town.Latitude)}, ${escapeHtml(town.Longitude)} · <a href="https://www.google.com/maps?q=${encodeURIComponent(town.Latitude + "," + town.Longitude)}">View map</a></p>` : "";
  return `<main style="max-width:960px;margin:2rem auto;padding:1.25rem;font-family:system-ui,sans-serif;line-height:1.65;color:#18251f">
    <p><a href="/counties">All North Carolina counties</a></p>
    <h1>${escapeHtml(town.City)}, North Carolina</h1>
    <p>${escapeHtml(town.Description)}</p>
    <h2>County connections</h2><ul>${countyLinks}</ul>
    ${officialLink ? `<p>${officialLink}</p>` : ""}
    ${coordinates}
    ${town.Population ? `<p>Population figure in source directory: ${escapeHtml(String(town.Population).replace(/\.00$/, ""))}</p>` : ""}
    ${attractionsHtml ? `<h2>More to explore in the connected county or counties</h2><p>These directory entries are associated with the same county or counties; they are not necessarily within town limits.</p><ul>${attractionsHtml}</ul>` : ""}
    <p>Directory note: descriptions, population figures, and municipal links come from the guide's source dataset. Confirm current details with local sources before traveling.</p>
    ${fallbackNavigation()}
  </main>`;
}

function routeDefinition(route) {
  if (sectionPages[route]) {
    const page = sectionPages[route];
    let fallback = `<main style="max-width:960px;margin:2rem auto;padding:1.25rem;font-family:system-ui,sans-serif;line-height:1.65;color:#18251f"><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p>${fallbackNavigation()}`;
    if (route === "/towns") {
      fallback += `<h2>North Carolina towns and communities</h2><ul>${cities.map((town) => `<li><a href="/towns/${escapeHtml(town.Slug)}">${escapeHtml(town.City)}</a> — ${escapeHtml(town.County)} County</li>`).join("")}</ul>`;
    }
    if (route === "/counties") {
      fallback += `<h2>All 100 North Carolina counties</h2><ul>${counties.map((county) => `<li><a href="/counties/${escapeHtml(county.Slug)}">${escapeHtml(county.County)}</a> — ${escapeHtml(county.Region)} / ${escapeHtml(county["Sub-Region"])}</li>`).join("")}</ul>`;
    }
    if (route === "/regions") {
      const regions = [...new Set(counties.map((county) => county.Region))].sort();
      fallback += `<h2>North Carolina regions</h2><ul>${regions.map((region) => `<li>${escapeHtml(region)}</li>`).join("")}</ul>`;
    }
    if (route === "/history") {
      fallback += `<h2>Selected source-backed history</h2>
        <ul>
          <li>${sourceLink("https://www.nps.gov/fora/learn/historyculture/the-lost-colony.htm", "National Park Service: The Lost Colony")}</li>
          <li>${sourceLink("https://sites.ncleg.gov/library/april-12-1776-the-halifax-resolves/", "North Carolina General Assembly: Halifax Resolves")}</li>
          <li>${sourceLink("https://www.ncpedia.org/mecklenburg-declaration", "NCpedia: Mecklenburg Declaration evidence and Mecklenburg Resolves")}</li>
          <li>${sourceLink("https://www.nps.gov/articles/the-freedmen-s-colony-on-roanoke-island.htm", "National Park Service: Roanoke Island Freedmen's Colony")}</li>
          <li>${sourceLink("https://www.nps.gov/articles/firstflight.htm", "National Park Service: The First Flight")}</li>
        </ul>`;
    }
    if (route === "/") {
      fallback += `<h2>Plan with current official information</h2><p>The guide links to live weather, National Weather Service alerts, NCDOT road incidents, NOAA tide predictions, and official ferry schedules and notices. Conditions change; confirm details with the relevant agency.</p><p>${sourceLink("https://www.visitnc.com/", "Visit North Carolina")} · ${sourceLink("https://www.ncpedia.org/", "NCpedia")} · ${sourceLink("https://drivenc.gov/", "DriveNC")} · ${sourceLink("https://www.weather.gov/", "National Weather Service")} · ${sourceLink("https://tidesandcurrents.noaa.gov/", "NOAA Tides and Currents")}</p>`;
    }
    return {...page, canonicalPath:route, fallbackHtml:fallback+"</main>"};
  }

  const parts = route.split("/").filter(Boolean);
  if (parts[0] === "towns" && parts[1]) {
    const town = cityBySlug.get(parts[1]);
    if (!town) return null;
    const countyRefs = String(town.County || "").split("/").map((value) => value.trim()).filter(Boolean);
    const countyRecords = countyRefs.map((reference) => counties.find((county) => normalizeCounty(county.County) === normalizeCounty(reference))).filter(Boolean);
    if (!countyRecords.length || countyRecords.length !== countyRefs.length) return null;
    const description = town.Description + " Explore county connections, regional context, and local visitor resources for " + town.City + ", North Carolina.";
    const relatedAttractions = attractions.filter((item) => {
      const refs = String(item.County || "").split("/").map((value) => normalizeCounty(value.trim()));
      return refs.some((reference) => countyRecords.some((county) => normalizeCounty(county.County) === reference));
    }).slice(0, 6);
    const containedInPlace = countyRecords.map((county) => ({
      "@type": "AdministrativeArea",
      "name": county.County + ", North Carolina",
      "url": siteRoot + "/counties/" + county.Slug
    }));
    const placeSchema = {
      "@type": "City",
      "name": town.City + ", North Carolina",
      "description": town.Description,
      "containedInPlace": containedInPlace.length === 1 ? containedInPlace[0] : containedInPlace,
      "sameAs": /^https?:\/\//i.test(String(town["Tourism Website"] || "")) ? town["Tourism Website"] : undefined
    };
    if (Number.isFinite(Number(town.Latitude)) && Number.isFinite(Number(town.Longitude))) {
      placeSchema.geo = { "@type": "GeoCoordinates", "latitude": Number(town.Latitude), "longitude": Number(town.Longitude) };
    }
    return {
      title: town.City + ", NC Visitor Guide | NC Travel Guide",
      description,
      type: "City",
      about: town.City + ", North Carolina",
      canonicalPath: route,
      placeSchema,
      fallbackHtml: townFallback(town, countyRecords, relatedAttractions)
    };
  }
  if (parts[0] === "counties" && parts[1]) {
    const slug = parts[1];
    const county = countyBySlug.get(slug);
    if (!county) return null;
    const historyRecord = historyVault.counties?.[slug] || null;
    const isHistory = parts[2] === "history" && Boolean(historyRecord);
    const name = county.County;
    const title = isHistory
      ? `${name}, NC History Vault | NC Travel Guide`
      : `${name}, NC Travel Guide | NC Travel Guide`;
    const description = isHistory
      ? (historyRecord.seo_description || `Explore ${name}'s source-reviewed historical records, archival assets, and institutional references in the North Carolina History Vault.`)
      : `Plan a visit to ${name}, North Carolina. Explore local attractions, towns, travel ideas, lodging, dining, regional context, and visitor information.`;
    return {
      title,
      description,
      type: isHistory ? "CollectionPage" : "WebPage",
      about: `${name}, North Carolina travel and local history`,
      county,
      canonicalPath: isHistory ? route : `/counties/${slug}`,
      fallbackHtml: countyFallback(county, slug, isHistory ? historyRecord : null)
    };
  }
  return null;
}

function renderStaticRoute(route, definition) {
  let html = baseHtml;
  const canonicalUrl = siteRoot + definition.canonicalPath;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(definition.title)}</title>`);
  html = setMeta(html, "name", "description", definition.description);
  html = setMeta(html, "property", "og:title", definition.title);
  html = setMeta(html, "property", "og:description", definition.description);
  html = setMeta(html, "property", "og:url", canonicalUrl);
  html = setMeta(html, "name", "twitter:title", definition.title);
  html = setMeta(html, "name", "twitter:description", definition.description);
  html = setCanonical(html, canonicalUrl);

  const schemaScript = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (schemaScript) {
    const schema = JSON.parse(schemaScript[1]);
    const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [];
    const filteredGraph = route === "/"
      ? graph
      : graph.filter((node) => !(node["@type"] === "WebPage" && node.url === siteRoot + "/"));
    if (route !== "/") {
      const pageNode = {
        "@type": definition.type,
        "@id": canonicalUrl + "#webpage",
        "url": canonicalUrl,
        "name": definition.title,
        "description": definition.description,
        "isPartOf": {"@id": siteRoot + "/#website"},
        "author": {"@id": siteRoot + "/#creator"},
        "about": definition.county
          ? {"@type":"AdministrativeArea","name":definition.county.County + ", North Carolina","containedInPlace":{"@type":"State","name":"North Carolina"}}
          : {"@type":"Thing","name":definition.about},
        "inLanguage": "en-US"
      };
      if (definition.placeSchema) Object.assign(pageNode, definition.placeSchema);
      filteredGraph.push(pageNode);
    }
    schema["@graph"] = filteredGraph;
    html = html.replace(schemaScript[0], `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  }

  const rootStart = html.indexOf('<div id="root">');
  const rootEnd = html.indexOf("</div>\n    <script type=\"module\"", rootStart);
  if (rootStart >= 0 && rootEnd > rootStart) {
    const rootClose = rootEnd + "</div>".length;
    html = html.slice(0, rootStart) + '<div id="root">' + definition.fallbackHtml + '</div>' + html.slice(rootClose);
  }

  return html;
}

const routes = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname.replace(/\/$/, "") || "/");
let written = 0;
for (const route of routes) {
  const definition = routeDefinition(route);
  if (!definition) {
    console.warn(`[prerender-seo] Skipped unknown sitemap route: ${route}`);
    continue;
  }
  const html = renderStaticRoute(route, definition);
  if (route === "/") {
    await writeFile(path.join(distDir, "index.html"), html, "utf8");
  } else {
    const outputDir = path.join(distDir, route.slice(1));
    await mkdir(outputDir, {recursive:true});
    await writeFile(path.join(outputDir, "index.html"), html, "utf8");
  }
  written += 1;
}
if (written !== routes.length) {
  throw new Error(`[prerender-seo] Generated ${written} of ${routes.length} sitemap routes.`);
}
console.log(`[prerender-seo] Wrote static HTML and route metadata for all ${written} sitemap routes.`);
