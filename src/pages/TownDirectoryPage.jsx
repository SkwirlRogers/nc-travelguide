import React, { useMemo, useState } from "react";
import { Search, MapPin, Building2 } from "lucide-react";
import citiesData from "../data/cities.json";
import countiesData from "../data/counties.json";
import { getCountyMacroRegions } from "../utils/regionHelpers";

const normalize = (value) => String(value || "").toLowerCase()
  .replace(/\s+county$/i, "").replace(/[\s_-]/g, "").trim();

function townCountyRecords(town) {
  const refs = String(town.County || "").split("/").map((part) => part.trim());
  return refs.map((ref) => countiesData.find((county) => normalize(county.County) === normalize(ref))).filter(Boolean);
}

export default function TownDirectoryPage({ navigate }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const towns = useMemo(() => citiesData.map((town) => {
    const counties = townCountyRecords(town);
    return {
      ...town,
      countyNames: counties.map((county) => county.County),
      macroRegions: [...new Set(counties.flatMap(getCountyMacroRegions))]
    };
  }), []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return towns.filter((town) => {
      const matchesQuery = !q || [town.City, town.County, town.Description, ...town.countyNames].join(" ").toLowerCase().includes(q);
      const matchesRegion = region === "all" || town.macroRegions.includes(region);
      return matchesQuery && matchesRegion;
    });
  }, [towns, query, region]);

  return (
    <div className="animate-fade-in" style={{ padding: "3rem 0 4rem" }}>
      <div className="container">
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="badge badge-amber" style={{ marginBottom: ".75rem" }}><Building2 size={15} /> Towns & Communities</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", marginBottom: ".7rem" }}>Explore North Carolina's Towns</h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "760px", margin: "0 auto", lineHeight: 1.7 }}>
            Browse community profiles across all four guide regions. Each profile connects local context to its county guide, regional geography, coordinates, and available municipal resources.
          </p>
        </header>

        <section className="glass-panel" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: ".65rem", background: "rgba(255,255,255,.05)", padding: ".75rem 1rem", borderRadius: "var(--radius-md)" }}>
              <Search size={18} color="var(--accent-amber)" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search towns, counties, or descriptions" aria-label="Search towns" style={{ width: "100%", background: "transparent", border: 0, outline: 0, color: "var(--text-primary)" }} />
            </label>
            <select value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Filter by macro region" style={{ background: "rgba(255,255,255,.08)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,.15)", borderRadius: "var(--radius-md)", padding: ".7rem 1rem" }}>
              <option value="all">All four regions</option>
              <option value="Mountains">Mountains</option>
              <option value="Central Piedmont">Central Piedmont</option>
              <option value="Atlantic Coastal">Atlantic Coastal</option>
              <option value="Sandhills / Inner Coastal">Sandhills / Inner Coastal</option>
            </select>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>
          <span>Showing <strong>{results.length}</strong> of {towns.length} communities</span>
          {(query || region !== "all") && <button onClick={() => { setQuery(""); setRegion("all"); }} style={{ color: "var(--accent-amber-light)" }}>Clear filters</button>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
          {results.map((town) => (
            <article key={town.Slug} className="glass-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: ".65rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".5rem" }}>
                <h2 style={{ fontSize: "1.12rem", margin: 0 }}>{town.City}</h2>
                <MapPin size={16} color="var(--accent-amber)" />
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: ".88rem", lineHeight: 1.55, flex: 1 }}>{town.Description}</p>
              <div style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>
                {town.countyNames.join(" / ")}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
                {town.macroRegions.map((name) => <span key={name} className="badge badge-blue">{name}</span>)}
              </div>
              <button onClick={() => navigate("/towns/" + town.Slug)} className="btn btn-secondary" style={{ marginTop: ".25rem", justifyContent: "center" }}>
                Explore community profile →
              </button>
            </article>
          ))}
        </div>
        {results.length === 0 && <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>No communities match those filters. Try another search.</div>}
      </div>
    </div>
  );
}
