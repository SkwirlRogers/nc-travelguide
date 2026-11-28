import React from "react";
import { MapPin, ExternalLink, ArrowLeft, Landmark } from "lucide-react";
import attractionsData from "../data/attractions.json";
import countiesData from "../data/counties.json";

const normalize = (value) => String(value || "").toLowerCase()
  .replace(/\s+county$/i, "").replace(/[\s_-]/g, "").trim();

export default function AttractionDetailPage({ attractionSlug, navigate }) {
  const attraction = attractionsData.find((item) => item.Slug === attractionSlug);
  if (!attraction) {
    return <section className="container" style={{ padding: "4rem 1rem" }}>
      <h1>Attraction profile not found</h1>
      <p>Return to the statewide experiences directory to discover more places.</p>
      <button className="btn btn-primary" onClick={() => navigate("/experiences")}>Browse experiences</button>
    </section>;
  }
  const countyRefs = String(attraction.County || "").split("/").map((part) => part.trim());
  const countyRecords = countyRefs.map((ref) => countiesData.find((county) => normalize(county.County) === normalize(ref))).filter(Boolean);
  const website = String(attraction["Website / Affiliate Link"] || "");
  const hasWebsite = /^https?:\/\//i.test(website);
  const mapUrl = attraction.Address ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(attraction.Address + ", North Carolina") : null;

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <button onClick={() => navigate("/experiences")} className="btn btn-ghost" style={{ marginBottom: "1.25rem" }}>
          <ArrowLeft size={16} /> Back to experiences
        </button>
        <header className="glass-panel" style={{ padding: "clamp(1.5rem,4vw,3rem)", marginBottom: "1.5rem" }}>
          <div className="badge badge-amber" style={{ marginBottom: ".9rem" }}><Landmark size={15} /> North Carolina Attraction</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", margin: "0 0 .75rem" }}>{attraction.Attractions}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "850px" }}>{attraction.Description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginTop: "1.1rem" }}>
            <span className="badge badge-blue">{attraction.Category || "Attraction"}</span>
            {attraction.City && <span className="badge">{attraction.City}</span>}
            {countyRecords.map((county) => <span className="badge" key={county.Slug}>{county.County}</span>)}
          </div>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1rem" }}>
          <section className="glass-card" style={{ padding: "1.4rem" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}><MapPin size={18} style={{ verticalAlign: "middle" }} /> Location</h2>
            <p>{attraction.Address || [attraction.City, "North Carolina"].filter(Boolean).join(", ")}</p>
            {mapUrl && <p style={{ marginTop: "1rem" }}><a href={mapUrl} target="_blank" rel="noreferrer">Open map <ExternalLink size={13} /></a></p>}
            <h3 style={{ fontSize: "1rem", marginTop: "1.2rem" }}>County guide</h3>
            {countyRecords.map((county) => <p key={county.Slug}><a href={"/counties/" + county.Slug} onClick={(event) => { event.preventDefault(); navigate("/counties/" + county.Slug); }}>{county.County} County →</a></p>)}
          </section>
          <section className="glass-card" style={{ padding: "1.4rem" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}>Visitor resource</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>Check the destination's own visitor information for current hours, admission, accessibility, closures, and seasonal operations.</p>
            {hasWebsite && <p style={{ marginTop: "1rem" }}><a href={website} target="_blank" rel="noreferrer">Visit listed website <ExternalLink size={13} /></a></p>}
          </section>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: ".85rem", lineHeight: 1.6, marginTop: "1.5rem" }}>
          Directory note: the description, location, and website link are carried from the guide's attraction dataset. The link is a directory reference and has not been independently confirmed as a current operating or ticketing page.
        </p>
      </div>
    </div>
  );
}
