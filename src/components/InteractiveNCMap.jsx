import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Compass, Layers, Search } from "lucide-react";
import { getAllCounties } from "../utils/countyDirectoryHelpers";
import { getCountyMacroRegions } from "../utils/regionHelpers";
import { countyCollectionPaths, getCountyGeometryCollection, normalizeCountyMapName } from "../utils/countyGeometry";

const REGIONS = ["Mountains", "Central Piedmont", "Sandhills / Inner Coastal", "Atlantic Coastal"];
const REGION_COLORS = {
  "Mountains": "#c58b36",
  "Central Piedmont": "#4777a8",
  "Atlantic Coastal": "#368b83",
  "Sandhills / Inner Coastal": "#8065a9"
};

export default function InteractiveNCMap({ navigate, compact = false }) {
  const counties = useMemo(() => getAllCounties(), []);
  const [collection, setCollection] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [filterQuery, setFilterQuery] = useState("");
  const [hoveredCounty, setHoveredCounty] = useState("");

  useEffect(() => {
    let active = true;
    getCountyGeometryCollection()
      .then((data) => { if (active) setCollection(data); })
      .catch((error) => { if (active) setLoadError(error.message || "County boundaries could not be loaded."); });
    return () => { active = false; };
  }, []);

  const countyByName = useMemo(() => new Map(counties.map((county) => [normalizeCountyMapName(county.rawCountyName || county.County), county])), [counties]);
  const paths = useMemo(() => countyCollectionPaths(collection), [collection]);
  const filteredCounties = counties.filter((county) => {
    const regions = getCountyMacroRegions(county);
    const query = filterQuery.trim().toLowerCase();
    const matchesRegion = selectedRegion === "ALL" || regions.includes(selectedRegion);
    const matchesQuery = !query || county.County.toLowerCase().includes(query) || (county["Major Cities"] || "").toLowerCase().includes(query);
    return matchesRegion && matchesQuery;
  });
  const visibleNames = new Set(filteredCounties.map((county) => normalizeCountyMapName(county.rawCountyName || county.County)));
  const selectedCounty = countyByName.get(normalizeCountyMapName(hoveredCounty));
  const selectedCountyRegions = selectedCounty ? getCountyMacroRegions(selectedCounty) : [];

  return (
    <section className={compact ? "nc-county-atlas nc-county-atlas-compact" : "nc-county-atlas"}>
      <div className="container">
        <div className="nc-atlas-heading">
          <div className="badge badge-amber"><Layers size={14} /> Interactive County Atlas</div>
          <h2>Explore the <span className="text-gradient-amber">100 County Map</span></h2>
          <p>Search, hover, or select a county on the actual county-boundary map. Filter it using our four North Carolina travel regions.</p>
        </div>

        <div className="nc-atlas-filters">
          <label className="nc-atlas-search">
            <Search size={18} />
            <input id="nc-atlas-search" name="county-search" autoComplete="off" value={filterQuery} onChange={(event) => setFilterQuery(event.target.value)} placeholder="Find a county or major city…" aria-label="Search North Carolina counties or cities" />
          </label>
          <div className="nc-atlas-region-filters" aria-label="Filter by macro-region">
            <button className={selectedRegion === "ALL" ? "active" : ""} onClick={() => setSelectedRegion("ALL")}>All 100</button>
            {REGIONS.map((region) => <button key={region} className={selectedRegion === region ? "active" : ""} onClick={() => setSelectedRegion(region)}>{region}</button>)}
          </div>
        </div>

        <div className="nc-atlas-layout">
          <div className="nc-atlas-map-panel">
            <div className="nc-atlas-map-meta">
              <strong>North Carolina county boundaries</strong>
              <span>{collection ? paths.length + " mapped counties" : "Loading official boundary data…"}</span>
            </div>
            {collection ? (
              <svg className="nc-atlas-map" viewBox="0 0 900 500" role="group" aria-label="Interactive map of all 100 North Carolina counties">
                {paths.map(({ name, fips, d }) => {
                  const key = normalizeCountyMapName(name);
                  const county = countyByName.get(key);
                  const regions = county ? getCountyMacroRegions(county) : [];
                  const color = REGION_COLORS[regions[0]] || "#64748b";
                  const visible = visibleNames.has(key);
                  return (
                    <path
                      key={fips || key}
                      d={d}
                      fill={color}
                      fillOpacity={!visible ? 0.12 : hoveredCounty && normalizeCountyMapName(hoveredCounty) !== key ? 0.56 : 0.86}
                      stroke="#fffdf8"
                      strokeWidth={hoveredCounty && normalizeCountyMapName(hoveredCounty) === key ? 2.8 : 1.25}
                      vectorEffect="non-scaling-stroke"
                      className={visible ? "nc-county-shape" : "nc-county-shape nc-county-muted"}
                      tabIndex={visible && county ? 0 : -1}
                      role="button"
                      aria-label={county?.County || name}
                      onMouseEnter={() => setHoveredCounty(name)}
                      onMouseLeave={() => setHoveredCounty("")}
                      onFocus={() => setHoveredCounty(name)}
                      onBlur={() => setHoveredCounty("")}
                      onClick={() => county && navigate("/counties/" + county.slug)}
                      onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && county) navigate("/counties/" + county.slug); }}
                    >
                      <title>{county?.County || name}{county?.["Major Cities"] ? " — " + county["Major Cities"] : ""}</title>
                    </path>
                  );
                })}
              </svg>
            ) : (
              <div className="nc-atlas-loading" role="status">{loadError || "Loading county boundary geometry…"}</div>
            )}
            <div className="nc-atlas-legend">
              {REGIONS.map((region) => <span key={region}><i style={{ background: REGION_COLORS[region] }} />{region}</span>)}
            </div>
            <div className="nc-atlas-source">County boundary geometry: North Carolina Geodetic Survey / NC OneMap ArcGIS service</div>
          </div>

          <aside className="nc-atlas-results">
            <div className="nc-atlas-result-top">
              <div><strong>{filteredCounties.length}</strong><span> counties in view</span></div>
              {selectedCounty && <div className="nc-atlas-hover-card"><small>Selected on map</small><b>{selectedCounty.County}</b><span>{selectedCounty["Major Cities"] || "County communities"}</span></div>}
            </div>
            <div className="nc-atlas-county-list">
              {filteredCounties.map((county) => (
                <button key={county.slug} className="nc-atlas-county-row" onMouseEnter={() => setHoveredCounty(county.rawCountyName)} onMouseLeave={() => setHoveredCounty("")} onFocus={() => setHoveredCounty(county.rawCountyName)} onBlur={() => setHoveredCounty("")} onClick={() => navigate("/counties/" + county.slug)}>
                  <span><b>{county.rawCountyName} County</b><small>{county["Major Cities"] || "County communities"}</small></span>
                  <ArrowRight size={16} />
                </button>
              ))}
              {!filteredCounties.length && <p className="nc-atlas-empty">No counties match that search. Try a county name or city.</p>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
