import React, { useMemo } from "react";
import { MapPin, ExternalLink, ArrowLeft, Building2, Compass } from "lucide-react";
import citiesData from "../data/cities.json";
import countiesData from "../data/counties.json";
import attractionsData from "../data/attractions.json";
import { getCountyMacroRegions } from "../utils/regionHelpers";

const normalize = (value) => String(value || "").toLowerCase()
  .replace(/\s+county$/i, "").replace(/[\s_-]/g, "").trim();

function countyRecordsForTown(town) {
  const refs = String(town?.County || "").split("/").map((part) => part.trim()).filter(Boolean);
  return refs.map((ref) => countiesData.find((county) => normalize(county.County) === normalize(ref))).filter(Boolean);
}

export default function TownDetailPage({ townSlug, navigate }) {
  const town = citiesData.find((item) => item.Slug === townSlug);
  const countyRecords = useMemo(() => countyRecordsForTown(town), [town]);
  const macroRegions = [...new Set(countyRecords.flatMap(getCountyMacroRegions))];
  const subRegions = [...new Set(countyRecords.map((county) => county["Sub-Region"]).filter(Boolean))];
  const countyNames = countyRecords.map((county) => county.County);
  const relatedAttractions = attractionsData.filter((item) => {
    const refs = String(item.County || "").split("/").map((part) => normalize(part.trim()));
    return refs.some((ref) => countyRecords.some((county) => normalize(county.County) === ref));
  }).slice(0, 6);

  if (!town) {
    return <section className="container" style={{ padding: "4rem 1rem" }}>
      <h1>Town profile not found</h1>
      <p>Return to the statewide directory to explore other North Carolina communities.</p>
      <button className="btn btn-primary" onClick={() => navigate("/counties")}>Browse counties</button>
    </section>;
  }

  const lat = Number(town.Latitude);
  const lon = Number(town.Longitude);
  const mapUrl = Number.isFinite(lat) && Number.isFinite(lon)
    ? "https://www.google.com/maps?q=" + encodeURIComponent(lat + "," + lon)
    : null;

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <button onClick={() => navigate("/counties")} className="btn btn-ghost" style={{ marginBottom: "1.25rem" }}>
          <ArrowLeft size={16} /> Back to county directory
        </button>

        <header className="glass-panel" style={{ padding: "clamp(1.5rem,4vw,3rem)", marginBottom: "1.5rem" }}>
          <div className="badge badge-amber" style={{ marginBottom: "0.9rem" }}>
            <Building2 size={15} /> Town & Community Guide
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", margin: "0 0 .75rem" }}>
            {town.City}, North Carolina
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.12rem", maxWidth: "850px", lineHeight: 1.7 }}>
            {town.Description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".65rem", marginTop: "1.25rem" }}>
            {macroRegions.map((region) => <span className="badge badge-blue" key={region}>{region}</span>)}
            {subRegions.map((region) => <span className="badge" key={region}>{region}</span>)}
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <section className="glass-card" style={{ padding: "1.4rem" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}><MapPin size={18} style={{ verticalAlign: "middle" }} /> Location & county connections</h2>
            {countyRecords.length ? countyRecords.map((county) => (
              <p key={county.Slug} style={{ margin: ".45rem 0" }}>
                <a href={"/counties/" + county.Slug} onClick={(event) => { event.preventDefault(); navigate("/counties/" + county.Slug); }}>
                  {county.County} county guide →
                </a>
              </p>
            )) : <p>County connection is being reviewed.</p>}
            {mapUrl && <p style={{ marginTop: "1rem" }}><a href={mapUrl} target="_blank" rel="noreferrer">View mapped coordinates <ExternalLink size={13} /></a></p>}
            {town.Population && <p style={{ color: "var(--text-secondary)", marginTop: ".8rem" }}>Population figure in source directory: {String(town.Population).replace(/\.00$/, "")}</p>}
          </section>

          <section className="glass-card" style={{ padding: "1.4rem" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}><Compass size={18} style={{ verticalAlign: "middle" }} /> Plan a visit</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>Use this community profile as a starting point, then check local sources for current events, access, opening hours, and visitor services.</p>
            {town["Tourism Website"] && /^https?:\/\//i.test(town["Tourism Website"]) && (
              <p style={{ marginTop: "1rem" }}>
                <a href={town["Tourism Website"]} target="_blank" rel="noreferrer">Official community website <ExternalLink size={13} /></a>
              </p>
            )}
          </section>
        </div>

        {relatedAttractions.length > 0 && (
          <section className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", marginBottom: ".4rem" }}>Explore more in {countyNames.length === 1 ? countyNames[0] : "the connected counties"}</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>These directory entries are associated with the same county or counties; they are not necessarily located within the town limits.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: ".85rem" }}>
              {relatedAttractions.map((item) => (
                <article key={item.Slug} className="glass-card" style={{ padding: "1rem" }}>
                  <div className="badge badge-amber">{item.Category || "Attraction"}</div>
                  <h3 style={{ margin: ".6rem 0 .35rem", fontSize: "1rem" }}>{item.Attractions}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: ".9rem", lineHeight: 1.55 }}>{item.Description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <p style={{ color: "var(--text-secondary)", fontSize: ".85rem", lineHeight: 1.6 }}>
          Directory note: descriptions, population figures, and municipal links come from the guide's source dataset. Confirm current details with the linked local source before traveling.
        </p>
      </div>
    </div>
  );
}
