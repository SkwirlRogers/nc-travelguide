import React, { useEffect, useState } from "react";
import { countyFeaturePath, getCountyFeatureMap, getCountyGeometryCollection, normalizeCountyMapName } from "../utils/countyGeometry";

export default function CountyOutlineMap({ countyName, feature: suppliedFeature, className = "" }) {
  const [feature, setFeature] = useState(suppliedFeature || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (suppliedFeature) {
      setFeature(suppliedFeature);
      return;
    }
    let active = true;
    getCountyGeometryCollection()
      .then((collection) => {
        if (active) setFeature(getCountyFeatureMap(collection).get(normalizeCountyMapName(countyName)) || null);
      })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [countyName, suppliedFeature]);

  const path = countyFeaturePath(feature);
  return (
    <div className={`county-outline-map ${className}`} role="img" aria-label={`${countyName} County boundary map`}>
      {path ? (
        <svg viewBox="0 0 160 100" aria-hidden="true">
          <path d={path} fill="#d9e9e4" stroke="#176b5b" strokeWidth="1.8" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="#ffffff" strokeWidth="0.55" strokeLinejoin="round" />
        </svg>
      ) : (
        <div className="county-outline-fallback" aria-hidden="true">
          <span>{failed ? "Map temporarily unavailable" : "Loading county map…"}</span>
        </div>
      )}
      <span className="county-outline-caption">{countyName} County</span>
    </div>
  );
}
